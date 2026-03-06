const { Payment, Student, Promotion, TuitionPackage, Level, Enrollment, Class: ClassModel, Shift } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db_config');
const { calculateEndDate, calculateRemainingSessions } = require('../utils/scheduleCalculator');

// Get all payments (grouped by student for single-card view)
const getAllPayments = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        if (search) {
            where = { '$student.full_name$': { [Op.like]: `%${search}%` } };
        }

        const payments = await Payment.findAll({
            where,
            include: [
                { model: Student, as: 'student', attributes: ['id', 'full_name', 'learning_status'] },
                { model: Promotion, as: 'promotion', attributes: ['id', 'name', 'discount_percent', 'condition_type'] },
                { model: TuitionPackage, as: 'package', attributes: ['id', 'week_duration', 'sessions_per_week'], include: [{ model: Level, as: 'level', attributes: ['level_name'] }] }
            ],
            order: [['payment_date', 'DESC']],
            subQuery: false
        });
        res.json(payments);
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Get students with payment summary (for single-card-per-student view)
const getStudentPaymentSummary = async (req, res) => {
    try {
        const { search } = req.query;
        let where = { status: 1 };
        if (search) {
            where.full_name = { [Op.like]: `%${search}%` };
        }

        const students = await Student.findAll({
            where,
            attributes: ['id', 'full_name', 'learning_status'],
            include: [
                {
                    model: Enrollment, as: 'enrollments',
                    where: { status: { [Op.in]: ['dang_hoc', 'chua_dong_tien', 'bao_luu'] } },
                    required: false,
                    include: [{
                        model: ClassModel, as: 'class',
                        attributes: ['id', 'class_name', 'schedule_days', 'shift_id'],
                        include: [{ model: Shift, as: 'shift', attributes: ['shift_name', 'start_time', 'end_time'] }]
                    }]
                },
                {
                    model: Payment, as: 'payments',
                    where: { payment_status: 'thanh_cong' },
                    required: false,
                    order: [['end_date', 'DESC']],
                    limit: 1,
                    attributes: ['id', 'end_date', 'start_date', 'remaining_sessions', 'payment_status', 'freeze_date']
                },
                { model: Promotion, as: 'promotion', attributes: ['id', 'name', 'discount_percent'] }
            ],
            order: [['full_name', 'ASC']]
        });

        // Calculate payment status for each student
        const today = new Date().toISOString().slice(0, 10);
        const result = students.map(s => {
            const sj = s.toJSON();
            const latestPayment = sj.payments?.[0];
            const enrollment = sj.enrollments?.[0];

            let paymentState = 'chua_dong';
            if (latestPayment) {
                if (latestPayment.freeze_date) paymentState = 'bao_luu';
                else if (latestPayment.end_date >= today) paymentState = 'con_han';
                else paymentState = 'het_han';
            }

            return {
                ...sj,
                latestPayment,
                enrollment,
                paymentState,
                daysUntilExpiry: latestPayment?.end_date
                    ? Math.ceil((new Date(latestPayment.end_date) - new Date()) / (1000 * 60 * 60 * 24))
                    : null
            };
        });

        // Sort: expired/expiring first
        result.sort((a, b) => {
            const order = { het_han: 0, chua_dong: 1, bao_luu: 2, con_han: 3 };
            return (order[a.paymentState] || 9) - (order[b.paymentState] || 9);
        });

        res.json(result);
    } catch (error) {
        console.error('Get student payment summary error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Get payment history for a specific student
const getStudentPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const payments = await Payment.findAll({
            where: { student_id: studentId },
            include: [
                { model: Promotion, as: 'promotion', attributes: ['id', 'name', 'discount_percent'] },
                { model: TuitionPackage, as: 'package', attributes: ['week_duration', 'sessions_per_week'], include: [{ model: Level, as: 'level', attributes: ['level_name'] }] }
            ],
            order: [['payment_date', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Create payment with SMART billing
const createPayment = async (req, res) => {
    try {
        const { student_id, package_id, payment_method, note, start_date_override, end_date_override } = req.body;

        if (!student_id || !package_id) {
            return res.status(400).json({ message: 'Vui lòng chọn học viên và gói học phí' });
        }

        // 1) Get student with promotion
        const student = await Student.findByPk(student_id, {
            include: [
                { model: Promotion, as: 'promotion' },
                {
                    model: Enrollment, as: 'enrollments',
                    where: { status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] } },
                    required: false,
                    include: [{ model: ClassModel, as: 'class', attributes: ['schedule_days', 'shift_id'] }]
                }
            ]
        });
        if (!student) return res.status(404).json({ message: 'Không tìm thấy học viên' });

        // 2) Get tuition package
        const pkg = await TuitionPackage.findByPk(package_id, {
            include: [{ model: Level, as: 'level' }]
        });
        if (!pkg) return res.status(404).json({ message: 'Không tìm thấy gói học phí' });

        // 3) Calculate amounts
        const original_amount = parseFloat(pkg.tuition_fee);
        let discount_percent = 0;
        let promotion_id = null;

        if (student.promotion) {
            discount_percent = student.promotion.discount_percent || 0;
            promotion_id = student.promotion.id;
        }

        const discount_amount = Math.round(original_amount * discount_percent / 100);
        const final_amount = original_amount - discount_amount;

        // 4) Smart date calculation
        const totalSessions = pkg.week_duration * (pkg.sessions_per_week || 3);

        // Determine start date: use override, or continuation from last payment, or today
        let startDate;
        if (start_date_override) {
            startDate = start_date_override;
        } else {
            // Check for existing payment to continue
            const lastPayment = await Payment.findOne({
                where: { student_id, payment_status: 'thanh_cong' },
                order: [['end_date', 'DESC']]
            });
            if (lastPayment?.end_date) {
                const lastEnd = new Date(lastPayment.end_date);
                if (lastEnd < new Date()) {
                    // Expired: continue from day after old end_date (truy thu logic)
                    lastEnd.setDate(lastEnd.getDate() + 1);
                    startDate = lastEnd.toISOString().slice(0, 10);
                } else {
                    // Still valid: continue from day after current end
                    lastEnd.setDate(lastEnd.getDate() + 1);
                    startDate = lastEnd.toISOString().slice(0, 10);
                }
            } else {
                startDate = new Date().toISOString().slice(0, 10);
            }
        }

        // Calculate end date based on schedule
        let endDate;
        if (end_date_override) {
            endDate = end_date_override;
        } else {
            const enrollment = student.enrollments?.[0];
            const scheduleDays = enrollment?.class?.schedule_days || '';
            endDate = calculateEndDate(startDate, totalSessions, scheduleDays);
        }

        // 5) Find enrollment
        const enrollment = await Enrollment.findOne({
            where: { student_id, status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] } }
        });

        // 6) Generate transaction code
        const transaction_code = `PAY-${Date.now()}-${student_id}`;

        const payment = await Payment.create({
            enrollment_id: enrollment?.id || null,
            student_id,
            package_id,
            weeks: pkg.week_duration,
            total_sessions: totalSessions,
            remaining_sessions: totalSessions,
            original_amount,
            discount_amount,
            promotion_id,
            final_amount,
            start_date: startDate,
            end_date: endDate,
            payment_method: payment_method || 'tien_mat',
            payment_status: 'thanh_cong',
            transaction_code,
            note: note || `Gói ${pkg.week_duration} tuần - ${pkg.level?.level_name || ''}`
        });

        // Return with includes
        const result = await Payment.findByPk(payment.id, {
            include: [
                { model: Student, as: 'student', attributes: ['id', 'full_name'] },
                { model: Promotion, as: 'promotion', attributes: ['id', 'name', 'discount_percent'] }
            ]
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Freeze (Bảo lưu) — save remaining sessions
const freezePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { freeze_date } = req.body;
        const payment = await Payment.findByPk(paymentId, {
            include: [
                { model: Student, as: 'student' },
                { model: Enrollment, as: 'enrollment', include: [{ model: ClassModel, as: 'class' }] }
            ]
        });
        if (!payment) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });

        const dateToFreeze = freeze_date || new Date().toISOString().slice(0, 10);
        const scheduleDays = payment.enrollment?.class?.schedule_days || '';

        // Calculate remaining sessions from freeze date to end_date
        const remaining = calculateRemainingSessions(dateToFreeze, payment.end_date, scheduleDays);

        await payment.update({
            remaining_sessions: remaining,
            freeze_date: dateToFreeze
        });

        // Update student status
        if (payment.student) {
            await payment.student.update({ learning_status: 'bao_luu' });
        }

        // Update enrollment status
        if (payment.enrollment) {
            await payment.enrollment.update({ status: 'bao_luu' });
        }

        res.json({
            message: `Đã bảo lưu. Còn ${remaining} buổi sẽ được giữ lại.`,
            remaining_sessions: remaining
        });
    } catch (error) {
        console.error('Freeze payment error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Unfreeze (Đi học lại) — calculate new end_date from remaining sessions
const unfreezePayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { resume_date } = req.body;
        const payment = await Payment.findByPk(paymentId, {
            include: [
                { model: Student, as: 'student' },
                { model: Enrollment, as: 'enrollment', include: [{ model: ClassModel, as: 'class' }] }
            ]
        });
        if (!payment) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        if (!payment.freeze_date) return res.status(400).json({ message: 'Hóa đơn chưa được bảo lưu' });

        const dateToResume = resume_date || new Date().toISOString().slice(0, 10);
        const scheduleDays = payment.enrollment?.class?.schedule_days || '';
        const remaining = payment.remaining_sessions || 0;

        // Calculate new end date from resume date + remaining sessions
        const newEndDate = calculateEndDate(dateToResume, remaining, scheduleDays);

        await payment.update({
            end_date: newEndDate,
            freeze_date: null,
            unfreeze_date: dateToResume
        });

        // Update student status
        if (payment.student) {
            await payment.student.update({ learning_status: 'dang_hoc' });
        }

        // Update enrollment status
        if (payment.enrollment) {
            await payment.enrollment.update({ status: 'dang_hoc' });
        }

        res.json({
            message: `Đã mở bảo lưu. Ngày hết hạn mới: ${newEndDate} (${remaining} buổi còn lại).`,
            new_end_date: newEndDate,
            remaining_sessions: remaining
        });
    } catch (error) {
        console.error('Unfreeze payment error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Cancel payment
const cancelPayment = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.paymentId);
        if (!payment) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        await payment.update({ payment_status: 'da_huy' });
        res.json({ message: 'Đã hủy hóa đơn' });
    } catch (error) {
        console.error('Cancel payment error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Smart suggestion: get suggested start date for a student
const getSuggestedStartDate = async (req, res) => {
    try {
        const { studentId } = req.params;
        const lastPayment = await Payment.findOne({
            where: { student_id: studentId, payment_status: 'thanh_cong' },
            order: [['end_date', 'DESC']]
        });

        if (lastPayment?.end_date) {
            const nextDay = new Date(lastPayment.end_date);
            nextDay.setDate(nextDay.getDate() + 1);
            res.json({
                suggested_start: nextDay.toISOString().slice(0, 10),
                last_end_date: lastPayment.end_date,
                is_expired: new Date(lastPayment.end_date) < new Date()
            });
        } else {
            res.json({
                suggested_start: new Date().toISOString().slice(0, 10),
                last_end_date: null,
                is_expired: false
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

module.exports = {
    getAllPayments, getStudentPaymentSummary, getStudentPaymentHistory,
    createPayment, freezePayment, unfreezePayment, cancelPayment, getSuggestedStartDate
};

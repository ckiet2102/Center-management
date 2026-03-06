const { Class: ClassModel, Teacher, Level, Room, Shift, Enrollment, Student, ClassLog } = require('../models');
const { Op } = require('sequelize');

// ──── Helper: Check schedule conflicts ────
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/**
 * Parse schedule_days string to array.
 * Accepts: "T2,T4,T6" or "T2-T4-T6" or "Thứ 2, Thứ 4"
 */
const parseDays = (daysStr) => {
    if (!daysStr) return [];
    return daysStr.split(/[,\-|;\s]+/).map(d => d.trim()).filter(d => WEEKDAYS.includes(d));
};

/**
 * Check if two sets of days overlap.
 */
const daysOverlap = (days1, days2) => {
    const set2 = new Set(days2);
    return days1.some(d => set2.has(d));
};

/**
 * Check for teacher or room schedule conflicts.
 * Returns conflict message or null.
 */
const checkScheduleConflicts = async (teacher_id, room_id, shift_id, schedule_days, excludeClassId = null) => {
    if (!shift_id || !schedule_days) return null;

    const newDays = parseDays(schedule_days);
    if (newDays.length === 0) return null;

    // Build where clause for active classes with same shift
    const where = {
        shift_id,
        status: 1,
    };
    if (excludeClassId) {
        where.id = { [Op.ne]: excludeClassId };
    }

    const errors = [];

    // 1) Check TEACHER conflict
    if (teacher_id) {
        const teacherClasses = await ClassModel.findAll({
            where: { ...where, teacher_id },
            include: [
                { model: Teacher, as: 'teacher', attributes: ['full_name'] },
                { model: Shift, as: 'shift', attributes: ['shift_name', 'start_time', 'end_time'] }
            ]
        });

        for (const cls of teacherClasses) {
            const existingDays = parseDays(cls.schedule_days);
            if (daysOverlap(newDays, existingDays)) {
                const overlapping = newDays.filter(d => existingDays.includes(d)).join(', ');
                const shift = cls.shift;
                const timeStr = shift ? `${shift.shift_name} (${shift.start_time}–${shift.end_time})` : `Ca ${shift_id}`;
                errors.push(
                    `Giảng viên "${cls.teacher?.full_name}" đã có lịch dạy lớp "${cls.class_name}" vào ${overlapping} — ${timeStr}. Vui lòng chọn ca khác hoặc giảng viên khác.`
                );
                break;
            }
        }
    }

    // 2) Check ROOM conflict
    if (room_id) {
        const roomClasses = await ClassModel.findAll({
            where: { ...where, room_id },
            include: [
                { model: Room, as: 'room', attributes: ['room_name'] },
                { model: Shift, as: 'shift', attributes: ['shift_name', 'start_time', 'end_time'] }
            ]
        });

        for (const cls of roomClasses) {
            const existingDays = parseDays(cls.schedule_days);
            if (daysOverlap(newDays, existingDays)) {
                const overlapping = newDays.filter(d => existingDays.includes(d)).join(', ');
                const shift = cls.shift;
                const timeStr = shift ? `${shift.shift_name} (${shift.start_time}–${shift.end_time})` : `Ca ${shift_id}`;
                errors.push(
                    `Phòng "${cls.room?.room_name}" đã được sử dụng bởi lớp "${cls.class_name}" vào ${overlapping} — ${timeStr}. Vui lòng chọn phòng khác.`
                );
                break;
            }
        }
    }

    return errors.length > 0 ? errors.join('\n') : null;
};


// ──── Controllers ────

const getAllClasses = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                [Op.or]: [
                    { class_name: { [Op.like]: `%${search}%` } },
                    { '$teacher.full_name$': { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const classes = await ClassModel.findAll({
            where,
            include: [
                { model: Teacher, as: 'teacher', attributes: ['id', 'full_name', 'code_name'] },
                { model: Level, as: 'level', attributes: ['id', 'level_name', 'course_duration'] },
                { model: Room, as: 'room', attributes: ['id', 'room_name', 'status'] },
                { model: Shift, as: 'shift', attributes: ['id', 'shift_name', 'days', 'start_time', 'end_time'] }
            ],
            order: [['id', 'ASC']],
            subQuery: false
        });
        res.json(classes);
    } catch (error) {
        console.error('Get classes error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const createClass = async (req, res) => {
    try {
        const { class_name, teacher_id, room_id, shift_id, schedule_days } = req.body;
        if (!class_name) {
            return res.status(400).json({ message: 'Tên lớp là bắt buộc' });
        }

        // Schedule conflict check
        const conflict = await checkScheduleConflicts(teacher_id, room_id, shift_id, schedule_days);
        if (conflict) {
            return res.status(400).json({ message: conflict });
        }

        const newClass = await ClassModel.create(req.body);

        await ClassLog.create({
            record_id: newClass.id,
            actor_id: req.user.id,
            action: 'THEM',
            description: `Tạo lớp: ${newClass.class_name}`
        });

        res.status(201).json(newClass);
    } catch (error) {
        console.error('Create class error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const updateClass = async (req, res) => {
    try {
        const classItem = await ClassModel.findByPk(req.params.id);
        if (!classItem) {
            return res.status(404).json({ message: 'Không tìm thấy lớp học' });
        }

        const { teacher_id, room_id, shift_id, schedule_days } = req.body;

        // Use existing values if not provided in update
        const checkTeacher = teacher_id !== undefined ? teacher_id : classItem.teacher_id;
        const checkRoom = room_id !== undefined ? room_id : classItem.room_id;
        const checkShift = shift_id !== undefined ? shift_id : classItem.shift_id;
        const checkDays = schedule_days !== undefined ? schedule_days : classItem.schedule_days;

        // Schedule conflict check (exclude current class)
        const conflict = await checkScheduleConflicts(checkTeacher, checkRoom, checkShift, checkDays, classItem.id);
        if (conflict) {
            return res.status(400).json({ message: conflict });
        }

        await classItem.update(req.body);
        res.json(classItem);
    } catch (error) {
        console.error('Update class error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Get students enrolled in a class
const getClassStudents = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            where: { class_id: req.params.id },
            include: [{
                model: Student, as: 'student',
                attributes: ['id', 'full_name', 'phone', 'email', 'learning_status']
            }],
            order: [['registration_date', 'DESC']]
        });

        res.json(enrollments);
    } catch (error) {
        console.error('Get class students error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Add student to class (create enrollment)
// CONSTRAINT: 1 student can only be in 1 active class at a time
const addStudentToClass = async (req, res) => {
    try {
        const { student_id } = req.body;
        const class_id = req.params.id;

        if (!student_id) {
            return res.status(400).json({ message: 'Vui lòng chọn học viên' });
        }

        // Check if student is already enrolled in ANY active class
        const existingActiveEnrollment = await Enrollment.findOne({
            where: {
                student_id,
                status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] }
            },
            include: [{ model: ClassModel, as: 'class', attributes: ['class_name'] }]
        });

        if (existingActiveEnrollment) {
            const currentClassName = existingActiveEnrollment.class?.class_name || 'khác';
            return res.status(400).json({
                message: `Học viên này đã thuộc về lớp "${currentClassName}". Vui lòng xóa khỏi lớp cũ trước khi thêm vào lớp mới.`
            });
        }

        const enrollment = await Enrollment.create({
            student_id,
            class_id,
            registration_date: new Date(),
            status: 'dang_hoc'
        });

        // Update student count
        const count = await Enrollment.count({ where: { class_id, status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] } } });
        await ClassModel.update({ student_count: count }, { where: { id: class_id } });

        res.status(201).json(enrollment);
    } catch (error) {
        console.error('Add student to class error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Remove student from class
const removeStudentFromClass = async (req, res) => {
    try {
        const { student_id } = req.params;
        const class_id = req.params.id;

        const enrollment = await Enrollment.findOne({ where: { student_id, class_id } });
        if (!enrollment) {
            return res.status(404).json({ message: 'Không tìm thấy ghi danh' });
        }

        await enrollment.destroy();

        // Update student count
        const count = await Enrollment.count({ where: { class_id, status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] } } });
        await ClassModel.update({ student_count: count }, { where: { id: class_id } });

        res.json({ message: 'Đã xóa học viên khỏi lớp' });
    } catch (error) {
        console.error('Remove student error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Export class list as CSV
const exportClassCSV = async (req, res) => {
    try {
        const classItem = await ClassModel.findByPk(req.params.id, {
            include: [
                { model: Teacher, as: 'teacher', attributes: ['full_name'] },
                { model: Room, as: 'room', attributes: ['room_name'] }
            ]
        });

        if (!classItem) return res.status(404).json({ message: 'Không tìm thấy lớp' });

        const enrollments = await Enrollment.findAll({
            where: { class_id: req.params.id },
            include: [{ model: Student, as: 'student' }],
            order: [['registration_date', 'ASC']]
        });

        let csv = '\uFEFF';
        csv += `Danh sách lớp: ${classItem.class_name}\n`;
        csv += `Giáo viên: ${classItem.teacher?.full_name || ''}\n`;
        csv += `Phòng: ${classItem.room?.room_name || ''}\n\n`;
        csv += 'STT,Mã HV,Họ tên,SĐT,Email,Ngày ĐK,Trạng thái\n';

        enrollments.forEach((e, i) => {
            const s = e.student;
            csv += `${i + 1},${s?.id || ''},"${s?.full_name || ''}",${s?.phone || ''},"${s?.email || ''}",${e.registration_date || ''},${e.status}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="lop_${classItem.class_name}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('Export class CSV error:', error);
        res.status(500).json({ message: 'Lỗi xuất danh sách' });
    }
};

// Get available students (not enrolled in ANY active class)
const getAvailableStudents = async (req, res) => {
    try {
        const enrolledStudentIds = (await Enrollment.findAll({
            where: { status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] } },
            attributes: ['student_id'],
            raw: true,
            group: ['student_id']
        })).map(e => e.student_id);

        const where = enrolledStudentIds.length > 0
            ? { id: { [Op.notIn]: enrolledStudentIds }, status: 1 }
            : { status: 1 };

        const students = await Student.findAll({
            where,
            attributes: ['id', 'full_name', 'phone', 'email'],
            order: [['full_name', 'ASC']]
        });

        res.json(students);
    } catch (error) {
        console.error('Get available students error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

module.exports = { getAllClasses, createClass, updateClass, getClassStudents, addStudentToClass, removeStudentFromClass, exportClassCSV, getAvailableStudents };

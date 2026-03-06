const { Student, Promotion, Enrollment, Payment, Class: ClassModel, Teacher, StudentLog } = require('../models');
const { Op } = require('sequelize');

const getAllStudents = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                [Op.or]: [
                    { full_name: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { id: isNaN(search) ? null : parseInt(search) }
                ]
            };
        }

        const students = await Student.findAll({
            where,
            include: [
                { model: Promotion, as: 'promotion', attributes: ['id', 'name', 'discount_percent', 'condition_type'] },
                {
                    model: Enrollment, as: 'enrollments',
                    where: { status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] } },
                    required: false,
                    include: [{
                        model: ClassModel, as: 'class',
                        attributes: ['id', 'class_name'],
                        include: [{ model: Teacher, as: 'teacher', attributes: ['id', 'full_name', 'code_name'] }]
                    }]
                }
            ],
            order: [['id', 'ASC']]
        });

        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [
                { model: Promotion, as: 'promotion' },
                {
                    model: Enrollment, as: 'enrollments',
                    include: [{
                        model: ClassModel, as: 'class',
                        include: [{ model: Teacher, as: 'teacher', attributes: ['id', 'full_name'] }]
                    }]
                },
                {
                    model: Payment, as: 'payments',
                    include: [{ model: Promotion, as: 'promotion' }]
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Không tìm thấy học viên' });
        }

        res.json(student);
    } catch (error) {
        console.error('Get student by id error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const createStudent = async (req, res) => {
    try {
        const { full_name } = req.body;
        if (!full_name) {
            return res.status(400).json({ message: 'Họ tên là bắt buộc' });
        }

        const student = await Student.create(req.body);

        await StudentLog.create({
            record_id: student.id,
            actor_id: req.user.id,
            action: 'THEM',
            description: `Thêm học viên: ${student.full_name}`
        });

        res.status(201).json(student);
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Không tìm thấy học viên' });
        }

        const oldData = student.toJSON();
        await student.update(req.body);

        await StudentLog.create({
            record_id: student.id,
            actor_id: req.user.id,
            action: 'SUA',
            description: `Cập nhật hồ sơ: ${student.full_name}`,
            old_data: oldData
        });

        res.json(student);
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Không tìm thấy học viên' });
        }

        const studentName = student.full_name;
        await student.destroy();

        res.json({ message: `Đã xóa học viên: ${studentName}` });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Export students as CSV
const exportStudentsCSV = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [
                { model: Promotion, as: 'promotion', attributes: ['name'] },
                {
                    model: Enrollment, as: 'enrollments',
                    where: { status: { [Op.in]: ['dang_hoc', 'chua_dong_tien'] } },
                    required: false,
                    include: [{
                        model: ClassModel, as: 'class',
                        attributes: ['class_name'],
                        include: [{ model: Teacher, as: 'teacher', attributes: ['full_name'] }]
                    }]
                }
            ],
            order: [['id', 'ASC']]
        });

        // BOM for UTF-8 Excel compatibility
        let csv = '\uFEFF';
        csv += 'Mã HV,Họ tên,SĐT,Email,Ngày tham gia,Trạng thái,Lớp đang học,Giáo viên,Ưu đãi\n';

        students.forEach(s => {
            const className = s.enrollments?.[0]?.class?.class_name || '';
            const teacherName = s.enrollments?.[0]?.class?.teacher?.full_name || '';
            const promoName = s.promotion?.name || '';
            const statusMap = { dang_hoc: 'Đang học', bao_luu: 'Bảo lưu', da_nghi: 'Đã nghỉ' };
            csv += `${s.id},"${s.full_name}",${s.phone || ''},"${s.email || ''}",${s.join_date || ''},${statusMap[s.learning_status] || s.learning_status},"${className}","${teacherName}","${promoName}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="danh_sach_hoc_vien.csv"');
        res.send(csv);
    } catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({ message: 'Lỗi xuất danh sách' });
    }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, exportStudentsCSV };

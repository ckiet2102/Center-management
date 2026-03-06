const { Teacher, TeacherLog, Class: ClassModel } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db_config');

const getAllTeachers = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                [Op.or]: [
                    { full_name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { specialty: { [Op.like]: `%${search}%` } },
                    { code_name: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const teachers = await Teacher.findAll({
            where,
            order: [['id', 'ASC']],
            attributes: {
                include: [
                    // Subquery to count active classes
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM classes
                        WHERE classes.teacher_id = teachers.id AND classes.status = 1
                    )`), 'class_count']
                ]
            }
        });

        res.json(teachers);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const createTeacher = async (req, res) => {
    try {
        const { full_name } = req.body;
        if (!full_name) {
            return res.status(400).json({ message: 'Họ tên là bắt buộc' });
        }

        const teacher = await Teacher.create(req.body);

        await TeacherLog.create({
            record_id: teacher.id,
            actor_id: req.user.id,
            action: 'THEM',
            description: `Thêm hồ sơ giảng viên: ${teacher.full_name}`
        });

        res.status(201).json(teacher);
    } catch (error) {
        console.error('Create teacher error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Không tìm thấy giảng viên' });
        }

        const oldData = teacher.toJSON();
        await teacher.update(req.body);

        await TeacherLog.create({
            record_id: teacher.id,
            actor_id: req.user.id,
            action: 'SUA',
            description: `Cập nhật hồ sơ giảng viên: ${teacher.full_name}`,
            old_data: oldData
        });

        res.json(teacher);
    } catch (error) {
        console.error('Update teacher error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Không tìm thấy giảng viên' });
        }

        // Check if teacher has active classes
        const activeClassCount = await ClassModel.count({
            where: { teacher_id: teacher.id, status: 1 }
        });

        if (activeClassCount > 0) {
            return res.status(400).json({
                message: `Không thể xóa giảng viên đang có ${activeClassCount} lớp phụ trách. Vui lòng chuyển lớp cho giảng viên khác trước.`
            });
        }

        const teacherName = teacher.full_name;
        await teacher.destroy();

        await TeacherLog.create({
            record_id: req.params.id,
            actor_id: req.user.id,
            action: 'XOA',
            description: `Xóa giảng viên: ${teacherName}`
        });

        res.json({ message: `Đã xóa giảng viên: ${teacherName}` });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

module.exports = { getAllTeachers, createTeacher, updateTeacher, deleteTeacher };

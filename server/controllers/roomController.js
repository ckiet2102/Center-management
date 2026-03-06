const { Room, Class: ClassModel } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db_config');

const getAllRooms = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        if (search) {
            where = {
                [Op.or]: [
                    { room_name: { [Op.like]: `%${search}%` } },
                    { note: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const rooms = await Room.findAll({
            where,
            order: [['id', 'ASC']],
            attributes: {
                include: [
                    [sequelize.literal(`(
                        SELECT COUNT(*) FROM classes
                        WHERE classes.room_id = rooms.id AND classes.status = 1
                    )`), 'active_class_count']
                ]
            }
        });
        res.json(rooms);
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const createRoom = async (req, res) => {
    try {
        const { room_name } = req.body;
        if (!room_name) return res.status(400).json({ message: 'Tên phòng là bắt buộc' });

        const existing = await Room.findOne({ where: { room_name } });
        if (existing) return res.status(400).json({ message: 'Phòng này đã tồn tại' });

        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const updateRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng học' });
        await room.update(req.body);
        res.json(room);
    } catch (error) {
        console.error('Update room error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng học' });

        const activeClasses = await ClassModel.count({ where: { room_id: room.id, status: 1 } });
        if (activeClasses > 0) {
            return res.status(400).json({
                message: `Không thể xóa phòng "${room.room_name}" vì đang có ${activeClasses} lớp đang sử dụng.`
            });
        }

        await room.destroy();
        res.json({ message: `Đã xóa phòng: ${room.room_name}` });
    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

module.exports = { getAllRooms, createRoom, updateRoom, deleteRoom };

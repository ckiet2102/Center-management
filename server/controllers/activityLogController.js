const { ActivityLog } = require('../models');

const getActivityLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows } = await ActivityLog.findAndCountAll({
            order: [['created_at', 'DESC']],
            limit,
            offset
        });

        res.json({
            logs: rows,
            total: count,
            page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error('Get activity logs error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

module.exports = { getActivityLogs };

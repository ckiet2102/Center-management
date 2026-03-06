const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const crypto = require('crypto');
require('dotenv').config();

const { User, sequelize } = require('../models');

router.use(verifyToken);
router.use(requireRole('admin'));

// Generate API Key (legacy - for external integrations)
router.post('/api-keys', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên API Key là bắt buộc' });
        const apiKey = `engbreak_${crypto.randomBytes(32).toString('hex')}`;
        res.json({ apiKey, name, message: 'API Key đã được tạo thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo API Key' });
    }
});

// Fetch all staff/admin accounts
router.get('/staffs', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'full_name', 'role'],
            order: [['role', 'ASC'], ['id', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống khi tải danh sách nhân viên' });
    }
});

// Backup database as JSON
router.get('/backup', async (req, res) => {
    try {
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const fileName = `engbreak_backup_${timestamp}.json`;

        let allData = {};
        for (const modelName of Object.keys(sequelize.models)) {
            const records = await sequelize.models[modelName].findAll({ raw: true });
            allData[modelName] = records;
        }

        const jsonContent = JSON.stringify({
            exported_at: new Date().toISOString(),
            total_tables: Object.keys(allData).length,
            data: allData
        }, null, 2);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(jsonContent);
    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống khi sao lưu' });
    }
});

module.exports = router;

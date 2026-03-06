const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { Shift, Level, TuitionPackage } = require('../models');

router.use(verifyToken);

// ──── Shifts ────
router.get('/shifts', async (req, res) => {
    try {
        const shifts = await Shift.findAll({ order: [['id', 'ASC']] });
        res.json(shifts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

// ──── Levels CRUD ────
router.get('/levels', async (req, res) => {
    try {
        const levels = await Level.findAll({
            include: [{ model: TuitionPackage, order: [['week_duration', 'ASC']] }],
            order: [['sort_order', 'ASC'], ['id', 'ASC']]
        });
        res.json(levels);
    } catch (error) {
        console.error('Get levels error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

router.post('/levels', requireRole('admin'), async (req, res) => {
    try {
        const { level_name } = req.body;
        if (!level_name) return res.status(400).json({ message: 'Tên cấp độ là bắt buộc' });
        const existing = await Level.findOne({ where: { level_name } });
        if (existing) return res.status(400).json({ message: 'Cấp độ này đã tồn tại' });
        const level = await Level.create(req.body);
        res.status(201).json(level);
    } catch (error) {
        console.error('Create level error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

router.put('/levels/:id', requireRole('admin'), async (req, res) => {
    try {
        const level = await Level.findByPk(req.params.id);
        if (!level) return res.status(404).json({ message: 'Không tìm thấy cấp độ' });
        await level.update(req.body);
        res.json(level);
    } catch (error) {
        console.error('Update level error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

router.delete('/levels/:id', requireRole('admin'), async (req, res) => {
    try {
        const level = await Level.findByPk(req.params.id);
        if (!level) return res.status(404).json({ message: 'Không tìm thấy cấp độ' });
        // Check if level has packages
        const pkgCount = await TuitionPackage.count({ where: { level_id: level.id } });
        if (pkgCount > 0) {
            return res.status(400).json({ message: `Không thể xóa vì cấp độ "${level.level_name}" có ${pkgCount} gói học phí.` });
        }
        await level.destroy();
        res.json({ message: 'Đã xóa cấp độ' });
    } catch (error) {
        console.error('Delete level error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

// ──── Tuition Packages CRUD ────
router.get('/tuition-packages', async (req, res) => {
    try {
        const packages = await TuitionPackage.findAll({
            include: [{ model: Level, as: 'level', attributes: ['id', 'level_name'] }],
            order: [['level_id', 'ASC'], ['week_duration', 'ASC']]
        });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

router.post('/tuition-packages', requireRole('admin'), async (req, res) => {
    try {
        const { level_id, week_duration, tuition_fee, sessions_per_week } = req.body;
        if (!level_id || !week_duration || !tuition_fee) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }
        const totalSessions = week_duration * (sessions_per_week || 3);
        const price_per_session = totalSessions > 0 ? Math.round(tuition_fee / totalSessions) : 0;
        const pkg = await TuitionPackage.create({
            level_id, week_duration, tuition_fee,
            sessions_per_week: sessions_per_week || 3,
            price_per_session
        });
        res.status(201).json(pkg);
    } catch (error) {
        console.error('Create package error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

router.put('/tuition-packages/:id', requireRole('admin'), async (req, res) => {
    try {
        const pkg = await TuitionPackage.findByPk(req.params.id);
        if (!pkg) return res.status(404).json({ message: 'Không tìm thấy gói' });
        const { week_duration, tuition_fee, sessions_per_week } = req.body;
        const weeks = week_duration || pkg.week_duration;
        const fee = tuition_fee || Number(pkg.tuition_fee);
        const sessions = sessions_per_week || pkg.sessions_per_week;
        const price_per_session = (weeks * sessions) > 0 ? Math.round(fee / (weeks * sessions)) : 0;
        await pkg.update({ ...req.body, price_per_session });
        res.json(pkg);
    } catch (error) {
        console.error('Update package error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

router.delete('/tuition-packages/:id', requireRole('admin'), async (req, res) => {
    try {
        const pkg = await TuitionPackage.findByPk(req.params.id);
        if (!pkg) return res.status(404).json({ message: 'Không tìm thấy gói' });
        await pkg.destroy();
        res.json({ message: 'Đã xóa gói học phí' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
});

module.exports = router;

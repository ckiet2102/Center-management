const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User, ActivationKey, PasswordReset } = require('../models');

// ========== LOGIN & BASE AUTH ==========

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });
        }

        let hashPassword = user.password;
        if (hashPassword.startsWith('$2y$')) {
            hashPassword = hashPassword.replace('$2y$', '$2b$');
        }

        const isMatch = await bcrypt.compare(password, hashPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username, role: user.role, full_name: user.full_name }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const getMe = async (req, res) => {
    try {
        res.json({
            id: req.user.id, username: req.user.username,
            role: req.user.role, full_name: req.user.full_name
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu' });

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

        let hashPassword = user.password;
        if (hashPassword.startsWith('$2y$')) hashPassword = hashPassword.replace('$2y$', '$2b$');

        const isMatch = await bcrypt.compare(currentPassword, hashPassword);
        if (!isMatch) return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);
        await user.update({ password: newHash });

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// ========== REGISTRATION WITH KEY ==========

const register = async (req, res) => {
    try {
        const { username, full_name, email, password, activation_key } = req.body;
        if (!username || !email || !password || !activation_key) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }

        // Validate Key
        const keyObj = await ActivationKey.findOne({ where: { key_code: activation_key } });
        if (!keyObj) return res.status(400).json({ message: 'Mã kích hoạt không hợp lệ' });
        if (keyObj.is_used) return res.status(400).json({ message: 'Mã kích hoạt đã được sử dụng' });

        // Check exists
        const exists = await User.findOne({ where: { username } });
        if (exists) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });

        // Cần thiết nếu có cột email ở User, hiện DB EngBreak chưa có cột email trong User, coi username = email

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Tạo Staff
        const user = await User.create({
            username, // Dùng email làm username cho dễ quản lý
            password: hash,
            full_name,
            role: 'staff'
        });

        // Đánh dấu Key đã dùng
        await keyObj.update({ is_used: true, used_by: username });

        res.status(201).json({ message: 'Đăng ký thành công', user: { id: user.id } });
    } catch (error) {
        console.error('Register err:', error);
        res.status(500).json({ message: 'Lỗi hệ thống đăng ký' });
    }
};

const getKeys = async (req, res) => {
    try {
        const keys = await ActivationKey.findAll({ order: [['id', 'DESC']] });
        res.json(keys);
    } catch (error) { res.status(500).json({ message: 'Lỗi' }); }
};

const generateKey = async (req, res) => {
    try {
        const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
        const code = `EB-99-${randomString}`;
        const key = await ActivationKey.create({ key_code: code });
        res.json(key);
    } catch (error) { res.status(500).json({ message: 'Lỗi' }); }
};

// ========== FORGOT PASSWORD ==========
// Setup standard nodemailer stub or real connection
// In real app, put in ENV. For demo, we just generate the token and send back fake email or use ethereal.
const forgotPassword = async (req, res) => {
    try {
        const { username } = req.body; // Using username as email conceptually
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'Tài khoản không tồn tại trong hệ thống' });

        const token = crypto.randomBytes(20).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await PasswordReset.create({
            email: username,
            token,
            expires_at: expiresAt
        });

        // Simulate sending email
        // In reality, use nodemailer here.
        // For standard local dev, we will just return the reset token directly to bypass email if SMTP is not configured.
        res.json({
            message: 'Đã tạo yêu cầu khôi phục. Thực tế sẽ gửi email.',
            demo_token: token,
            demo_link: `Reset Token của bạn là: ${token}` // In real app, hide this
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

const resetPasswordWithToken = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const resetRecord = await PasswordReset.findOne({ where: { token, is_used: false } });

        if (!resetRecord) return res.status(400).json({ message: 'Mã khôi phục không hợp lệ hoặc đã sử dụng' });
        if (new Date() > new Date(resetRecord.expires_at)) return res.status(400).json({ message: 'Mã khôi phục đã hết hạn' });

        const user = await User.findOne({ where: { username: resetRecord.email } });
        if (!user) return res.status(404).json({ message: 'User không tồn tại' });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);
        await user.update({ password: hash });

        await resetRecord.update({ is_used: true });

        res.json({ message: 'Khôi phục mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

// Admin forces password reset for arbitrary user
const adminResetPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { defaultPassword } = req.body; // Default from front-end: '123456'
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(defaultPassword || '123456', salt);
        await user.update({ password: hash });

        res.json({ message: `Đã đặt lại mật khẩu thành: ${defaultPassword || '123456'}` });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

module.exports = {
    login, getMe, changePassword,
    register, getKeys, generateKey,
    forgotPassword, resetPasswordWithToken, adminResetPassword
};

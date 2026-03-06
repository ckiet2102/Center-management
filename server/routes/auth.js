const router = require('express').Router();
const { login, getMe, changePassword, register, forgotPassword, resetPasswordWithToken, adminResetPassword, getKeys, generateKey } = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordWithToken);

router.get('/me', verifyToken, getMe);
router.put('/change-password', verifyToken, changePassword);

// Keys & Admin user reset
router.get('/keys', verifyToken, requireRole('admin'), getKeys);
router.post('/keys', verifyToken, requireRole('admin'), generateKey);
router.post('/admin/reset-user-password/:userId', verifyToken, requireRole('admin'), adminResetPassword);

module.exports = router;

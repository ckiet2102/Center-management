const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
    getAllPayments, getStudentPaymentSummary, getStudentPaymentHistory,
    createPayment, freezePayment, unfreezePayment, cancelPayment, getSuggestedStartDate
} = require('../controllers/paymentController');

router.use(verifyToken);

router.get('/', getAllPayments);
router.get('/summary', getStudentPaymentSummary);
router.get('/history/:studentId', getStudentPaymentHistory);
router.get('/suggest-start/:studentId', getSuggestedStartDate);
router.post('/', createPayment);
router.post('/:paymentId/freeze', requireRole('admin'), freezePayment);
router.post('/:paymentId/unfreeze', requireRole('admin'), unfreezePayment);
router.post('/:paymentId/cancel', requireRole('admin'), cancelPayment);

module.exports = router;

const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getAllPromotions, updateSeniority } = require('../controllers/promotionController');

router.use(verifyToken);

router.get('/', getAllPromotions);
router.post('/update-seniority', requireRole('admin'), updateSeniority);

module.exports = router;

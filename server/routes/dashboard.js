const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getStats, getChartData } = require('../controllers/dashboardController');

router.use(verifyToken);

router.get('/stats', getStats);
router.get('/charts', getChartData);

module.exports = router;

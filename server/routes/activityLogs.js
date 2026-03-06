const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getActivityLogs } = require('../controllers/activityLogController');

router.use(verifyToken);

router.get('/', getActivityLogs);

module.exports = router;

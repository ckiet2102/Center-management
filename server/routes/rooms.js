const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getAllRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

router.use(verifyToken);

router.get('/', getAllRooms);
router.post('/', requireRole('admin'), createRoom);
router.put('/:id', requireRole('admin'), updateRoom);
router.delete('/:id', requireRole('admin'), deleteRoom);

module.exports = router;

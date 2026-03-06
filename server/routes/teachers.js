const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getAllTeachers, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController');

router.use(verifyToken);

router.get('/', getAllTeachers);
router.post('/', requireRole('admin'), createTeacher);
router.put('/:id', requireRole('admin'), updateTeacher);
router.delete('/:id', requireRole('admin'), deleteTeacher);

module.exports = router;

const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, exportStudentsCSV } = require('../controllers/studentController');

router.use(verifyToken);

router.get('/export-csv', exportStudentsCSV);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', requireRole('admin'), deleteStudent);

module.exports = router;

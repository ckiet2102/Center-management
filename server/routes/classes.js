const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const {
    getAllClasses, createClass, updateClass,
    getClassStudents, addStudentToClass, removeStudentFromClass,
    exportClassCSV, getAvailableStudents
} = require('../controllers/classController');

router.use(verifyToken);

router.get('/', getAllClasses);
router.post('/', createClass);
router.put('/:id', updateClass);

// Enrollment management
router.get('/:id/students', getClassStudents);
router.get('/:id/available-students', getAvailableStudents);
router.post('/:id/students', addStudentToClass);
router.delete('/:id/students/:student_id', removeStudentFromClass);
router.get('/:id/export-csv', exportClassCSV);

module.exports = router;

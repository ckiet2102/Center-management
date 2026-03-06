const sequelize = require('../config/db_config');

const User = require('./User');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Class = require('./Class');
const Enrollment = require('./Enrollment');
const Payment = require('./Payment');
const Promotion = require('./Promotion');
const Room = require('./Room');
const Shift = require('./Shift');
const Level = require('./Level');
const TuitionPackage = require('./TuitionPackage');
const ActivityLog = require('./ActivityLog');
const StudentLog = require('./StudentLog');
const TeacherLog = require('./TeacherLog');
const ClassLog = require('./ClassLog');
const ActivationKey = require('./ActivationKey');
const PasswordReset = require('./PasswordReset');

// ===== Associations =====

// Student <-> Promotion
Student.belongsTo(Promotion, { foreignKey: 'promotion_id', as: 'promotion' });
Promotion.hasMany(Student, { foreignKey: 'promotion_id' });

// Class <-> Teacher, Level, Room, Shift
Class.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });
Class.belongsTo(Level, { foreignKey: 'level_id', as: 'level' });
Class.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
Class.belongsTo(Shift, { foreignKey: 'shift_id', as: 'shift' });
Teacher.hasMany(Class, { foreignKey: 'teacher_id' });
Level.hasMany(Class, { foreignKey: 'level_id' });

// Enrollment <-> Student, Class
Enrollment.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Enrollment.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
Student.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Class.hasMany(Enrollment, { foreignKey: 'class_id' });

// Payment <-> Student, Enrollment, Promotion, TuitionPackage
Payment.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Payment.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });
Payment.belongsTo(Promotion, { foreignKey: 'promotion_id', as: 'promotion' });
Payment.belongsTo(TuitionPackage, { foreignKey: 'package_id', as: 'package' });
Student.hasMany(Payment, { foreignKey: 'student_id', as: 'payments' });

// TuitionPackage <-> Level
TuitionPackage.belongsTo(Level, { foreignKey: 'level_id', as: 'level' });
Level.hasMany(TuitionPackage, { foreignKey: 'level_id' });

module.exports = {
    sequelize,
    User,
    Student,
    Teacher,
    Class,
    Enrollment,
    Payment,
    Promotion,
    Room,
    Shift,
    Level,
    TuitionPackage,
    ActivityLog,
    StudentLog,
    TeacherLog,
    ClassLog,
    ActivationKey,
    PasswordReset
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Student = sequelize.define('students', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    dob: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('Nam', 'Nu', 'Khac') },
    phone: { type: DataTypes.STRING(20) },
    parent_phone: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(100) },
    avatar: { type: DataTypes.STRING(255), defaultValue: 'default_student.png' },
    address: { type: DataTypes.TEXT },
    note: { type: DataTypes.TEXT },
    join_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    learning_status: { type: DataTypes.ENUM('dang_hoc', 'bao_luu', 'da_nghi'), defaultValue: 'dang_hoc' },
    promotion_id: { type: DataTypes.INTEGER }
});

module.exports = Student;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Teacher = sequelize.define('teachers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    code_name: { type: DataTypes.STRING(50) },
    dob: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('Nam', 'Nu'), defaultValue: 'Nu' },
    phone: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(100) },
    university: { type: DataTypes.STRING(150) },
    p_c: { type: DataTypes.TEXT, comment: 'Chứng chỉ chuyên môn' },
    experience: { type: DataTypes.STRING(100) },
    specialty: { type: DataTypes.ENUM('Cử Nhân', 'Thạc Sĩ', 'Tiến Sĩ', 'Khác'), defaultValue: 'Khác' },
    note: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('dang_day', 'tam_nghi', 'nghi_phep', 'nghi_viec', 'thu_viec'), defaultValue: 'thu_viec' },
    avatar: { type: DataTypes.STRING(255), defaultValue: 'default_avatar.png' }
});

module.exports = Teacher;

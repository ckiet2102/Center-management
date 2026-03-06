const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Enrollment = sequelize.define('enrollments', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER },
    class_id: { type: DataTypes.INTEGER },
    registration_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    start_study_date: { type: DataTypes.DATEONLY },
    end_study_date: { type: DataTypes.DATEONLY },
    is_special_schedule: { type: DataTypes.TINYINT, defaultValue: 0 },
    special_days: { type: DataTypes.STRING(50) },
    status: { type: DataTypes.ENUM('chua_dong_tien', 'dang_hoc', 'chuyen_lop', 'bao_luu', 'het_han'), defaultValue: 'chua_dong_tien' },
    note: { type: DataTypes.TEXT }
});

module.exports = Enrollment;

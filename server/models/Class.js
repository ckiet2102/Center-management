const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Class = sequelize.define('classes', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_name: { type: DataTypes.STRING(100), allowNull: false },
    level_id: { type: DataTypes.INTEGER },
    package_id: { type: DataTypes.INTEGER },
    teacher_id: { type: DataTypes.INTEGER },
    shift_id: { type: DataTypes.INTEGER },
    room_id: { type: DataTypes.INTEGER },
    schedule_days: { type: DataTypes.STRING(50) },
    shift_info: { type: DataTypes.STRING(50), field: 'shift' },
    start_date: { type: DataTypes.DATEONLY },
    end_date: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    student_count: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Class;

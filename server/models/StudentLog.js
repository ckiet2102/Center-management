const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const StudentLog = sequelize.define('student_logs', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    record_id: { type: DataTypes.INTEGER, allowNull: false },
    actor_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.ENUM('THEM', 'SUA', 'XOA'), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    old_data: { type: DataTypes.JSON },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = StudentLog;

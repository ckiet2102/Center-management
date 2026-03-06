const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const ActivityLog = sequelize.define('activity_logs', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    action_type: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = ActivityLog;

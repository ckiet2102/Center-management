const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const ClassLog = sequelize.define('class_logs', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    record_id: { type: DataTypes.INTEGER, allowNull: false },
    actor_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING(50), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    old_data: { type: DataTypes.JSON },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = ClassLog;

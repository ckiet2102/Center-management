const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const ActivationKey = sequelize.define('activation_keys', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    is_used: { type: DataTypes.BOOLEAN, defaultValue: false },
    used_by: { type: DataTypes.STRING(255), allowNull: true }
});

module.exports = ActivationKey;

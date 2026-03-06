const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const PasswordReset = sequelize.define('password_resets', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), allowNull: false },
    token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    is_used: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = PasswordReset;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const User = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    full_name: { type: DataTypes.STRING(100) },
    role: { type: DataTypes.ENUM('admin', 'staff'), defaultValue: 'staff' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = User;

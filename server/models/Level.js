const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Level = sequelize.define('levels', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    level_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    course_duration: { type: DataTypes.STRING(50), defaultValue: '5-6 tháng' },
    description: { type: DataTypes.TEXT },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 100 }
});

module.exports = Level;

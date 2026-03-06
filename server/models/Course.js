const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Course = sequelize.define('courses', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 100 }
});

module.exports = Course;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Shift = sequelize.define('shifts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shift_name: { type: DataTypes.STRING(50), allowNull: false },
    days: { type: DataTypes.STRING(50), allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false }
});

module.exports = Shift;

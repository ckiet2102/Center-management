const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const TuitionPackage = sequelize.define('tuition_packages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    level_id: { type: DataTypes.INTEGER, allowNull: false },
    week_duration: { type: DataTypes.INTEGER, allowNull: false },
    tuition_fee: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    sessions_per_week: { type: DataTypes.INTEGER, defaultValue: 3 },
    price_per_session: { type: DataTypes.DECIMAL(12, 2) }
});

module.exports = TuitionPackage;

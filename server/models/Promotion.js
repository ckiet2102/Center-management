const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Promotion = sequelize.define('promotions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100) },
    discount_percent: { type: DataTypes.INTEGER },
    condition_type: { type: DataTypes.ENUM('none', 'seniority_1y', 'seniority_2y', 'family', 'special') },
    description: { type: DataTypes.TEXT }
});

module.exports = Promotion;

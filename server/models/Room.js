const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Room = sequelize.define('rooms', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    room_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    status: { type: DataTypes.ENUM('san_sang', 'dang_su_dung', 'bao_tri'), defaultValue: 'san_sang' },
    note: { type: DataTypes.TEXT }
});

module.exports = Room;

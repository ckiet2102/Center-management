const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_config');

const Payment = sequelize.define('payments', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    enrollment_id: { type: DataTypes.INTEGER },
    student_id: { type: DataTypes.INTEGER },
    package_id: { type: DataTypes.INTEGER },
    weeks: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_sessions: { type: DataTypes.INTEGER, defaultValue: 0 },
    remaining_sessions: { type: DataTypes.INTEGER, defaultValue: 0 },
    start_date: { type: DataTypes.DATEONLY },
    end_date: { type: DataTypes.DATEONLY },
    original_amount: { type: DataTypes.DECIMAL(12, 2) },
    discount_amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    promotion_id: { type: DataTypes.INTEGER },
    final_amount: { type: DataTypes.DECIMAL(12, 2) },
    payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    payment_method: { type: DataTypes.ENUM('tien_mat', 'chuyen_khoan', 'vietqr'), defaultValue: 'tien_mat' },
    payment_status: { type: DataTypes.ENUM('thanh_cong', 'dang_cho', 'da_huy'), defaultValue: 'thanh_cong' },
    transaction_code: { type: DataTypes.STRING(100) },
    freeze_date: { type: DataTypes.DATEONLY },
    unfreeze_date: { type: DataTypes.DATEONLY },
    note: { type: DataTypes.TEXT }
});

module.exports = Payment;

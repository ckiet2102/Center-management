-- =============================================
-- Migration: Advanced Billing & Freeze
-- Run this AFTER the initial engbreak_db setup
-- Compatible with MySQL 5.7+ / 8.x
-- =============================================

-- Add new columns to payments table (one by one, safe)

-- 1. package_id
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'package_id');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE payments ADD COLUMN package_id INT NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. total_sessions
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'total_sessions');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE payments ADD COLUMN total_sessions INT DEFAULT 0', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. remaining_sessions
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'remaining_sessions');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE payments ADD COLUMN remaining_sessions INT DEFAULT 0', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. payment_status
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'payment_status');
SET @sql = IF(@col_exists = 0, 
    "ALTER TABLE payments ADD COLUMN payment_status ENUM('thanh_cong', 'dang_cho', 'da_huy') DEFAULT 'thanh_cong'", 
    'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. freeze_date
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'freeze_date');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE payments ADD COLUMN freeze_date DATE NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 6. unfreeze_date
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payments' AND COLUMN_NAME = 'unfreeze_date');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE payments ADD COLUMN unfreeze_date DATE NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'Migration 002 completed successfully!' AS result;

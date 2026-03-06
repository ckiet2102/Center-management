/**
 * Migration script: Run 003_auth_keys.sql
 * Usage: node server/scripts/run_migration.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db_config');

async function runMigration() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Create activation_keys table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS activation_keys (
                id INT AUTO_INCREMENT PRIMARY KEY,
                key_code VARCHAR(50) NOT NULL UNIQUE,
                is_used TINYINT(1) DEFAULT 0,
                used_by VARCHAR(255) NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `, { type: QueryTypes.RAW });
        console.log('✅ Table activation_keys created/verified');

        // Create password_resets table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                token VARCHAR(255) NOT NULL UNIQUE,
                expires_at DATETIME NOT NULL,
                is_used TINYINT(1) DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `, { type: QueryTypes.RAW });
        console.log('✅ Table password_resets created/verified');

        console.log('\n🎉 Migration 003_auth_keys completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();

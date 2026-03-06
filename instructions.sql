-- ============================================
-- HƯỚNG DẪN IMPORT DATABASE EngBreak
-- ============================================
-- 
-- File: engbreak_db.sql
-- Database: engbreak_db (MySQL 8.x)
--
-- ============================================
-- BƯỚC 1: Tạo Database
-- ============================================

CREATE DATABASE IF NOT EXISTS `engbreak_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_general_ci;

USE `engbreak_db`;

-- ============================================
-- BƯỚC 2: Import dữ liệu từ file SQL
-- ============================================
-- 
-- Cách 1: Sử dụng MySQL Command Line
--   mysql -u root -p engbreak_db < engbreak_db.sql
--
-- Cách 2: Sử dụng phpMyAdmin
--   1. Mở phpMyAdmin (http://localhost/phpmyadmin)
--   2. Chọn database "engbreak_db" 
--   3. Tab "Import" → Chọn file "engbreak_db.sql"
--   4. Nhấn "Go" / "Thực thi"
--
-- Cách 3: Sử dụng MySQL Workbench
--   1. Kết nối MySQL Server
--   2. File → Open SQL Script → Chọn "engbreak_db.sql"
--   3. Execute (Ctrl + Shift + Enter)
--
-- ============================================
-- BƯỚC 3: Kiểm tra import thành công
-- ============================================

-- Kiểm tra số bảng (phải có 17+ bảng)
-- SHOW TABLES;

-- Kiểm tra dữ liệu mẫu
-- SELECT COUNT(*) as total_students FROM students;
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_classes FROM classes;
-- SELECT COUNT(*) as total_teachers FROM teachers;

-- ============================================
-- BƯỚC 4: Tài khoản đăng nhập mặc định
-- ============================================
-- 
-- Admin:
--   Username: Admin
--   Password: 123456 (hoặc password được set trong PHP)
--
-- Staff:
--   Username: chidung
--   Username: hongmy  
--   Username: chankiet
--   Username: tuanhuy
--
-- ============================================
-- LƯU Ý QUAN TRỌNG
-- ============================================
--
-- 1. Password trong database đã được hash bằng PHP bcrypt ($2y$)
--    Backend Node.js sẽ tự động xử lý tương thích.
--
-- 2. File SQL chứa Stored Procedure, Trigger.
--    Đảm bảo MySQL user có quyền CREATE PROCEDURE, CREATE TRIGGER.
--
-- 3. Nếu gặp lỗi DEFINER khi import:
--    Tìm và xóa "DEFINER=`root`@`localhost`" trong file .sql
--    Hoặc chạy: SET GLOBAL log_bin_trust_function_creators = 1;
--

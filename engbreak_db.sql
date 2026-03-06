-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th12 13, 2025 lúc 03:34 AM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `engbreak_db`
--

DELIMITER $$
--
-- Thủ tục
--
DROP PROCEDURE IF EXISTS `UpdateStudentPromotionsBasedOnSeniority`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateStudentPromotionsBasedOnSeniority` ()   BEGIN
    -- Update for students with >= 2 years (24 months) seniority
    -- Sets promotion_id to 2 (assuming ID 2 is 'Học trên 2 năm')
    UPDATE `students`
    SET `promotion_id` = 2
    WHERE TIMESTAMPDIFF(MONTH, `join_date`, CURDATE()) >= 24
      AND (`promotion_id` IS NULL OR `promotion_id` NOT IN (2, 4)); -- Avoid overwriting better promos if any (e.g. ID 4 is 'Scholarship' 100%)

    -- Update for students with >= 1 year (12 months) but < 2 years
    -- Sets promotion_id to 1 (assuming ID 1 is 'Học trên 1 năm')
    UPDATE `students`
    SET `promotion_id` = 1
    WHERE TIMESTAMPDIFF(MONTH, `join_date`, CURDATE()) >= 12
      AND TIMESTAMPDIFF(MONTH, `join_date`, CURDATE()) < 24
      AND (`promotion_id` IS NULL OR `promotion_id` NOT IN (1, 2, 4)); -- Don't downgrade from 2 year or override special ones
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action_type`, `description`, `created_at`) VALUES
(5, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 07:36:51'),
(6, 3, 'LOGIN_FAIL', 'Huỳnh Lâm Chí Dũng (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: chidung', '2025-11-29 07:37:18'),
(7, 0, 'LOGIN_FAIL', 'Khách (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: caphe', '2025-11-29 07:37:54'),
(8, 5, 'LOGIN_FAIL', 'Chấn Kiệt (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: chankiet', '2025-11-29 07:38:14'),
(9, 5, 'LOGIN', 'Chấn Kiệt (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 07:38:20'),
(10, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: dang_day -> tam_nghi', '2025-11-29 10:38:32'),
(11, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: dang_day -> nghi_phep', '2025-11-29 10:38:47'),
(12, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: nghi_phep -> thu_viec', '2025-11-29 10:38:57'),
(13, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: dang_day -> nghi_viec', '2025-11-29 10:39:08'),
(14, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: dang_day -> nghi_phep', '2025-11-29 10:39:27'),
(15, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: dang_day -> nghi_phep', '2025-11-29 10:40:01'),
(16, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: dang_day -> tam_nghi', '2025-11-29 10:40:19'),
(17, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 10:53:26'),
(18, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 10:56:18'),
(19, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 11:18:31'),
(20, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 18:19:59'),
(21, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 18:45:28'),
(22, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 18:45:57'),
(23, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-29 22:13:43'),
(24, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 06:42:38'),
(25, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: thu_viec -> dang_day', '2025-11-30 06:49:36'),
(26, 3, 'GIANG_VIEN_SUA', 'Cập nhật hồ sơ giảng viên: Trần Hoài Nam', '2025-11-30 06:49:36'),
(27, 3, 'GIANG_VIEN_THEM', 'Thêm hồ sơ giảng viên: Lâm Gia Linh', '2025-11-30 06:53:45'),
(28, 3, 'GIANG_VIEN_SUA', 'Cập nhật hồ sơ giảng viên: Lâm Gia Linh', '2025-11-30 06:54:23'),
(29, 3, 'GIANG_VIEN_SUA', 'Cập nhật hồ sơ giảng viên: Vũ Thị Lan Anh', '2025-11-30 06:54:43'),
(30, 3, 'GIANG_VIEN_SUA', 'Cập nhật hồ sơ giảng viên: Trần Hoài Nam', '2025-11-30 06:55:03'),
(31, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 07:24:48'),
(32, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 07:48:02'),
(33, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 10:03:09'),
(34, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 10:15:27'),
(35, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 10:15:31'),
(36, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 10:15:34'),
(37, 2, '', 'Huỳnh Bảo Minh Phát (): Đổi mật khẩu thành công', '2025-11-30 10:25:14'),
(38, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 10:25:23'),
(39, 2, '', 'Huỳnh Bảo Minh Phát (): Khôi phục mật khẩu bằng Key cũ', '2025-11-30 10:25:40'),
(40, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 10:25:45'),
(41, 2, '', 'Huỳnh Bảo Minh Phát (): Đổi mật khẩu thành công', '2025-11-30 10:27:21'),
(42, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 10:27:29'),
(43, 0, 'GIANG_VIEN_SUA', 'Trạng thái thay đổi: tam_nghi -> nghi_phep', '2025-11-30 11:05:58'),
(44, 2, 'GIANG_VIEN_SUA', 'Cập nhật hồ sơ giảng viên: Đặng Thùy Dương', '2025-11-30 11:05:58'),
(45, 2, 'GIANG_VIEN_SUA', 'Cập nhật hồ sơ giảng viên: Đặng Thùy Dương', '2025-11-30 11:08:14'),
(46, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 16:59:58'),
(47, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:05'),
(48, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:10'),
(49, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:13'),
(50, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:14'),
(51, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:16'),
(52, 2, '', 'Huỳnh Bảo Minh Phát (): Khôi phục mật khẩu bằng Key cũ', '2025-11-30 17:00:25'),
(53, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 17:00:30'),
(54, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 19:22:59'),
(55, 2, 'LOP_HOC_THEM', 'Tạo lớp: Pre-Ielts - Ca 1 (2-4-6) - Mr.Minh', '2025-11-30 19:49:14'),
(56, 0, 'PHONG_HOC_DOI_TRANG_THAI', 'Phòng P.402: san_sang -> bao_tri', '2025-11-30 20:00:52'),
(57, 2, 'PHONG_HOC_SUA', 'Cập nhật phòng: P.402', '2025-11-30 20:00:52'),
(58, 2, 'PHONG_HOC_SUA', 'Cập nhật thông tin phòng: P.402', '2025-11-30 20:06:10'),
(59, 2, 'PHONG_HOC_DOI_TRANG_THAI', 'Đổi trạng thái phòng P.402: Bảo trì -> Sẵn sàng', '2025-11-30 20:06:10'),
(60, 2, 'LOP_HOC_THEM', 'Tạo lớp: Ielts 4 - Ca 1 (2-4-6) - Mr.Lâm', '2025-11-30 20:07:07'),
(61, 2, 'GIANG_VIEN_THEM', 'Thêm hồ sơ giảng viên: Bùi Trần Nhật Quang', '2025-11-30 20:09:21'),
(62, 2, 'LOP_HOC_THEM', 'Tạo lớp: Toeic 1 - Ca 1 (T7-CN) - Ms.Linh', '2025-11-30 20:11:38'),
(63, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '2025-11-30 20:54:24'),
(64, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '2025-11-30 20:57:04'),
(65, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '2025-11-30 21:09:50'),
(66, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '2025-11-30 21:10:58'),
(67, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-11-30 22:51:49'),
(68, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-02 18:08:41'),
(69, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-12-02 18:11:17'),
(70, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-02 18:22:58'),
(71, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '2025-12-02 18:23:47'),
(72, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Quách Ngọc Ngoan', '2025-12-02 18:23:55'),
(73, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Lương Thùy Linh', '2025-12-02 18:23:59'),
(74, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Đinh Văn Lâm', '2025-12-02 18:24:04'),
(75, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Võ Thị Bích', '2025-12-02 18:24:08'),
(76, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Mai Thị Tuyết', '2025-12-02 18:24:13'),
(77, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Lý Văn Cường', '2025-12-02 18:24:17'),
(78, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Hồ Thị Thu', '2025-12-02 18:24:31'),
(79, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Ngô Phương Linh', '2025-12-02 18:24:37'),
(80, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-02 18:49:26'),
(81, 2, 'HOC_VIEN_THEM', 'Thêm học viên: Tạ Minh Hậu', '2025-12-02 18:50:37'),
(82, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '2025-12-02 18:50:54'),
(83, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-02 22:05:13'),
(84, 2, 'LOP_HOC_THEM', 'Tạo lớp: Early - Ca 2 (T7-CN) - Ms.Thảo', '2025-12-02 22:33:57'),
(85, 2, 'LOP_HOC_THEM_HV', 'Thêm học viên Tạ Minh Hậu', '2025-12-02 22:49:50'),
(86, 2, 'HOC_PHI_', 'Thu 1800000 VNĐ của Nguyễn Văn An (8 tuần)', '2025-12-02 23:39:52'),
(87, 2, 'HOC_PHI_', 'Thu 1800000 VNĐ của Nguyễn Văn An (8 tuần)', '2025-12-02 23:40:42'),
(88, 2, 'HOC_PHI_', 'Thu 9405000 VNĐ của Tạ Minh Hậu (16 tuần)', '2025-12-02 23:40:55'),
(89, 2, 'HOC_PHI_', 'Thu 3600000 VNĐ của Trần Thị Bích (8 tuần)', '2025-12-02 23:41:02'),
(90, 2, 'HOC_PHI_', 'Thu 3600000 VNĐ của Lê Hoàng Nam (8 tuần)', '2025-12-02 23:41:05'),
(91, 2, 'HOC_PHI_', 'Thu 1800000 VNĐ của Phạm Minh Khôi (8 tuần)', '2025-12-02 23:41:08'),
(92, 2, 'HOC_PHI_', 'Thu 2700000 VNĐ của Nguyễn Thị Mai (8 tuần)', '2025-12-02 23:41:11'),
(93, 2, 'HOC_PHI_', 'Thu 0 VNĐ của Hoàng Văn Long (8 tuần)', '2025-12-02 23:41:14'),
(94, 2, 'HOC_PHI_', 'Thu 0 VNĐ của Hoàng Văn Long (8 tuần)', '2025-12-02 23:41:41'),
(95, 2, 'HOC_PHI_', 'Thu 2800000 VNĐ của Nguyễn Bảo Ngọc (8 tuần)', '2025-12-02 23:41:50'),
(96, 2, 'HOC_PHI_', 'Thu 3600000 VNĐ của Đoàn Thu Hà (8 tuần)', '2025-12-02 23:41:54'),
(97, 2, 'HOC_PHI_', 'Thu 3420000 VNĐ của Vũ Đức Thắng (16 tuần)', '2025-12-02 23:41:57'),
(98, 2, 'HOC_PHI_', 'Thu 6840000 VNĐ của Ngô Bảo Châu (16 tuần)', '2025-12-02 23:42:00'),
(99, 2, 'HOC_PHI_', 'Thu 5130000 VNĐ của Lý Hải Đăng (16 tuần)', '2025-12-02 23:42:04'),
(100, 2, 'HOC_PHI_', 'Thu 2800000 VNĐ của Trần Minh Khôi (8 tuần)', '2025-12-02 23:42:07'),
(101, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Lê Gia Hân (8 tuần)', '2025-12-02 23:42:10'),
(102, 2, 'HOC_PHI_', 'Thu 2090000 VNĐ của Phạm Đức Anh (8 tuần)', '2025-12-02 23:42:12'),
(103, 2, 'HOC_PHI_', 'Thu 2800000 VNĐ của Hoàng Yến Nhi (8 tuần)', '2025-12-02 23:42:16'),
(104, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Vũ Tuấn Kiệt (8 tuần)', '2025-12-02 23:42:19'),
(105, 2, 'HOC_PHI_', 'Thu 2800000 VNĐ của Đặng Minh Châu (8 tuần)', '2025-12-02 23:42:21'),
(106, 2, 'HOC_PHI_', 'Thu 2200000 VNĐ của Bùi Tiến Dũng (8 tuần)', '2025-12-02 23:42:24'),
(107, 2, 'HOC_PHI_', 'Thu 2660000 VNĐ của Ngô Phương Linh (8 tuần)', '2025-12-02 23:42:26'),
(108, 2, 'HOC_PHI_', 'Thu 2660000 VNĐ của Dương Văn Hậu (8 tuần)', '2025-12-02 23:42:30'),
(109, 2, 'HOC_PHI_', 'Thu 2660000 VNĐ của Hồ Thị Thu (8 tuần)', '2025-12-02 23:42:32'),
(110, 2, 'HOC_PHI_', 'Thu 2850000 VNĐ của Lý Văn Cường (8 tuần)', '2025-12-02 23:42:35'),
(111, 2, 'HOC_PHI_', 'Thu 1900000 VNĐ của Mai Thị Tuyết (8 tuần)', '2025-12-02 23:42:37'),
(112, 2, 'HOC_PHI_', 'Thu 3600000 VNĐ của Trương Tấn Sang (8 tuần)', '2025-12-02 23:42:41'),
(113, 2, 'HOC_PHI_', 'Thu 1980000 VNĐ của Võ Thị Bích (8 tuần)', '2025-12-02 23:42:44'),
(114, 2, 'HOC_PHI_', 'Thu 2520000 VNĐ của Đinh Văn Lâm (8 tuần)', '2025-12-02 23:42:47'),
(115, 2, 'HOC_PHI_', 'Thu 2850000 VNĐ của Lương Thùy Linh (8 tuần)', '2025-12-02 23:42:50'),
(116, 2, 'HOC_PHI_', 'Thu 2660000 VNĐ của Quách Ngọc Ngoan (8 tuần)', '2025-12-02 23:42:55'),
(117, 2, 'HOC_PHI_', 'Thu 1800000 VNĐ của Tạ Bích Loan (8 tuần)', '2025-12-02 23:42:58'),
(118, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-02 23:43:01'),
(119, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-02 23:46:42'),
(120, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-02 23:56:16'),
(121, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-03 00:01:10'),
(122, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-03 00:05:33'),
(123, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-03 00:06:01'),
(124, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-03 00:06:14'),
(125, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-03 00:06:36'),
(126, 2, 'HOC_PHI_', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', '2025-12-03 00:06:59'),
(127, 2, 'HOC_PHI_', 'Thu 4000000 đ của Phan Anh Tuấn (8 tuần) qua Tiền mặt', '2025-12-03 00:10:51'),
(128, 2, 'HOC_PHI_', 'Thu 4000000 đ của Phan Anh Tuấn (8 tuần) qua Tiền mặt', '2025-12-03 00:12:09'),
(129, 2, 'HOC_PHI_', 'Thu 3600000 đ của Trần Thị Bích (8 tuần) qua Chuyển khoản QR', '2025-12-03 00:12:30'),
(130, 2, 'HOC_PHI_', 'Thu 3600000 đ của Lê Hoàng Nam (8 tuần) qua Tiền mặt', '2025-12-03 00:24:26'),
(131, 2, 'HOC_PHI_', 'Thu 3600000 đ của Lê Hoàng Nam (8 tuần) qua Tiền mặt', '2025-12-03 00:25:23'),
(132, 2, 'HOC_PHI_', 'Thu 2800000 đ của Nguyễn Bảo Ngọc (8 tuần) qua Chuyển khoản QR', '2025-12-03 00:25:46'),
(133, 6, '', 'Nguyễn Tuấn Huy (): Đăng ký tài khoản mới bằng key: NV-630378', '2025-12-03 14:21:27'),
(134, 6, 'LOGIN', 'Nguyễn Tuấn Huy (LOGIN): Đăng nhập vào hệ thống', '2025-12-03 14:21:35'),
(135, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-03 14:23:16'),
(136, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-03 22:31:09'),
(137, 2, 'HOC_PHI_', 'Thu phí Nguyễn Thị Mai (8 tuần): 2700000 đ', '2025-12-03 23:05:19'),
(138, 2, 'HOC_PHI_', 'Thu phí Nguyễn Thị Mai (8 tuần): 2700000 đ', '2025-12-03 23:07:10'),
(139, 2, 'HOC_PHI_', 'Thu phí Phạm Minh Khôi (8 tuần): 1800000 đ', '2025-12-03 23:07:30'),
(140, 2, 'HOC_PHI_', 'Thu phí Đoàn Thu Hà (8 tuần): 3600000 đ', '2025-12-03 23:07:56'),
(141, 2, 'HOC_PHI_', 'Thu phí Quách Ngọc Ngoan (8 tuần): 2660000 đ', '2025-12-03 23:09:00'),
(142, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-04 11:26:20'),
(143, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-04 18:10:47'),
(144, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-05 17:57:41'),
(145, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '2025-12-05 17:57:58'),
(146, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '2025-12-05 17:58:27'),
(147, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '2025-12-05 17:58:41'),
(148, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '2025-12-05 17:59:23'),
(149, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '2025-12-05 18:00:20'),
(150, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '2025-12-05 18:00:35'),
(151, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-12-05 22:39:23'),
(152, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-12-05 22:40:15'),
(153, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-05 22:40:26'),
(154, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-05 23:34:35'),
(155, 3, 'LOGIN', 'Huỳnh Lâm Chí Dũng (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 01:03:44'),
(156, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 01:03:53'),
(157, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 01:31:33'),
(158, 2, 'HOC_PHI_', 'Thu phí Trần Minh Khôi (8 tuần): 2800000 đ', '2025-12-06 02:50:14'),
(159, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 03:24:12'),
(160, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 13:51:30'),
(161, 2, 'HOC_PHI_', 'Thu phí Lê Gia Hân (16 tuần): 7600000 đ', '2025-12-06 14:05:51'),
(162, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 15:34:38'),
(163, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 15:39:34'),
(164, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 15:47:43'),
(165, 2, 'HOC_PHI_', 'Thu phí Phạm Đức Anh (8 tuần): 2090000 đ', '2025-12-06 15:48:01'),
(166, 2, 'HOC_PHI_', 'Thu phí Võ Thị Bích (8 tuần): 1980000 đ', '2025-12-06 15:50:06'),
(167, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-06 15:58:33'),
(168, 2, 'HOC_VIEN_THEM', 'Thêm học viên: Phát', '2025-12-06 16:00:44'),
(169, 2, 'LOP_HOC_THEM_HV', 'Thêm học viên Phát', '2025-12-06 16:01:13'),
(170, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Phát', '2025-12-06 16:19:04'),
(171, 2, 'HOC_VIEN_SUA', 'Cập nhật hồ sơ: Phát', '2025-12-06 16:19:12'),
(172, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-07 17:05:03'),
(173, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-09 18:08:12'),
(174, 2, 'HOC_VIEN_THEM', 'Thêm học viên: Phát', '2025-12-09 18:09:41'),
(175, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-13 09:24:30'),
(176, 2, '', 'Huỳnh Bảo Minh Phát (): Đổi mật khẩu thành công', '2025-12-13 10:15:41'),
(177, 2, 'LOGIN_FAIL', 'Huỳnh Bảo Minh Phát (LOGIN_FAIL): Sai mật khẩu hoặc tài khoản: admin', '2025-12-13 10:15:48'),
(178, 2, 'LOGIN', 'Huỳnh Bảo Minh Phát (LOGIN): Đăng nhập vào hệ thống', '2025-12-13 10:15:52'),
(179, 2, 'LOP_HOC_THEM', 'Tạo lớp: Toeic 1 - Ca 2 (T7-CN) - Mr.Nam', '2025-12-13 10:22:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendance`
--

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `date` date NOT NULL,
  `status` enum('co_mat','vang_phep','vang_khong_phep') COLLATE utf8mb4_general_ci DEFAULT 'co_mat',
  `note` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enrollment_id` (`enrollment_id`),
  KEY `class_id` (`class_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `auth_logs`
--

DROP TABLE IF EXISTS `auth_logs`;
CREATE TABLE IF NOT EXISTS `auth_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `action` enum('LOGIN','LOGOUT','LOGIN_FAIL') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `auth_logs`
--

INSERT INTO `auth_logs` (`id`, `user_id`, `full_name`, `ip_address`, `action`, `description`, `created_at`) VALUES
(1, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 07:36:51'),
(2, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: chidung', '2025-11-29 07:37:18'),
(3, 0, 'Khách', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: caphe', '2025-11-29 07:37:54'),
(4, 5, 'Chấn Kiệt', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: chankiet', '2025-11-29 07:38:14'),
(5, 5, 'Chấn Kiệt', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 07:38:20'),
(6, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 10:53:26'),
(7, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 10:56:18'),
(8, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 11:18:31'),
(9, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 18:19:59'),
(10, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 18:45:28'),
(11, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 18:45:57'),
(12, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-29 22:13:43'),
(13, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 06:42:38'),
(14, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 07:24:48'),
(15, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 07:48:02'),
(16, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 10:03:09'),
(17, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 10:15:27'),
(18, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 10:15:31'),
(19, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 10:15:34'),
(20, 2, 'Huỳnh Bảo Minh Phát', '::1', '', 'Đổi mật khẩu thành công', '2025-11-30 10:25:14'),
(21, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 10:25:23'),
(22, 2, 'Huỳnh Bảo Minh Phát', '::1', '', 'Khôi phục mật khẩu bằng Key cũ', '2025-11-30 10:25:40'),
(23, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 10:25:45'),
(24, 2, 'Huỳnh Bảo Minh Phát', '::1', '', 'Đổi mật khẩu thành công', '2025-11-30 10:27:21'),
(25, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 10:27:29'),
(26, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 16:59:58'),
(27, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:05'),
(28, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:10'),
(29, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:13'),
(30, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:14'),
(31, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-11-30 17:00:16'),
(32, 2, 'Huỳnh Bảo Minh Phát', '::1', '', 'Khôi phục mật khẩu bằng Key cũ', '2025-11-30 17:00:25'),
(33, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 17:00:30'),
(34, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 19:22:59'),
(35, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-11-30 22:51:49'),
(36, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-02 18:08:41'),
(37, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-02 18:11:17'),
(38, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-02 18:22:58'),
(39, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-02 18:49:26'),
(40, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-02 22:05:13'),
(41, 6, 'Nguyễn Tuấn Huy', '::1', '', 'Đăng ký tài khoản mới bằng key: NV-630378', '2025-12-03 14:21:27'),
(42, 6, 'Nguyễn Tuấn Huy', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-03 14:21:35'),
(43, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-03 14:23:16'),
(44, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-03 22:31:09'),
(45, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-04 11:26:20'),
(46, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-04 18:10:47'),
(47, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-05 17:57:41'),
(48, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-12-05 22:39:23'),
(49, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-05 22:40:15'),
(50, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-05 22:40:26'),
(51, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-05 23:34:35'),
(52, 3, 'Huỳnh Lâm Chí Dũng', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 01:03:44'),
(53, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 01:03:53'),
(54, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 01:31:33'),
(55, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 03:24:12'),
(56, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 13:51:30'),
(57, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 15:34:38'),
(58, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 15:39:34'),
(59, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 15:47:43'),
(60, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-06 15:58:33'),
(61, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-07 17:05:03'),
(62, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-09 18:08:12'),
(63, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-13 09:24:30'),
(64, 2, 'Huỳnh Bảo Minh Phát', '::1', '', 'Đổi mật khẩu thành công', '2025-12-13 10:15:41'),
(65, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN_FAIL', 'Sai mật khẩu hoặc tài khoản: admin', '2025-12-13 10:15:48'),
(66, 2, 'Huỳnh Bảo Minh Phát', '::1', 'LOGIN', 'Đăng nhập vào hệ thống', '2025-12-13 10:15:52');

--
-- Bẫy `auth_logs`
--
DROP TRIGGER IF EXISTS `sync_auth_logs`;
DELIMITER $$
CREATE TRIGGER `sync_auth_logs` AFTER INSERT ON `auth_logs` FOR EACH ROW INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
VALUES (
    NEW.user_id, 
    NEW.action, 
    -- Nối chuỗi: "Nguyễn Văn A (LOGIN): Mô tả..."
    CONCAT(IFNULL(NEW.full_name, 'Unknown'), ' (', NEW.action, '): ', IFNULL(NEW.description, '')), 
    NEW.created_at
)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `backup_logs`
--

DROP TABLE IF EXISTS `backup_logs`;
CREATE TABLE IF NOT EXISTS `backup_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `backup_filename` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `backup_logs`
--

INSERT INTO `backup_logs` (`id`, `backup_filename`, `created_at`, `status`) VALUES
(1, 'EngBreak_Backup_2025-11-29_00-05-27.sql', '2025-11-29 07:05:27', 'Success'),
(2, 'EngBreak_Backup_2025-11-29_00-05-38.sql', '2025-11-29 07:05:38', 'Success'),
(3, 'EngBreak_Backup_2025-11-29_00-07-13.sql', '2025-11-29 07:07:13', 'Success'),
(4, 'EngBreak_Backup_2025-11-29_00-08-12.sql', '2025-11-29 07:08:12', 'Success'),
(5, 'EngBreak_Backup_2025-11-29_00-08-28.sql', '2025-11-29 07:08:28', 'Success'),
(6, 'EngBreak_Backup_2025-11-29_00-08-51.sql', '2025-11-29 07:08:51', 'Success'),
(7, 'EngBreak_Backup_2025-11-30_03-14-44.sql', '2025-11-30 10:14:44', 'Success'),
(8, 'EngBreak_Backup_2025-11-30_12-40-52.sql', '2025-11-30 19:40:52', 'Success'),
(9, 'EngBreak_Backup_2025-12-05_11-06-30.sql', '2025-12-05 18:06:30', 'Success'),
(10, 'EngBreak_Backup_2025-12-05_12-02-25.sql', '2025-12-05 19:02:25', 'Success'),
(11, 'EngBreak_Backup_2025-12-05_12-03-29.sql', '2025-12-05 19:03:29', 'Success'),
(12, 'EngBreak_Backup_2025-12-13_03-15-09.sql', '2025-12-13 10:15:10', 'Success');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `classes`
--

DROP TABLE IF EXISTS `classes`;
CREATE TABLE IF NOT EXISTS `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `level_id` int DEFAULT NULL,
  `package_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `shift_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `schedule_days` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `shift` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` tinyint DEFAULT '1',
  `student_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `package_id` (`package_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `classes`
--

INSERT INTO `classes` (`id`, `class_name`, `level_id`, `package_id`, `teacher_id`, `shift_id`, `room_id`, `schedule_days`, `shift`, `start_date`, `end_date`, `status`, `student_count`) VALUES
(1, 'Early - Ca 1 (2-4-6) - Ms.Thảo', 5, NULL, 11, 1, 2, NULL, NULL, '2025-12-05', NULL, 1, 5),
(3, 'Ielts 1 - Ca 1 (2-4-6) - Mr.Nam', 14, NULL, 12, 1, 3, NULL, NULL, '2025-11-30', NULL, 1, 8),
(4, 'Giao tiếp A - Ca 2 (2-4-6) - Mr.Nam', 19, NULL, 12, 2, 7, NULL, NULL, '2025-12-05', NULL, 1, 5),
(5, 'Toeic 2 - Ca 1 (3-5-7) - Mr.Hùng', 11, NULL, 5, 3, 4, NULL, NULL, '2025-12-10', NULL, 1, 5),
(6, 'Starter - Ca 1 (T7-CN) - Ms.Đảm', 6, NULL, 3, 4, 1, NULL, NULL, '2025-12-02', NULL, 1, 3),
(7, 'Pet - Ca 1 (2-4-6) - Mr.Thắng', 9, NULL, 8, 1, 10, NULL, NULL, '2025-12-15', NULL, 1, 4),
(8, 'Pre-Ielts - Ca 1 (2-4-6) - Mr.Minh', 13, NULL, 10, 1, 4, NULL, NULL, '2025-11-30', NULL, 1, 0),
(9, 'Ielts 4 - Ca 1 (2-4-6) - Mr.Lâm', 17, NULL, 1, 1, 1, NULL, NULL, '2025-11-30', NULL, 1, 1),
(10, 'Toeic 1 - Ca 1 (T7-CN) - Ms.Linh', 10, NULL, 15, 4, 4, NULL, NULL, '2025-11-30', NULL, 1, 0),
(11, 'Early - Ca 2 (T7-CN) - Ms.Thảo', 5, NULL, 11, 6, 1, NULL, NULL, '2025-12-02', NULL, 1, 1),
(12, 'Toeic 1 - Ca 2 (T7-CN) - Mr.Nam', 10, NULL, 12, 6, 3, NULL, NULL, '2025-12-13', NULL, 1, 0);

--
-- Bẫy `classes`
--
DROP TRIGGER IF EXISTS `track_class_status_change`;
DELIMITER $$
CREATE TRIGGER `track_class_status_change` AFTER UPDATE ON `classes` FOR EACH ROW BEGIN
    -- Nếu trạng thái thay đổi (vd: Đang học -> Kết thúc)
    IF OLD.status != NEW.status THEN
        INSERT INTO `class_logs` (`record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`)
        VALUES (
            NEW.id, 
            0, -- Hệ thống tự ghi
            'DOI_TRANG_THAI', 
            CONCAT('Trạng thái lớp thay đổi: ', OLD.status, ' -> ', NEW.status), 
            JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status),
            NOW()
        );
    END IF;
    
    -- Nếu đổi phòng học
    IF OLD.room_id != NEW.room_id THEN
         INSERT INTO `class_logs` (`record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`)
        VALUES (NEW.id, 0, 'DOI_PHONG', 'Lớp học đã đổi phòng', JSON_OBJECT('old_room', OLD.room_id, 'new_room', NEW.room_id), NOW());
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `class_logs`
--

DROP TABLE IF EXISTS `class_logs`;
CREATE TABLE IF NOT EXISTS `class_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `actor_id` int NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `record_id` (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `class_logs`
--

INSERT INTO `class_logs` (`id`, `record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`) VALUES
(1, 8, 2, 'THEM', 'Tạo lớp: Pre-Ielts - Ca 1 (2-4-6) - Mr.Minh', NULL, '2025-11-30 19:49:14'),
(2, 9, 2, 'THEM', 'Tạo lớp: Ielts 4 - Ca 1 (2-4-6) - Mr.Lâm', NULL, '2025-11-30 20:07:07'),
(3, 10, 2, 'THEM', 'Tạo lớp: Toeic 1 - Ca 1 (T7-CN) - Ms.Linh', NULL, '2025-11-30 20:11:38'),
(4, 11, 2, 'THEM', 'Tạo lớp: Early - Ca 2 (T7-CN) - Ms.Thảo', NULL, '2025-12-02 22:33:57'),
(5, 9, 2, 'THEM_HV', 'Thêm học viên Tạ Minh Hậu', NULL, '2025-12-02 22:49:50'),
(6, 11, 2, 'THEM_HV', 'Thêm học viên Phát', NULL, '2025-12-06 16:01:13'),
(7, 12, 2, 'THEM', 'Tạo lớp: Toeic 1 - Ca 2 (T7-CN) - Mr.Nam', NULL, '2025-12-13 10:22:20');

--
-- Bẫy `class_logs`
--
DROP TRIGGER IF EXISTS `sync_class_logs`;
DELIMITER $$
CREATE TRIGGER `sync_class_logs` AFTER INSERT ON `class_logs` FOR EACH ROW BEGIN
    INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
    VALUES (
        NEW.actor_id, 
        CONCAT('LOP_HOC_', NEW.action), -- Ví dụ: LOP_HOC_THEM, LOP_HOC_THEM_HV
        NEW.description, 
        NEW.created_at
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
CREATE TABLE IF NOT EXISTS `email_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `recipient_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recipient_email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'success',
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `email_logs`
--

INSERT INTO `email_logs` (`id`, `sender_id`, `recipient_name`, `recipient_email`, `subject`, `content`, `status`, `sent_at`) VALUES
(1, 2, 'Bùi Tiến Dũng', 'dung.bui@gmail.com', 'thông báo nghỉ học', 'Chào bạn nghỉ nhe', 'success', '2025-12-06 02:26:24'),
(2, 2, 'Bùi Phương Thảo', 'thao.bui@engbreak.edu.vn', 'Thông Báo Nghỉ Việc', '2', 'success', '2025-12-06 03:19:11'),
(3, 2, 'Bùi Phương Thảo', 'thao.bui@engbreak.edu.vn', 'Thông báo nghỉ học', '2', 'success', '2025-12-06 03:20:19'),
(4, 2, 'Bùi Phương Thảo', 'thao.bui@engbreak.edu.vn', 'Thông báo nghỉ học', '2', 'success', '2025-12-06 03:21:37'),
(5, 2, 'Bùi Phương Thảo', 'thao.bui@engbreak.edu.vn', 'Thông báo nghỉ học', '2', 'success', '2025-12-06 03:22:26'),
(6, 2, 'Bùi Trần Nhật Quang', 'quangbuitrannhat@gmail.com', 'Thông báo nghỉ học', '2', 'success', '2025-12-06 03:25:52'),
(7, 2, 'Bùi Trần Nhật Quang', 'quangbuitrannhat@gmail.com', 'Thông báo nghỉ học', '2', 'success', '2025-12-06 03:27:19'),
(8, 2, 'Bùi Phương Thảo', 'thao.bui@engbreak.edu.vn', 'Thông Báo Nghỉ Việc', '2', 'success', '2025-12-06 03:29:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
CREATE TABLE IF NOT EXISTS `email_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `email_templates`
--

INSERT INTO `email_templates` (`id`, `name`, `subject`, `content`) VALUES
(1, 'Thông báo nghỉ lễ', 'Thông báo nghỉ lễ - Trung tâm EngBreak', '<p>Chào bạn,</p><p>Trung tâm xin thông báo lịch nghỉ lễ...</p>'),
(2, 'Nhắc đóng học phí', 'Nhắc nhở đóng học phí tháng này', '<p>Chào quý phụ huynh,</p><p>Đây là thông báo nhắc nhở về khoản học phí...</p>');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `registration_date` date DEFAULT (curdate()),
  `start_study_date` date DEFAULT NULL,
  `end_study_date` date DEFAULT NULL,
  `is_special_schedule` tinyint DEFAULT '0',
  `special_days` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('chua_dong_tien','dang_hoc','chuyen_lop','bao_luu','het_han') COLLATE utf8mb4_general_ci DEFAULT 'chua_dong_tien',
  `note` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `class_id` (`class_id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `enrollments`
--

INSERT INTO `enrollments` (`id`, `student_id`, `class_id`, `registration_date`, `start_study_date`, `end_study_date`, `is_special_schedule`, `special_days`, `status`, `note`) VALUES
(1, 1, 1, '2025-11-28', NULL, '2025-12-06', 0, NULL, 'dang_hoc', NULL),
(2, 2, 3, '2025-11-28', NULL, '2025-12-05', 0, NULL, 'dang_hoc', NULL),
(3, 3, 3, '2025-11-28', NULL, '2026-05-19', 0, NULL, 'dang_hoc', NULL),
(4, 4, 1, '2025-11-28', NULL, '2026-03-23', 0, NULL, 'dang_hoc', NULL),
(5, 5, 7, '2025-11-28', NULL, '2026-05-18', 0, NULL, 'dang_hoc', NULL),
(6, 6, 5, '2025-11-28', NULL, '2026-03-24', 0, NULL, 'dang_hoc', NULL),
(7, 11, 4, '2025-11-28', NULL, '2026-03-24', 0, NULL, 'dang_hoc', NULL),
(8, 7, 3, '2025-11-28', NULL, '2026-03-23', 0, NULL, 'dang_hoc', NULL),
(9, 8, 1, '2025-11-28', NULL, '2026-03-24', 0, NULL, 'dang_hoc', NULL),
(10, 9, 3, '2025-11-28', NULL, '2026-03-24', 0, NULL, 'dang_hoc', NULL),
(11, 10, 7, '2025-11-28', NULL, '2026-03-24', 0, NULL, 'dang_hoc', NULL),
(12, 12, 4, '2025-11-28', NULL, '2026-03-23', 0, NULL, 'dang_hoc', NULL),
(13, 13, 3, '2025-11-28', NULL, '2026-05-18', 0, NULL, 'dang_hoc', NULL),
(14, 14, 6, '2025-11-28', NULL, '2026-03-22', 0, NULL, 'dang_hoc', NULL),
(15, 15, 5, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(16, 16, 3, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(17, 17, 4, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(18, 18, 6, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(19, 19, 5, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(20, 20, 5, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(21, 21, 4, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(22, 22, 7, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(23, 23, 1, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(24, 24, 3, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(25, 25, 6, '2025-11-28', NULL, '2026-03-22', 0, NULL, 'dang_hoc', NULL),
(26, 26, 4, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(27, 27, 7, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(28, 28, 5, '2025-11-28', NULL, '2026-03-24', 0, NULL, 'dang_hoc', NULL),
(29, 29, 1, '2025-11-28', NULL, '2026-01-27', 0, NULL, 'dang_hoc', NULL),
(30, 30, 3, '2025-11-28', NULL, '2027-08-10', 0, NULL, 'dang_hoc', NULL),
(31, 31, 9, '2025-12-02', NULL, '2026-03-24', 0, NULL, 'dang_hoc', NULL),
(32, 32, 11, '2025-12-06', NULL, NULL, 0, NULL, 'dang_hoc', NULL);

--
-- Bẫy `enrollments`
--
DROP TRIGGER IF EXISTS `update_count_after_delete`;
DELIMITER $$
CREATE TRIGGER `update_count_after_delete` AFTER DELETE ON `enrollments` FOR EACH ROW UPDATE `classes` 
SET student_count = student_count - (OLD.status = 'dang_hoc')
WHERE id = OLD.class_id
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `update_count_after_insert`;
DELIMITER $$
CREATE TRIGGER `update_count_after_insert` AFTER INSERT ON `enrollments` FOR EACH ROW UPDATE `classes` 
SET student_count = student_count + (NEW.status = 'dang_hoc')
WHERE id = NEW.class_id
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `update_count_after_update`;
DELIMITER $$
CREATE TRIGGER `update_count_after_update` AFTER UPDATE ON `enrollments` FOR EACH ROW UPDATE `classes` 
SET student_count = student_count 
    + (NEW.status = 'dang_hoc') -- Cộng 1 nếu trạng thái mới là đang học
    - (OLD.status = 'dang_hoc') -- Trừ 1 nếu trạng thái cũ là đang học
WHERE id = NEW.class_id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `levels`
--

DROP TABLE IF EXISTS `levels`;
CREATE TABLE IF NOT EXISTS `levels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `course_duration` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '5-6 tháng',
  `description` text COLLATE utf8mb4_general_ci,
  `sort_order` int DEFAULT '100',
  PRIMARY KEY (`id`),
  UNIQUE KEY `level_name` (`level_name`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `levels`
--

INSERT INTO `levels` (`id`, `level_name`, `course_duration`, `description`, `sort_order`) VALUES
(4, 'Ket', '5-6 tháng', 'Key English Test (A2)', 5),
(5, 'Early', '5-6 tháng', 'Tiếng Anh Mầm Non (Pre-School)', 1),
(6, 'Starter', '3-4 tháng', 'Cambridge Starters (Pre-A1)', 2),
(7, 'Mover', '5-6 tháng', 'Cambridge Movers (A1)', 3),
(8, 'Flyer', '5-6 tháng', 'Cambridge Flyers (A2)', 4),
(9, 'Pet', '5-6 tháng', 'Preliminary English Test (B1)', 6),
(10, 'Toeic 1', '5-6 tháng', 'TOEIC Căn bản (Mục tiêu 300-450)', 10),
(11, 'Toeic 2', '5-6 tháng', 'TOEIC Trung cấp (Mục tiêu 450-650)', 11),
(12, 'Toeic 3', '5-6 tháng', 'TOEIC Nâng cao (Mục tiêu 650-800+)', 12),
(13, 'Pre-Ielts', '6 tháng', 'Nhập môn IELTS (Làm quen format)', 20),
(14, 'Ielts 1', '6 tháng', 'IELTS Foundation (Band 3.5 - 4.5)', 21),
(15, 'Ielts 2', '6 tháng', 'IELTS Intermediate (Band 4.5 - 5.5)', 22),
(16, 'Ielts 3', '6 tháng', 'IELTS Upper-Inter (Band 5.5 - 6.5)', 23),
(17, 'Ielts 4', '6 tháng', 'IELTS Advanced (Band 6.5 - 7.5)', 24),
(18, 'Ielts 5', '6 tháng', 'IELTS Master (Band 7.5+)', 25),
(19, 'Giao tiếp A', '5-6 tháng', 'Giao tiếp Cơ bản (Mất gốc)', 30),
(20, 'Giao tiếp B', '5-6 tháng', 'Giao tiếp Phản xạ (Chủ đề thông dụng)', 31),
(21, 'Giao tiếp C', '5-6 tháng', 'Giao tiếp Chuyên sâu (Công việc/Thuyết trình)', 32);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `level_logs`
--

DROP TABLE IF EXISTS `level_logs`;
CREATE TABLE IF NOT EXISTS `level_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `actor_id` int NOT NULL,
  `action` enum('THEM','SUA','XOA') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bẫy `level_logs`
--
DROP TRIGGER IF EXISTS `sync_level_logs`;
DELIMITER $$
CREATE TRIGGER `sync_level_logs` AFTER INSERT ON `level_logs` FOR EACH ROW INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
VALUES (NEW.actor_id, CONCAT('CAP_DO_', NEW.action), NEW.description, NEW.created_at)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `weeks` int DEFAULT '0',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `original_amount` decimal(12,2) DEFAULT NULL,
  `discount_amount` decimal(12,2) DEFAULT '0.00',
  `promotion_id` int DEFAULT NULL,
  `final_amount` decimal(12,2) DEFAULT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('tien_mat','chuyen_khoan','vietqr') COLLATE utf8mb4_general_ci DEFAULT 'tien_mat',
  `transaction_code` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `enrollment_id` (`enrollment_id`),
  KEY `student_id` (`student_id`),
  KEY `promotion_id` (`promotion_id`)
) ENGINE=MyISAM AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`id`, `enrollment_id`, `student_id`, `weeks`, `start_date`, `end_date`, `original_amount`, `discount_amount`, `promotion_id`, `final_amount`, `payment_date`, `payment_method`, `transaction_code`, `note`) VALUES
(1, 9, 4, 0, NULL, NULL, NULL, 0.00, 2, 21111093.00, '2025-11-21 15:28:09', 'tien_mat', NULL, ''),
(2, 9, 4, 0, NULL, NULL, NULL, 0.00, 2, 21111093.00, '2025-11-21 15:44:17', 'tien_mat', NULL, ''),
(3, 1, 1, 0, NULL, NULL, 2000000.00, 200000.00, 2, 1800000.00, '2025-12-02 23:39:52', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(4, 1, 1, 0, NULL, NULL, 2000000.00, 200000.00, 2, 1800000.00, '2025-12-02 23:40:42', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-03-24)'),
(5, 31, 31, 0, NULL, NULL, 10450000.00, 1045000.00, 2, 9405000.00, '2025-12-02 23:40:55', 'tien_mat', NULL, 'Đóng phí 16 tuần (Đến 2026-03-24)'),
(6, 2, 2, 0, NULL, NULL, 4000000.00, 400000.00, 2, 3600000.00, '2025-12-02 23:41:02', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(7, 3, 3, 0, NULL, NULL, 4000000.00, 400000.00, 2, 3600000.00, '2025-12-02 23:41:05', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(8, 4, 4, 0, NULL, NULL, 2000000.00, 200000.00, 2, 1800000.00, '2025-12-02 23:41:08', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2025-12-06)'),
(9, 5, 5, 0, NULL, NULL, 3000000.00, 300000.00, 2, 2700000.00, '2025-12-02 23:41:11', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(10, 6, 6, 0, NULL, NULL, 2800000.00, 2800000.00, 4, 0.00, '2025-12-02 23:41:14', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(11, 6, 6, 0, NULL, NULL, 2800000.00, 2800000.00, 4, 0.00, '2025-12-02 23:41:41', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-03-24)'),
(12, 7, 11, 0, NULL, NULL, 2800000.00, 0.00, NULL, 2800000.00, '2025-12-02 23:41:50', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(13, 8, 7, 0, NULL, NULL, 4000000.00, 400000.00, 2, 3600000.00, '2025-12-02 23:41:54', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(14, 9, 8, 0, NULL, NULL, 3800000.00, 380000.00, 2, 3420000.00, '2025-12-02 23:41:57', 'tien_mat', NULL, 'Đóng phí 16 tuần (Đến 2026-03-24)'),
(15, 10, 9, 0, NULL, NULL, 7600000.00, 760000.00, 2, 6840000.00, '2025-12-02 23:42:00', 'tien_mat', NULL, 'Đóng phí 16 tuần (Đến 2026-03-24)'),
(16, 11, 10, 0, NULL, NULL, 5700000.00, 570000.00, 2, 5130000.00, '2025-12-02 23:42:04', 'tien_mat', NULL, 'Đóng phí 16 tuần (Đến 2026-03-24)'),
(17, 12, 12, 0, NULL, NULL, 2800000.00, 0.00, NULL, 2800000.00, '2025-12-02 23:42:07', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(18, 13, 13, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-02 23:42:09', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(19, 14, 14, 0, NULL, NULL, 2200000.00, 110000.00, 3, 2090000.00, '2025-12-02 23:42:12', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(20, 15, 15, 0, NULL, NULL, 2800000.00, 0.00, NULL, 2800000.00, '2025-12-02 23:42:16', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(21, 16, 16, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-02 23:42:19', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(22, 17, 17, 0, NULL, NULL, 2800000.00, 0.00, NULL, 2800000.00, '2025-12-02 23:42:21', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(23, 18, 18, 0, NULL, NULL, 2200000.00, 0.00, NULL, 2200000.00, '2025-12-02 23:42:24', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(24, 19, 19, 0, NULL, NULL, 2800000.00, 140000.00, 1, 2660000.00, '2025-12-02 23:42:26', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(25, 20, 20, 0, NULL, NULL, 2800000.00, 140000.00, 3, 2660000.00, '2025-12-02 23:42:30', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(26, 21, 21, 0, NULL, NULL, 2800000.00, 140000.00, 1, 2660000.00, '2025-12-02 23:42:32', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(27, 22, 22, 0, NULL, NULL, 3000000.00, 150000.00, 3, 2850000.00, '2025-12-02 23:42:35', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(28, 23, 23, 0, NULL, NULL, 2000000.00, 100000.00, 3, 1900000.00, '2025-12-02 23:42:37', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(29, 24, 24, 0, NULL, NULL, 4000000.00, 400000.00, 2, 3600000.00, '2025-12-02 23:42:41', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(30, 25, 25, 0, NULL, NULL, 2200000.00, 220000.00, 2, 1980000.00, '2025-12-02 23:42:44', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(31, 26, 26, 0, NULL, NULL, 2800000.00, 280000.00, 2, 2520000.00, '2025-12-02 23:42:47', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(32, 27, 27, 0, NULL, NULL, 3000000.00, 150000.00, 3, 2850000.00, '2025-12-02 23:42:50', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(33, 28, 28, 0, NULL, NULL, 2800000.00, 140000.00, 3, 2660000.00, '2025-12-02 23:42:55', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(34, 29, 29, 0, NULL, NULL, 2000000.00, 200000.00, 2, 1800000.00, '2025-12-02 23:42:58', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(35, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-02 23:43:01', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-01-27)'),
(36, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-02 23:46:42', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-03-24)'),
(37, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-02 23:56:16', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-05-19)'),
(38, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:01:10', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-07-14)'),
(39, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:05:33', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-09-08)'),
(40, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:06:01', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-11-03)'),
(41, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:06:14', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2026-12-29)'),
(42, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:06:36', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2027-02-23)'),
(43, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:06:59', 'tien_mat', NULL, 'Đóng phí 8 tuần (Đến 2027-04-20)'),
(44, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:10:51', 'tien_mat', NULL, 'Gia hạn 8 tuần (Đến 15/06)'),
(45, 30, 30, 0, NULL, NULL, 4000000.00, 0.00, NULL, 4000000.00, '2025-12-03 00:12:09', 'tien_mat', NULL, 'Gia hạn 8 tuần (Đến 10/08)'),
(46, 2, 2, 0, NULL, NULL, 4000000.00, 400000.00, 2, 3600000.00, '2025-12-03 00:12:30', 'vietqr', NULL, 'Gia hạn 8 tuần (Đến 24/03)'),
(47, 3, 3, 8, '2026-01-27', '2026-03-24', 4000000.00, 400000.00, 2, 3600000.00, '2025-12-03 00:24:26', 'tien_mat', NULL, 'Gia hạn 8 tuần'),
(48, 3, 3, 8, '2026-03-24', '2026-05-19', 4000000.00, 400000.00, 2, 3600000.00, '2025-12-03 00:25:23', 'tien_mat', NULL, 'Gia hạn 8 tuần'),
(49, 7, 11, 8, '2026-01-27', '2026-03-24', 2800000.00, 0.00, NULL, 2800000.00, '2025-12-03 00:25:46', 'vietqr', NULL, 'Gia hạn 8 tuần'),
(50, 5, 5, 8, '2026-01-27', '2026-03-23', 3000000.00, 300000.00, 2, 2700000.00, '2025-12-03 23:05:19', 'tien_mat', NULL, 'Đóng 8 tuần (28/01 -> 23/03)'),
(51, 5, 5, 8, '2026-03-23', '2026-05-18', 3000000.00, 300000.00, 2, 2700000.00, '2025-12-03 23:07:10', 'tien_mat', NULL, 'Đóng 8 tuần (25/03 -> 18/05)'),
(52, 4, 4, 8, '2026-01-27', '2026-03-23', 2000000.00, 200000.00, 2, 1800000.00, '2025-12-03 23:07:30', 'tien_mat', NULL, 'Đóng 8 tuần (29/01 -> 23/03)'),
(53, 8, 7, 8, '2026-01-27', '2026-03-23', 4000000.00, 400000.00, 2, 3600000.00, '2025-12-03 23:07:56', 'tien_mat', NULL, 'Đóng 8 tuần (29/01 -> 23/03)'),
(54, 28, 28, 8, '2026-01-27', '2026-03-24', 2800000.00, 140000.00, 3, 2660000.00, '2025-12-03 23:09:00', 'tien_mat', NULL, 'Đóng 8 tuần (29/01 -> 24/03)'),
(55, 12, 12, 8, '2026-01-27', '2026-03-23', 2800000.00, 0.00, NULL, 2800000.00, '2025-12-06 02:50:14', 'vietqr', NULL, 'Đóng 8 tuần (29/01 -> 23/03)'),
(56, 13, 13, 16, '2026-01-27', '2026-05-18', 7600000.00, 0.00, NULL, 7600000.00, '2025-12-06 14:05:51', 'tien_mat', NULL, 'Đóng 16 tuần (29/01 -> 18/05)'),
(57, 14, 14, 8, '2026-01-27', '2026-03-22', 2200000.00, 110000.00, 3, 2090000.00, '2025-12-06 15:48:01', 'vietqr', NULL, 'Đóng 8 tuần (29/01 -> 22/03)'),
(58, 25, 25, 8, '2026-01-27', '2026-03-22', 2200000.00, 220000.00, 2, 1980000.00, '2025-12-06 15:50:06', 'vietqr', NULL, 'Đóng 8 tuần (29/01 -> 22/03)');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotions`
--

DROP TABLE IF EXISTS `promotions`;
CREATE TABLE IF NOT EXISTS `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `discount_percent` int DEFAULT NULL,
  `condition_type` enum('none','seniority_1y','seniority_2y','family','special') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `promotions`
--

INSERT INTO `promotions` (`id`, `name`, `discount_percent`, `condition_type`, `description`) VALUES
(1, 'Học trên 1 năm', 5, 'seniority_1y', NULL),
(2, 'Học trên 2 năm', 10, 'seniority_2y', NULL),
(3, 'Gia đình/Người thân', 5, 'family', NULL),
(4, 'Đặc biệt (Học bổng)', 100, 'special', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotion_logs`
--

DROP TABLE IF EXISTS `promotion_logs`;
CREATE TABLE IF NOT EXISTS `promotion_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `actor_id` int NOT NULL,
  `action` enum('THEM','SUA','XOA') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bẫy `promotion_logs`
--
DROP TRIGGER IF EXISTS `sync_promotion_logs`;
DELIMITER $$
CREATE TRIGGER `sync_promotion_logs` AFTER INSERT ON `promotion_logs` FOR EACH ROW INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
VALUES (NEW.actor_id, CONCAT('KHUYEN_MAI_', NEW.action), NEW.description, NEW.created_at)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `registration_keys`
--

DROP TABLE IF EXISTS `registration_keys`;
CREATE TABLE IF NOT EXISTS `registration_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_code` varchar(50) NOT NULL,
  `is_used` tinyint(1) DEFAULT '0' COMMENT '0: Chưa dùng, 1: Đã dùng',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_code` (`key_code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `registration_keys`
--

INSERT INTO `registration_keys` (`id`, `key_code`, `is_used`, `created_at`) VALUES
(1, 'NV-123456', 1, '2025-11-23 11:08:54'),
(2, 'NV-999888', 1, '2025-11-23 11:08:54'),
(3, 'NV-ABCXYZ', 1, '2025-11-23 11:08:54'),
(4, 'Admin', 1, '2025-11-23 11:16:56'),
(5, 'NV-630378', 1, '2025-11-26 16:24:49'),
(6, 'NV-522924', 0, '2025-11-26 22:54:50'),
(7, 'NV-125496', 1, '2025-11-26 22:54:58'),
(8, 'NV-354750', 0, '2025-11-26 22:56:46'),
(9, 'NV-263792', 0, '2025-11-26 23:01:18'),
(10, 'NV-871316', 0, '2025-11-27 22:46:18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('san_sang','dang_su_dung','bao_tri') COLLATE utf8mb4_general_ci DEFAULT 'san_sang',
  `note` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_name` (`room_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `room_name`, `status`, `note`) VALUES
(1, 'P.101', 'san_sang', 'Lầu 1 - Sức chứa 20 HV'),
(2, 'P.102', 'san_sang', 'Lầu 1 - Sức chứa 20 HV'),
(3, 'P.103', 'san_sang', 'Lầu 1 - Phòng Kid'),
(4, 'P.104', 'san_sang', 'Lầu 1 - Phòng Kid'),
(5, 'P.201', 'san_sang', 'Lầu 2 - Máy lạnh mới'),
(6, 'P.202', 'san_sang', 'Lầu 2 - Sức chứa 30 HV'),
(7, 'P.203', 'san_sang', 'Lầu 2'),
(8, 'P.204', 'san_sang', 'Lầu 2'),
(9, 'P.301', 'san_sang', 'Lầu 3 - Phòng Lab (Nghe/Nói)'),
(10, 'P.302', 'san_sang', 'Lầu 3'),
(11, 'P.303', 'san_sang', 'Lầu 3'),
(12, 'P.304', 'san_sang', 'Lầu 3'),
(13, 'P.401', 'san_sang', 'Lầu 4 - Hội trường nhỏ'),
(14, 'P.402', 'san_sang', 'Lầu 4'),
(15, 'P.403', 'bao_tri', 'Lầu 4 - Hỏng máy chiếu, đang sửa'),
(16, 'P.404', 'bao_tri', 'Lầu 4 - Thấm trần, chưa sử dụng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_logs`
--

DROP TABLE IF EXISTS `room_logs`;
CREATE TABLE IF NOT EXISTS `room_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `actor_id` int NOT NULL,
  `action` enum('THEM','SUA','XOA','DOI_TRANG_THAI') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `room_logs`
--

INSERT INTO `room_logs` (`id`, `record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`) VALUES
(1, 14, 0, 'DOI_TRANG_THAI', 'Phòng P.402: san_sang -> bao_tri', '{\"new_status\": \"bao_tri\", \"old_status\": \"san_sang\"}', '2025-11-30 20:00:52'),
(2, 14, 2, 'SUA', 'Cập nhật phòng: P.402', '{\"id\": 14, \"note\": \"Lầu 4\", \"status\": \"san_sang\", \"room_name\": \"P.402\"}', '2025-11-30 20:00:52'),
(3, 14, 2, 'SUA', 'Cập nhật thông tin phòng: P.402', '{\"id\": 14, \"note\": \"Lầu 4\", \"status\": \"bao_tri\", \"room_name\": \"P.402\"}', '2025-11-30 20:06:10'),
(4, 14, 2, 'DOI_TRANG_THAI', 'Đổi trạng thái phòng P.402: Bảo trì -> Sẵn sàng', NULL, '2025-11-30 20:06:10');

--
-- Bẫy `room_logs`
--
DROP TRIGGER IF EXISTS `sync_room_logs`;
DELIMITER $$
CREATE TRIGGER `sync_room_logs` AFTER INSERT ON `room_logs` FOR EACH ROW BEGIN
    INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
    VALUES (
        NEW.actor_id, 
        CONCAT('PHONG_HOC_', NEW.action), 
        NEW.description, 
        NEW.created_at
    );
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shifts`
--

DROP TABLE IF EXISTS `shifts`;
CREATE TABLE IF NOT EXISTS `shifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `days` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shifts`
--

INSERT INTO `shifts` (`id`, `shift_name`, `days`, `start_time`, `end_time`) VALUES
(1, 'Ca 1 (2-4-6)', '2-4-6', '17:45:00', '19:15:00'),
(2, 'Ca 2 (2-4-6)', '2-4-6', '19:30:00', '21:00:00'),
(3, 'Ca 1 (3-5-7)', '3-5-7', '17:45:00', '19:15:00'),
(4, 'Ca 1 (T7-CN)', 'T7-CN', '07:30:00', '09:30:00'),
(5, 'Ca 2 (3-5-7)', '3-5-7', '19:30:00', '21:00:00'),
(6, 'Ca 2 (T7-CN)', 'T7-CN', '09:45:00', '11:45:00'),
(7, 'Ca 3 (T7-CN)', 'T7-CN', '15:00:00', '17:00:00'),
(8, 'Ca 1 (T2-T4)', '2-4', '17:30:00', '19:30:00'),
(9, 'Ca 1 (T3-T5)', '3-5', '17:30:00', '19:30:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Nam','Nu','Khac') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parent_phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'default_student.png',
  `address` text COLLATE utf8mb4_general_ci,
  `note` text COLLATE utf8mb4_general_ci,
  `join_date` date DEFAULT (curdate()),
  `status` tinyint DEFAULT '1',
  `learning_status` enum('dang_hoc','bao_luu','da_nghi') COLLATE utf8mb4_general_ci DEFAULT 'dang_hoc',
  `promotion_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `promotion_id` (`promotion_id`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`id`, `full_name`, `dob`, `gender`, `phone`, `parent_phone`, `email`, `avatar`, `address`, `note`, `join_date`, `status`, `learning_status`, `promotion_id`) VALUES
(1, 'Nguyễn Văn An', '2012-05-15', 'Nam', '0912345678', '0912345678', 'an.nguyen@gmail.com', 'default_student.png', '123 Lê Lợi, P.1, TP. Cao Lãnh', '', '2021-01-10', 1, 'dang_hoc', 2),
(2, 'Trần Thị Bích', '2010-08-20', 'Nu', '0987654321', '0987654321', 'bich.tran@gmail.com', 'default_student.png', '45 Nguyễn Huệ, P.2', '', '2022-05-20', 1, 'dang_hoc', 2),
(3, 'Lê Hoàng Nam', '2003-12-12', 'Nam', '0909090909', '0909090909', 'nam.le@yahoo.com', 'default_student.png', '78 Trần Hưng Đạo, P. Hòa Thuận', '', '2023-11-01', 1, 'dang_hoc', 2),
(4, 'Phạm Minh Khôi', '2016-01-30', 'Nam', '0933445566', '0933445566', 'minhkhoi@gmail.com', 'default_student.png', 'Khu đô thị Vincom', '', '2023-10-15', 1, 'dang_hoc', 2),
(5, 'Nguyễn Thị Mai', '2008-07-15', 'Nu', '0911223344', '0977889900', 'mai.nguyen@outlook.com', 'default_student.png', 'Xã Mỹ Tân, Cao Lãnh', '', '2023-09-05', 1, 'dang_hoc', 2),
(6, 'Hoàng Văn Long', '2014-03-25', 'Nam', '0912987654', '0912987654', 'long.hoang@gmail.com', 'default_student.png', 'Đường 30/4, Phường 1', '', '2023-08-01', 1, 'dang_hoc', 4),
(11, 'Nguyễn Bảo Ngọc', '2015-01-15', 'Nu', '0912000111', '0912000111', 'ngoc.baonguyen@gmail.com', 'default_student.png', 'P.1, TP. Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', NULL),
(7, 'Đoàn Thu Hà', '2015-09-09', 'Nu', '0945678901', '0945678901', 'ha.doan@gmail.com', 'default_student.png', 'Phường 3, TP. Sa Đéc', '', '2023-06-20', 1, 'bao_luu', 2),
(8, 'Vũ Đức Thắng', '2005-11-20', 'Nam', '0868123123', '0868123123', 'thang.vu@company.com', 'default_student.png', 'Ký túc xá Đại học', '', '2023-01-01', 0, 'dang_hoc', 2),
(9, 'Ngô Bảo Châu', '2013-02-14', 'Nu', '0988776655', '0988776655', 'chau.ngo@gmail.com', 'default_student.png', 'Phường 6, TP. Cao Lãnh', '', '2022-12-12', 1, 'dang_hoc', 2),
(10, 'Lý Hải Đăng', '2018-06-01', 'Nam', '0911112222', '0911112222', 'lyhaidang@gmail.com', 'default_student.png', 'Phường 11, TP. Cao Lãnh', '', '2023-11-10', 1, 'da_nghi', 2),
(12, 'Trần Minh Khôi', '2014-03-20', 'Nam', '0912000222', '0912000222', 'khoi.tran@gmail.com', 'default_student.png', 'P.2, TP. Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', NULL),
(13, 'Lê Gia Hân', '2013-05-10', 'Nu', '0912000333', '0912000333', 'han.legia@gmail.com', 'default_student.png', 'P.3, TP. Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', NULL),
(14, 'Phạm Đức Anh', '2012-07-25', 'Nam', '0912000444', '0912000444', 'ducanh.pham@gmail.com', 'default_student.png', 'P.4, TP. Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', 3),
(15, 'Hoàng Yến Nhi', '2016-09-12', 'Nu', '0912000555', '0912000555', 'nhi.hoangyen@gmail.com', 'default_student.png', 'Xã Mỹ Ngãi', NULL, '2025-11-28', 1, 'dang_hoc', NULL),
(16, 'Vũ Tuấn Kiệt', '2010-11-30', 'Nam', '0912000666', '0912000666', 'kiet.vu@gmail.com', 'default_student.png', 'P.11, TP. Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', NULL),
(17, 'Đặng Minh Châu', '2011-02-14', 'Nu', '0912000777', '0912000777', 'chau.dang@gmail.com', 'default_student.png', 'P. Hòa Thuận', NULL, '2025-11-28', 1, 'dang_hoc', NULL),
(18, 'Bùi Tiến Dũng', '2005-06-18', 'Nam', '0988111222', '0988111222', 'dung.bui@gmail.com', 'default_student.png', 'Huyện Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', NULL),
(19, 'Ngô Phương Linh', '2004-08-22', 'Nu', '0988222333', '0988222333', 'linh.ngo@gmail.com', 'default_student.png', 'Huyện Tháp Mười', NULL, '2025-11-28', 1, 'dang_hoc', 1),
(20, 'Dương Văn Hậu', '2003-12-05', 'Nam', '0988333444', '0988333444', 'hau.duong@gmail.com', 'default_student.png', 'P. Mỹ Phú', NULL, '2025-11-28', 1, 'dang_hoc', 3),
(21, 'Hồ Thị Thu', '1998-10-10', 'Nu', '0988444555', '0988444555', 'thu.ho@gmail.com', 'default_student.png', 'P.6, TP. Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', 1),
(22, 'Lý Văn Cường', '1995-04-15', 'Nam', '0988555666', '0988555666', 'cuong.ly@gmail.com', 'default_student.png', 'Khu 500 Căn', NULL, '2025-11-28', 1, 'dang_hoc', 3),
(23, 'Mai Thị Tuyết', '2000-01-20', 'Nu', '0988666777', '0988666777', 'tuyet.mai@gmail.com', 'default_student.png', 'Đường 30/4', NULL, '2025-11-28', 1, 'dang_hoc', 3),
(24, 'Trương Tấn Sang', '2006-05-05', 'Nam', '0988777888', '0912888999', 'sang.truong@gmail.com', 'default_student.png', 'Cầu Cái Vừng', NULL, '2025-11-28', 1, 'bao_luu', 2),
(25, 'Võ Thị Bích', '2007-07-07', 'Nu', '0988888999', '0912999000', 'bich.vo@gmail.com', 'default_student.png', 'Chợ Cao Lãnh', NULL, '2025-11-28', 1, 'dang_hoc', 2),
(26, 'Đinh Văn Lâm', '2008-09-09', 'Nam', '0988999000', '0912000111', 'lam.dinh@gmail.com', 'default_student.png', 'Đường Lý Thường Kiệt', NULL, '2025-11-28', 1, 'dang_hoc', 2),
(27, 'Lương Thùy Linh', '2009-11-11', 'Nu', '0912111222', '0912111222', 'linh.luong@gmail.com', 'default_student.png', 'Vincom Plaza', NULL, '2025-11-28', 1, 'dang_hoc', 3),
(28, 'Quách Ngọc Ngoan', '2017-02-28', 'Nam', '0912222333', '0912222333', 'quachngocngoan@gmail.com', 'default_student.png', 'Công viên Văn Miếu', NULL, '2025-11-28', 1, 'dang_hoc', 3),
(29, 'Tạ Bích Loan', '2012-07-15', 'Nu', '0909123123', '0909123123', 'loan.ta@gmail.com', 'default_student.png', 'Sở Y Tế', NULL, '2025-11-28', 1, 'dang_hoc', 2),
(30, 'Phan Anh Tuấn', '1990-12-20', 'Nam', '0909456456', '0909456456', 'tuan.phan@gmail.com', 'default_student.png', 'Bưu điện Tỉnh', NULL, '2025-11-28', 1, 'da_nghi', NULL),
(32, 'Phát', '2003-07-14', 'Nam', '0999999999', '0999999999', NULL, 'default_student.png', '1069 Trần Hưng Đạo', NULL, '2025-12-06', 1, 'dang_hoc', 2),
(33, 'Phát', '2003-02-24', 'Nam', '0999999998', '0999999998', NULL, 'default_student.png', '', NULL, '2025-12-09', 1, 'dang_hoc', NULL);

--
-- Bẫy `students`
--
DROP TRIGGER IF EXISTS `track_student_status_change`;
DELIMITER $$
CREATE TRIGGER `track_student_status_change` AFTER UPDATE ON `students` FOR EACH ROW BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO `student_logs` (`record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`)
        VALUES (
            NEW.id, 
            0, 
            'SUA', 
            CONCAT('Trạng thái thay đổi: ', OLD.status, ' -> ', NEW.status), 
            JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status),
            NOW()
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `student_logs`
--

DROP TABLE IF EXISTS `student_logs`;
CREATE TABLE IF NOT EXISTS `student_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `actor_id` int NOT NULL,
  `action` enum('THEM','SUA','XOA') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `record_id` (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `student_logs`
--

INSERT INTO `student_logs` (`id`, `record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`) VALUES
(1, 29, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '{\"id\": 29, \"dob\": \"1985-06-15\", \"note\": null, \"email\": \"loan.ta@gmail.com\", \"phone\": \"0909123123\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Sở Y Tế\", \"full_name\": \"Tạ Bích Loan\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"\", \"learning_status\": \"dang_hoc\"}', '2025-11-30 20:54:24'),
(2, 29, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '{\"id\": 29, \"dob\": \"2012-06-15\", \"note\": null, \"email\": \"loan.ta@gmail.com\", \"phone\": \"0909123123\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Sở Y Tế\", \"full_name\": \"Tạ Bích Loan\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0909123123\", \"learning_status\": \"dang_hoc\"}', '2025-11-30 20:57:04'),
(3, 29, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '{\"id\": 29, \"dob\": \"2012-06-15\", \"note\": null, \"email\": \"loan.ta@gmail.com\", \"phone\": \"0909123123\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Sở Y Tế\", \"full_name\": \"Tạ Bích Loan\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0909123123\", \"learning_status\": \"dang_hoc\"}', '2025-11-30 21:09:50'),
(4, 29, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '{\"id\": 29, \"dob\": \"2012-07-15\", \"note\": null, \"email\": \"loan.ta@gmail.com\", \"phone\": \"0909123123\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Sở Y Tế\", \"full_name\": \"Tạ Bích Loan\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0909123123\", \"learning_status\": \"dang_hoc\"}', '2025-11-30 21:10:58'),
(5, 29, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Bích Loan', '{\"id\": 29, \"dob\": \"2012-07-15\", \"note\": null, \"email\": \"loan.ta@gmail.com\", \"phone\": \"0909123123\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Sở Y Tế\", \"full_name\": \"Tạ Bích Loan\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0909123123\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:23:47'),
(6, 28, 2, 'SUA', 'Cập nhật hồ sơ: Quách Ngọc Ngoan', '{\"id\": 28, \"dob\": \"2017-02-28\", \"note\": null, \"email\": \"quachngocngoan@gmail.com\", \"phone\": \"0912222333\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"Công viên Văn Miếu\", \"full_name\": \"Quách Ngọc Ngoan\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0912222333\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:23:55'),
(7, 27, 2, 'SUA', 'Cập nhật hồ sơ: Lương Thùy Linh', '{\"id\": 27, \"dob\": \"2009-11-11\", \"note\": null, \"email\": \"linh.luong@gmail.com\", \"phone\": \"0912111222\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Vincom Plaza\", \"full_name\": \"Lương Thùy Linh\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0912111222\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:23:59'),
(8, 26, 2, 'SUA', 'Cập nhật hồ sơ: Đinh Văn Lâm', '{\"id\": 26, \"dob\": \"2008-09-09\", \"note\": null, \"email\": \"lam.dinh@gmail.com\", \"phone\": \"0988999000\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"Đường Lý Thường Kiệt\", \"full_name\": \"Đinh Văn Lâm\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0912000111\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:24:04'),
(9, 25, 2, 'SUA', 'Cập nhật hồ sơ: Võ Thị Bích', '{\"id\": 25, \"dob\": \"2007-07-07\", \"note\": null, \"email\": \"bich.vo@gmail.com\", \"phone\": \"0988888999\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Chợ Cao Lãnh\", \"full_name\": \"Võ Thị Bích\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0912999000\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:24:08'),
(10, 23, 2, 'SUA', 'Cập nhật hồ sơ: Mai Thị Tuyết', '{\"id\": 23, \"dob\": \"2000-01-20\", \"note\": null, \"email\": \"tuyet.mai@gmail.com\", \"phone\": \"0988666777\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Đường 30/4\", \"full_name\": \"Mai Thị Tuyết\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0988666777\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:24:13'),
(11, 22, 2, 'SUA', 'Cập nhật hồ sơ: Lý Văn Cường', '{\"id\": 22, \"dob\": \"1995-04-15\", \"note\": null, \"email\": \"cuong.ly@gmail.com\", \"phone\": \"0988555666\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"Khu 500 Căn\", \"full_name\": \"Lý Văn Cường\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0988555666\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:24:17'),
(12, 21, 2, 'SUA', 'Cập nhật hồ sơ: Hồ Thị Thu', '{\"id\": 21, \"dob\": \"1998-10-10\", \"note\": null, \"email\": \"thu.ho@gmail.com\", \"phone\": \"0988444555\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"P.6, TP. Cao Lãnh\", \"full_name\": \"Hồ Thị Thu\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0988444555\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:24:31'),
(13, 19, 2, 'SUA', 'Cập nhật hồ sơ: Ngô Phương Linh', '{\"id\": 19, \"dob\": \"2004-08-22\", \"note\": null, \"email\": \"linh.ngo@gmail.com\", \"phone\": \"0988222333\", \"avatar\": \"default_student.png\", \"gender\": \"Nu\", \"status\": 1, \"address\": \"Huyện Tháp Mười\", \"full_name\": \"Ngô Phương Linh\", \"join_date\": \"2025-11-28\", \"parent_phone\": \"0988222333\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:24:37'),
(14, 31, 2, 'THEM', 'Thêm học viên: Tạ Minh Hậu', NULL, '2025-12-02 18:50:37'),
(15, 31, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '{\"id\": 31, \"dob\": \"2004-12-21\", \"note\": null, \"email\": null, \"phone\": \"0987459353\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Tạ Minh Hậu\", \"join_date\": \"2023-01-02\", \"parent_phone\": \"0987459353\", \"promotion_id\": null, \"learning_status\": \"dang_hoc\"}', '2025-12-02 18:50:54'),
(16, 31, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '{\"id\": 31, \"dob\": \"2004-12-21\", \"note\": null, \"email\": null, \"phone\": \"0987459353\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Tạ Minh Hậu\", \"join_date\": \"2023-01-02\", \"parent_phone\": \"0987459353\", \"promotion_id\": 2, \"learning_status\": \"dang_hoc\"}', '2025-12-05 17:57:58'),
(17, 31, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '{\"id\": 31, \"dob\": \"2004-12-21\", \"note\": null, \"email\": null, \"phone\": \"0987459353\", \"avatar\": \"std_1764932278.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Tạ Minh Hậu\", \"join_date\": \"2023-01-02\", \"parent_phone\": \"0987459353\", \"promotion_id\": 2, \"learning_status\": \"dang_hoc\"}', '2025-12-05 17:58:27'),
(18, 31, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '{\"id\": 31, \"dob\": \"2004-12-21\", \"note\": null, \"email\": null, \"phone\": \"0987459353\", \"avatar\": \"std_1764932307.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Tạ Minh Hậu\", \"join_date\": \"2023-01-02\", \"parent_phone\": \"0987459353\", \"promotion_id\": 2, \"learning_status\": \"dang_hoc\"}', '2025-12-05 17:58:41'),
(19, 31, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '{\"id\": 31, \"dob\": \"2004-12-21\", \"note\": null, \"email\": null, \"phone\": \"0987459353\", \"avatar\": \"std_1764932321.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Tạ Minh Hậu\", \"join_date\": \"2023-01-02\", \"parent_phone\": \"0987459353\", \"promotion_id\": 2, \"learning_status\": \"dang_hoc\"}', '2025-12-05 17:59:23'),
(20, 31, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', '{\"id\": 31, \"dob\": \"2004-12-21\", \"note\": null, \"email\": null, \"phone\": \"0987459353\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Tạ Minh Hậu\", \"join_date\": \"2023-01-02\", \"parent_phone\": \"0987459353\", \"promotion_id\": 2, \"learning_status\": \"dang_hoc\"}', '2025-12-05 18:00:20'),
(21, 31, 2, 'SUA', 'Cập nhật hồ sơ: Tạ Minh Hậu', NULL, '2025-12-05 18:00:35'),
(22, 32, 2, 'THEM', 'Thêm học viên: Phát', NULL, '2025-12-06 16:00:44'),
(23, 32, 2, 'SUA', 'Cập nhật hồ sơ: Phát', '{\"id\": 32, \"dob\": \"2003-07-14\", \"note\": null, \"email\": null, \"phone\": \"0999999999\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Phát\", \"join_date\": \"2025-12-06\", \"parent_phone\": \"0999999999\", \"promotion_id\": 2, \"learning_status\": \"dang_hoc\"}', '2025-12-06 16:19:04'),
(24, 32, 2, 'SUA', 'Cập nhật hồ sơ: Phát', '{\"id\": 32, \"dob\": \"2003-07-14\", \"note\": null, \"email\": null, \"phone\": \"09999999993\", \"avatar\": \"default_student.png\", \"gender\": \"Nam\", \"status\": 1, \"address\": \"1069 Trần Hưng Đạo\", \"full_name\": \"Phát\", \"join_date\": \"2025-12-06\", \"parent_phone\": \"0999999999\", \"promotion_id\": 2, \"learning_status\": \"dang_hoc\"}', '2025-12-06 16:19:12'),
(25, 33, 2, 'THEM', 'Thêm học viên: Phát', NULL, '2025-12-09 18:09:41');

--
-- Bẫy `student_logs`
--
DROP TRIGGER IF EXISTS `sync_student_logs`;
DELIMITER $$
CREATE TRIGGER `sync_student_logs` AFTER INSERT ON `student_logs` FOR EACH ROW INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
VALUES (NEW.actor_id, CONCAT('HOC_VIEN_', NEW.action), NEW.description, NEW.created_at)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `teachers`
--

DROP TABLE IF EXISTS `teachers`;
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Nam','Nu') COLLATE utf8mb4_general_ci DEFAULT 'Nu',
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `university` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `p_c` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Chứng chỉ chuyên môn (Professional Certifications)',
  `experience` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Kinh nghiệm làm việc',
  `specialty` enum('Cử Nhân','Thạc Sĩ','Tiến Sĩ','Khác') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Khác',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` enum('dang_day','tam_nghi','nghi_phep','nghi_viec','thu_viec') COLLATE utf8mb4_general_ci DEFAULT 'thu_viec',
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'default_avatar.png',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `teachers`
--

INSERT INTO `teachers` (`id`, `full_name`, `code_name`, `dob`, `gender`, `phone`, `email`, `university`, `p_c`, `experience`, `specialty`, `note`, `status`, `avatar`) VALUES
(1, 'Lê Dương Bảo Lâm', 'Lâm', '1986-03-13', 'Nam', '0846245235', 'lamduongle@gmail.com', 'Đại học Cần Thơ', 'TEFL 120h\r\nTESOL Advanced\r\nIelts 7.5', '10 năm', 'Thạc Sĩ', NULL, 'dang_day', 'default.png'),
(2, 'Kiều Minh Tuấn', 'K.Tuấn', '1979-02-22', 'Nam', '0846784523', 'minhtuankieu@gmail.com', 'Đại học Huế', 'Iellts 7.0\r\nTOEIC 850\r\nTOEFL iBT 105', '4 năm', 'Cử Nhân', NULL, 'nghi_phep', 'default.png'),
(3, 'Lê Dương Bảo Đảm', 'Đảm', '1989-12-30', 'Nu', '0945647345', 'duongle12@gmail.com', 'Đại học Mở TPHCM', 'TESOL Advanced\r\nCELTA Pass B\r\nIelts 7.5', '2 năm', 'Cử Nhân', NULL, 'dang_day', 'default.png'),
(4, 'Nguyễn Thu Trang', 'Trang', '1992-05-15', 'Nu', '0901234567', 'trang.nguyen@engbreak.edu.vn', 'Đại học Sư Phạm TP.HCM', 'IELTS 7.5', '5 năm', 'Cử Nhân', NULL, 'nghi_phep', 'default.png'),
(5, 'Trần Văn Hùng', 'Hùng', '1988-11-20', 'Nam', '0912345678', 'hung.tran@engbreak.edu.vn', 'Đại học Hà Nội', 'TOEIC 900', '3 năm', 'Cử Nhân', NULL, 'dang_day', 'default.png'),
(6, 'Phạm Minh Tuấn', 'P.Tuấn', '1995-03-10', 'Nam', '0987654321', 'tuan.pham@engbreak.edu.vn', 'Đại học Văn Lang', 'Ielts 7.0', '3 năm', 'Cử Nhân', NULL, 'nghi_viec', 'default.png'),
(7, 'Lê Thị Mai', 'Mai', '1990-08-25', 'Nu', '0933445566', 'mai.le@engbreak.edu.vn', 'Đại học Sư Phạm Hà Nội', 'Ielts 8.0', '7 năm', 'Cử Nhân', NULL, 'tam_nghi', 'default.png'),
(8, 'Hoàng Đức Thắng', 'Thắng', '1985-12-05', 'Nam', '0977889900', 'thang.hoang@engbreak.edu.vn', 'Học viện Ngoại Giao', 'IELTS 8.0', '9 năm', 'Thạc Sĩ', NULL, 'dang_day', 'default.png'),
(9, 'Vũ Thị Lan Anh', 'Anh', '1993-06-18', 'Nu', '0966778899', 'lananh.vu@engbreak.edu.vn', 'Đại học Ngoại Ngữ', 'TESOL\r\nCELTA', '7 năm', 'Thạc Sĩ', NULL, 'dang_day', 'default.png'),
(10, 'Đỗ Quang Minh', 'Minh', '1979-09-30', 'Nam', '0944556677', 'minh.do@engbreak.edu.vn', 'Đại học Quốc Gia Hà Nội', 'Ielts 9.0\r\nTOEFL iBT 110+\r\nDELTA\r\nCELTA\r\nTeacher Trainer Certificate', '20 năm', 'Tiến Sĩ', NULL, 'dang_day', 'default.png'),
(11, 'Bùi Phương Thảo', 'Thảo', '1996-02-14', 'Nu', '0922334455', 'thao.bui@engbreak.edu.vn', 'RMIT University', 'TESOL\r\nIelts 7.5', '2 năm', 'Cử Nhân', NULL, 'thu_viec', 'default.png'),
(12, 'Ngô Văn Nam', 'Nam', '1989-07-22', 'Nam', '0911223344', 'nam.ngo@engbreak.edu.vn', 'Đại học Mở TP.HCM', 'Ielts 7.0\r\nTOEIC 900\r\n', '7 năm', 'Cử Nhân', NULL, 'dang_day', 'default.png'),
(13, 'Đặng Thùy Dương', 'Dương', '1994-10-12', 'Nu', '0955667788', 'duong.dang@engbreak.edu.vn', 'Đại học Ngoại Thương', 'Ielts 7.5\r\nTOEIC 920', '4 năm', 'Cử Nhân', NULL, 'nghi_phep', 'default.png'),
(14, 'Trần Hoài Nam', 'T.Nam', '2000-06-15', 'Nam', '0909123456', 'nam.tran@email.com', 'Đại học Sư Phạm TP.HCM', 'IELTS 7.5\r\nTOEIC 980', '3 năm', 'Cử Nhân', NULL, 'dang_day', 'default_avatar.png'),
(15, 'Lâm Gia Linh', 'Linh', '1985-03-20', 'Nu', '0988637456', 'linhlam@gmail.com', 'Đại học Công Nghệ TP.HCM', 'Ielts 7.0\r\nTOEIC 890', 'Mới ra trường', 'Cử Nhân', NULL, 'thu_viec', 'default_avatar.png'),
(16, 'Bùi Trần Nhật Quang', 'Quang', '1982-04-19', 'Nam', '0987674574', 'quangbuitrannhat@gmail.com', 'Trường Đại học Sư Phạm Kỹ Thuật TP.HCM', 'Ielts 8.0\r\nTOEIC 950\r\nCELTA\r\nDELTA', '10 năm', 'Cử Nhân', NULL, 'thu_viec', 'default_avatar.png');

--
-- Bẫy `teachers`
--
DROP TRIGGER IF EXISTS `generate_teacher_codename`;
DELIMITER $$
CREATE TRIGGER `generate_teacher_codename` BEFORE INSERT ON `teachers` FOR EACH ROW BEGIN
    DECLARE base_name VARCHAR(50);
    DECLARE temp_code VARCHAR(50);
    
    -- 1. Lấy Tên
    SET base_name = SUBSTRING_INDEX(NEW.full_name, ' ', -1);
    SET temp_code = base_name;
    
    -- 2. Check trùng Tên -> Đổi sang Họ.Tên
    IF EXISTS (SELECT 1 FROM teachers WHERE code_name = temp_code) THEN
        SET temp_code = CONCAT(SUBSTR(NEW.full_name, 1, 1), '.', base_name);
    END IF;
    
    -- 3. Check trùng Họ.Tên -> Đổi sang Lót.Tên
    IF EXISTS (SELECT 1 FROM teachers WHERE code_name = temp_code) THEN
        SET temp_code = CONCAT(
            SUBSTR(TRIM(SUBSTR(NEW.full_name, LENGTH(SUBSTRING_INDEX(NEW.full_name, ' ', 1)) + 1)), 1, 1),
            '.',
            base_name
        );
    END IF;

    SET NEW.code_name = temp_code;
END
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `track_teacher_status_change`;
DELIMITER $$
CREATE TRIGGER `track_teacher_status_change` AFTER UPDATE ON `teachers` FOR EACH ROW BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO `teacher_logs` (`record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`)
        VALUES (
            NEW.id, 
            0, 
            'SUA', 
            CONCAT('Trạng thái thay đổi: ', OLD.status, ' -> ', NEW.status), 
            JSON_OBJECT('old_status', OLD.status, 'new_status', NEW.status),
            NOW()
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `teacher_logs`
--

DROP TABLE IF EXISTS `teacher_logs`;
CREATE TABLE IF NOT EXISTS `teacher_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `actor_id` int NOT NULL,
  `action` enum('THEM','SUA','XOA') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `record_id` (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `teacher_logs`
--

INSERT INTO `teacher_logs` (`id`, `record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`) VALUES
(1, 13, 0, 'SUA', 'Trạng thái thay đổi: dang_day -> tam_nghi', '{\"new_status\": \"tam_nghi\", \"old_status\": \"dang_day\"}', '2025-11-29 10:38:32'),
(2, 11, 0, 'SUA', 'Trạng thái thay đổi: dang_day -> nghi_phep', '{\"new_status\": \"nghi_phep\", \"old_status\": \"dang_day\"}', '2025-11-29 10:38:47'),
(3, 11, 0, 'SUA', 'Trạng thái thay đổi: nghi_phep -> thu_viec', '{\"new_status\": \"thu_viec\", \"old_status\": \"nghi_phep\"}', '2025-11-29 10:38:57'),
(4, 6, 0, 'SUA', 'Trạng thái thay đổi: dang_day -> nghi_viec', '{\"new_status\": \"nghi_viec\", \"old_status\": \"dang_day\"}', '2025-11-29 10:39:08'),
(5, 2, 0, 'SUA', 'Trạng thái thay đổi: dang_day -> nghi_phep', '{\"new_status\": \"nghi_phep\", \"old_status\": \"dang_day\"}', '2025-11-29 10:39:27'),
(6, 4, 0, 'SUA', 'Trạng thái thay đổi: dang_day -> nghi_phep', '{\"new_status\": \"nghi_phep\", \"old_status\": \"dang_day\"}', '2025-11-29 10:40:01'),
(7, 7, 0, 'SUA', 'Trạng thái thay đổi: dang_day -> tam_nghi', '{\"new_status\": \"tam_nghi\", \"old_status\": \"dang_day\"}', '2025-11-29 10:40:19'),
(8, 14, 0, 'SUA', 'Trạng thái thay đổi: thu_viec -> dang_day', '{\"new_status\": \"dang_day\", \"old_status\": \"thu_viec\"}', '2025-11-30 06:49:36'),
(9, 14, 3, 'SUA', 'Cập nhật hồ sơ giảng viên: Trần Hoài Nam', '{\"id\": 14, \"dob\": \"2000-06-15\", \"p_c\": \"IELTS 7.5, TOEIC 980\", \"note\": null, \"email\": \"nam.tran@email.com\", \"phone\": \"0909123456\", \"avatar\": \"default_avatar.png\", \"gender\": \"Nam\", \"status\": \"thu_viec\", \"code_name\": \"T.Nam\", \"full_name\": \"Trần Hoài Nam\", \"specialty\": \"Cử Nhân\", \"experience\": \"3 năm\", \"university\": \"Đại học Sư Phạm TP.HCM\"}', '2025-11-30 06:49:36'),
(10, 15, 3, 'THEM', 'Thêm hồ sơ giảng viên: Lâm Gia Linh', NULL, '2025-11-30 06:53:45'),
(11, 15, 3, 'SUA', 'Cập nhật hồ sơ giảng viên: Lâm Gia Linh', '{\"id\": 15, \"dob\": \"1985-03-20\", \"p_c\": \"Ielts 7.0, TOEIC 890\", \"note\": null, \"email\": \"linhlam@gmail.com\", \"phone\": \"0988637456\", \"avatar\": \"default_avatar.png\", \"gender\": \"Nu\", \"status\": \"thu_viec\", \"code_name\": \"Linh\", \"full_name\": \"Lâm Gia Linh\", \"specialty\": \"Cử Nhân\", \"experience\": \"Mới ra trường\", \"university\": \"Đại học Công Nghệ TP.HCM\"}', '2025-11-30 06:54:23'),
(12, 9, 3, 'SUA', 'Cập nhật hồ sơ giảng viên: Vũ Thị Lan Anh', '{\"id\": 9, \"dob\": \"1993-06-18\", \"p_c\": \"TESOL, CELTA\", \"note\": null, \"email\": \"lananh.vu@engbreak.edu.vn\", \"phone\": \"0966778899\", \"avatar\": \"default.png\", \"gender\": \"Nu\", \"status\": \"dang_day\", \"code_name\": \"Anh\", \"full_name\": \"Vũ Thị Lan Anh\", \"specialty\": \"Thạc Sĩ\", \"experience\": \"7 năm\", \"university\": \"Đại học Ngoại Ngữ\"}', '2025-11-30 06:54:43'),
(13, 14, 3, 'SUA', 'Cập nhật hồ sơ giảng viên: Trần Hoài Nam', '{\"id\": 14, \"dob\": \"2000-06-15\", \"p_c\": \"IELTS 7.5, TOEIC 980\", \"note\": null, \"email\": \"nam.tran@email.com\", \"phone\": \"0909123456\", \"avatar\": \"default_avatar.png\", \"gender\": \"Nam\", \"status\": \"dang_day\", \"code_name\": \"T.Nam\", \"full_name\": \"Trần Hoài Nam\", \"specialty\": \"Cử Nhân\", \"experience\": \"3 năm\", \"university\": \"Đại học Sư Phạm TP.HCM\"}', '2025-11-30 06:55:03'),
(14, 13, 0, 'SUA', 'Trạng thái thay đổi: tam_nghi -> nghi_phep', '{\"new_status\": \"nghi_phep\", \"old_status\": \"tam_nghi\"}', '2025-11-30 11:05:58'),
(15, 13, 2, 'SUA', 'Cập nhật hồ sơ giảng viên: Đặng Thùy Dương', '{\"id\": 13, \"dob\": \"1994-10-12\", \"p_c\": \"Ielts 7.5\\r\\nTOEIC 920\\r\\n\", \"note\": null, \"email\": \"duong.dang@engbreak.edu.vn\", \"phone\": \"0955667788\", \"avatar\": \"default.png\", \"gender\": \"Nu\", \"status\": \"tam_nghi\", \"code_name\": \"Dương\", \"full_name\": \"Đặng Thùy Dương\", \"specialty\": \"Cử Nhân\", \"experience\": \"4 năm\", \"university\": \"Đại học Ngoại Thương\"}', '2025-11-30 11:05:58'),
(16, 13, 2, 'SUA', 'Cập nhật hồ sơ giảng viên: Đặng Thùy Dương', '{\"id\": 13, \"dob\": \"1994-10-12\", \"p_c\": \"Ielts 7.5\\r\\nTOEIC 920\", \"note\": null, \"email\": \"duong.dang@engbreak.edu.vn\", \"phone\": \"0955667788\", \"avatar\": \"default.png\", \"gender\": \"Nu\", \"status\": \"nghi_phep\", \"code_name\": \"Dương\", \"full_name\": \"Đặng Thùy Dương\", \"specialty\": \"Cử Nhân\", \"experience\": \"4 năm\", \"university\": \"Đại học Ngoại Thương\"}', '2025-11-30 11:08:14'),
(17, 16, 2, 'THEM', 'Thêm hồ sơ giảng viên: Bùi Trần Nhật Quang', NULL, '2025-11-30 20:09:21');

--
-- Bẫy `teacher_logs`
--
DROP TRIGGER IF EXISTS `sync_teacher_logs`;
DELIMITER $$
CREATE TRIGGER `sync_teacher_logs` AFTER INSERT ON `teacher_logs` FOR EACH ROW INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
VALUES (NEW.actor_id, CONCAT('GIANG_VIEN_', NEW.action), NEW.description, NEW.created_at)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuition_logs`
--

DROP TABLE IF EXISTS `tuition_logs`;
CREATE TABLE IF NOT EXISTS `tuition_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `record_id` int NOT NULL,
  `actor_id` int NOT NULL,
  `action` enum('THEM','SUA','XOA') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tuition_logs`
--

INSERT INTO `tuition_logs` (`id`, `record_id`, `actor_id`, `action`, `description`, `old_data`, `created_at`) VALUES
(1, 1, 2, '', 'Thu 1800000 VNĐ của Nguyễn Văn An (8 tuần)', NULL, '2025-12-02 23:39:52'),
(2, 1, 2, '', 'Thu 1800000 VNĐ của Nguyễn Văn An (8 tuần)', NULL, '2025-12-02 23:40:42'),
(3, 31, 2, '', 'Thu 9405000 VNĐ của Tạ Minh Hậu (16 tuần)', NULL, '2025-12-02 23:40:55'),
(4, 2, 2, '', 'Thu 3600000 VNĐ của Trần Thị Bích (8 tuần)', NULL, '2025-12-02 23:41:02'),
(5, 3, 2, '', 'Thu 3600000 VNĐ của Lê Hoàng Nam (8 tuần)', NULL, '2025-12-02 23:41:05'),
(6, 4, 2, '', 'Thu 1800000 VNĐ của Phạm Minh Khôi (8 tuần)', NULL, '2025-12-02 23:41:08'),
(7, 5, 2, '', 'Thu 2700000 VNĐ của Nguyễn Thị Mai (8 tuần)', NULL, '2025-12-02 23:41:11'),
(8, 6, 2, '', 'Thu 0 VNĐ của Hoàng Văn Long (8 tuần)', NULL, '2025-12-02 23:41:14'),
(9, 6, 2, '', 'Thu 0 VNĐ của Hoàng Văn Long (8 tuần)', NULL, '2025-12-02 23:41:41'),
(10, 11, 2, '', 'Thu 2800000 VNĐ của Nguyễn Bảo Ngọc (8 tuần)', NULL, '2025-12-02 23:41:50'),
(11, 7, 2, '', 'Thu 3600000 VNĐ của Đoàn Thu Hà (8 tuần)', NULL, '2025-12-02 23:41:54'),
(12, 8, 2, '', 'Thu 3420000 VNĐ của Vũ Đức Thắng (16 tuần)', NULL, '2025-12-02 23:41:57'),
(13, 9, 2, '', 'Thu 6840000 VNĐ của Ngô Bảo Châu (16 tuần)', NULL, '2025-12-02 23:42:00'),
(14, 10, 2, '', 'Thu 5130000 VNĐ của Lý Hải Đăng (16 tuần)', NULL, '2025-12-02 23:42:04'),
(15, 12, 2, '', 'Thu 2800000 VNĐ của Trần Minh Khôi (8 tuần)', NULL, '2025-12-02 23:42:07'),
(16, 13, 2, '', 'Thu 4000000 VNĐ của Lê Gia Hân (8 tuần)', NULL, '2025-12-02 23:42:10'),
(17, 14, 2, '', 'Thu 2090000 VNĐ của Phạm Đức Anh (8 tuần)', NULL, '2025-12-02 23:42:12'),
(18, 15, 2, '', 'Thu 2800000 VNĐ của Hoàng Yến Nhi (8 tuần)', NULL, '2025-12-02 23:42:16'),
(19, 16, 2, '', 'Thu 4000000 VNĐ của Vũ Tuấn Kiệt (8 tuần)', NULL, '2025-12-02 23:42:19'),
(20, 17, 2, '', 'Thu 2800000 VNĐ của Đặng Minh Châu (8 tuần)', NULL, '2025-12-02 23:42:21'),
(21, 18, 2, '', 'Thu 2200000 VNĐ của Bùi Tiến Dũng (8 tuần)', NULL, '2025-12-02 23:42:24'),
(22, 19, 2, '', 'Thu 2660000 VNĐ của Ngô Phương Linh (8 tuần)', NULL, '2025-12-02 23:42:26'),
(23, 20, 2, '', 'Thu 2660000 VNĐ của Dương Văn Hậu (8 tuần)', NULL, '2025-12-02 23:42:30'),
(24, 21, 2, '', 'Thu 2660000 VNĐ của Hồ Thị Thu (8 tuần)', NULL, '2025-12-02 23:42:32'),
(25, 22, 2, '', 'Thu 2850000 VNĐ của Lý Văn Cường (8 tuần)', NULL, '2025-12-02 23:42:35'),
(26, 23, 2, '', 'Thu 1900000 VNĐ của Mai Thị Tuyết (8 tuần)', NULL, '2025-12-02 23:42:37'),
(27, 24, 2, '', 'Thu 3600000 VNĐ của Trương Tấn Sang (8 tuần)', NULL, '2025-12-02 23:42:41'),
(28, 25, 2, '', 'Thu 1980000 VNĐ của Võ Thị Bích (8 tuần)', NULL, '2025-12-02 23:42:44'),
(29, 26, 2, '', 'Thu 2520000 VNĐ của Đinh Văn Lâm (8 tuần)', NULL, '2025-12-02 23:42:47'),
(30, 27, 2, '', 'Thu 2850000 VNĐ của Lương Thùy Linh (8 tuần)', NULL, '2025-12-02 23:42:50'),
(31, 28, 2, '', 'Thu 2660000 VNĐ của Quách Ngọc Ngoan (8 tuần)', NULL, '2025-12-02 23:42:55'),
(32, 29, 2, '', 'Thu 1800000 VNĐ của Tạ Bích Loan (8 tuần)', NULL, '2025-12-02 23:42:58'),
(33, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-02 23:43:01'),
(34, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-02 23:46:42'),
(35, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-02 23:56:16'),
(36, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-03 00:01:10'),
(37, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-03 00:05:33'),
(38, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-03 00:06:01'),
(39, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-03 00:06:14'),
(40, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-03 00:06:36'),
(41, 30, 2, '', 'Thu 4000000 VNĐ của Phan Anh Tuấn (8 tuần)', NULL, '2025-12-03 00:06:59'),
(42, 30, 2, '', 'Thu 4000000 đ của Phan Anh Tuấn (8 tuần) qua Tiền mặt', NULL, '2025-12-03 00:10:51'),
(43, 30, 2, '', 'Thu 4000000 đ của Phan Anh Tuấn (8 tuần) qua Tiền mặt', NULL, '2025-12-03 00:12:09'),
(44, 2, 2, '', 'Thu 3600000 đ của Trần Thị Bích (8 tuần) qua Chuyển khoản QR', NULL, '2025-12-03 00:12:30'),
(45, 3, 2, '', 'Thu 3600000 đ của Lê Hoàng Nam (8 tuần) qua Tiền mặt', NULL, '2025-12-03 00:24:26'),
(46, 3, 2, '', 'Thu 3600000 đ của Lê Hoàng Nam (8 tuần) qua Tiền mặt', NULL, '2025-12-03 00:25:23'),
(47, 11, 2, '', 'Thu 2800000 đ của Nguyễn Bảo Ngọc (8 tuần) qua Chuyển khoản QR', NULL, '2025-12-03 00:25:46'),
(48, 5, 2, '', 'Thu phí Nguyễn Thị Mai (8 tuần): 2700000 đ', NULL, '2025-12-03 23:05:19'),
(49, 5, 2, '', 'Thu phí Nguyễn Thị Mai (8 tuần): 2700000 đ', NULL, '2025-12-03 23:07:10'),
(50, 4, 2, '', 'Thu phí Phạm Minh Khôi (8 tuần): 1800000 đ', NULL, '2025-12-03 23:07:30'),
(51, 7, 2, '', 'Thu phí Đoàn Thu Hà (8 tuần): 3600000 đ', NULL, '2025-12-03 23:07:56'),
(52, 28, 2, '', 'Thu phí Quách Ngọc Ngoan (8 tuần): 2660000 đ', NULL, '2025-12-03 23:09:00'),
(53, 12, 2, '', 'Thu phí Trần Minh Khôi (8 tuần): 2800000 đ', NULL, '2025-12-06 02:50:14'),
(54, 13, 2, '', 'Thu phí Lê Gia Hân (16 tuần): 7600000 đ', NULL, '2025-12-06 14:05:51'),
(55, 14, 2, '', 'Thu phí Phạm Đức Anh (8 tuần): 2090000 đ', NULL, '2025-12-06 15:48:01'),
(56, 25, 2, '', 'Thu phí Võ Thị Bích (8 tuần): 1980000 đ', NULL, '2025-12-06 15:50:06');

--
-- Bẫy `tuition_logs`
--
DROP TRIGGER IF EXISTS `sync_tuition_logs`;
DELIMITER $$
CREATE TRIGGER `sync_tuition_logs` AFTER INSERT ON `tuition_logs` FOR EACH ROW INSERT INTO `activity_logs` (`user_id`, `action_type`, `description`, `created_at`)
VALUES (NEW.actor_id, CONCAT('HOC_PHI_', NEW.action), NEW.description, NEW.created_at)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuition_packages`
--

DROP TABLE IF EXISTS `tuition_packages`;
CREATE TABLE IF NOT EXISTS `tuition_packages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level_id` int NOT NULL,
  `week_duration` int NOT NULL,
  `tuition_fee` decimal(12,2) NOT NULL,
  `sessions_per_week` int DEFAULT '3',
  `price_per_session` decimal(12,2) GENERATED ALWAYS AS ((`tuition_fee` / (`week_duration` * `sessions_per_week`))) STORED,
  PRIMARY KEY (`id`),
  KEY `level_id` (`level_id`)
) ENGINE=MyISAM AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tuition_packages`
--

INSERT INTO `tuition_packages` (`id`, `level_id`, `week_duration`, `tuition_fee`, `sessions_per_week`) VALUES
(1, 5, 8, 2000000.00, 3),
(2, 5, 16, 3800000.00, 3),
(3, 5, 32, 7200000.00, 3),
(4, 5, 48, 10200000.00, 3),
(5, 6, 8, 2200000.00, 3),
(6, 6, 16, 4180000.00, 3),
(7, 6, 32, 7920000.00, 3),
(8, 6, 48, 11220000.00, 3),
(9, 7, 8, 2400000.00, 3),
(10, 7, 16, 4560000.00, 3),
(11, 7, 32, 8640000.00, 3),
(12, 7, 48, 12240000.00, 3),
(13, 8, 8, 2600000.00, 3),
(14, 8, 16, 4940000.00, 3),
(15, 8, 32, 9360000.00, 3),
(16, 8, 48, 13260000.00, 3),
(17, 4, 8, 2800000.00, 3),
(18, 4, 16, 5320000.00, 3),
(19, 4, 32, 10080000.00, 3),
(20, 4, 48, 14280000.00, 3),
(21, 9, 8, 3000000.00, 3),
(22, 9, 16, 5700000.00, 3),
(23, 9, 32, 10800000.00, 3),
(24, 9, 48, 15300000.00, 3),
(25, 10, 8, 2500000.00, 3),
(26, 10, 16, 4750000.00, 3),
(27, 10, 32, 9000000.00, 3),
(28, 10, 48, 12750000.00, 3),
(29, 11, 8, 2800000.00, 3),
(30, 11, 16, 5320000.00, 3),
(31, 11, 32, 10080000.00, 3),
(32, 11, 48, 14280000.00, 3),
(33, 12, 8, 3200000.00, 3),
(34, 12, 16, 6080000.00, 3),
(35, 12, 32, 11520000.00, 3),
(36, 12, 48, 16320000.00, 3),
(37, 19, 8, 2800000.00, 3),
(38, 19, 16, 5320000.00, 3),
(39, 19, 32, 10080000.00, 3),
(40, 19, 48, 14280000.00, 3),
(41, 20, 8, 3000000.00, 3),
(42, 20, 16, 5700000.00, 3),
(43, 20, 32, 10800000.00, 3),
(44, 20, 48, 15300000.00, 3),
(45, 21, 8, 3500000.00, 3),
(46, 21, 16, 6650000.00, 3),
(47, 21, 32, 12600000.00, 3),
(48, 21, 48, 17850000.00, 3),
(49, 13, 8, 3500000.00, 3),
(50, 13, 16, 6650000.00, 3),
(51, 13, 32, 12600000.00, 3),
(52, 13, 48, 17850000.00, 3),
(53, 14, 8, 4000000.00, 3),
(54, 14, 16, 7600000.00, 3),
(55, 14, 32, 14400000.00, 3),
(56, 14, 48, 20400000.00, 3),
(57, 15, 8, 4500000.00, 3),
(58, 15, 16, 8550000.00, 3),
(59, 15, 32, 16200000.00, 3),
(60, 15, 48, 22950000.00, 3),
(61, 16, 8, 5000000.00, 3),
(62, 16, 16, 9500000.00, 3),
(63, 16, 32, 18000000.00, 3),
(64, 16, 48, 25500000.00, 3),
(65, 17, 8, 5500000.00, 3),
(66, 17, 16, 10450000.00, 3),
(67, 17, 32, 19800000.00, 3),
(68, 17, 48, 28050000.00, 3),
(69, 18, 8, 6000000.00, 3),
(70, 18, 16, 11400000.00, 3),
(71, 18, 32, 21600000.00, 3),
(72, 18, 48, 30600000.00, 3),
(73, 5, 8, 2000000.00, 2),
(74, 5, 16, 3800000.00, 2),
(75, 5, 32, 7200000.00, 2),
(76, 5, 48, 10200000.00, 2),
(77, 6, 8, 2200000.00, 2),
(78, 6, 16, 4180000.00, 2),
(79, 6, 32, 7920000.00, 2),
(80, 6, 48, 11220000.00, 2),
(81, 7, 8, 2400000.00, 2),
(82, 7, 16, 4560000.00, 2),
(83, 7, 32, 8640000.00, 2),
(84, 7, 48, 12240000.00, 2),
(85, 8, 8, 2600000.00, 2),
(86, 8, 16, 4940000.00, 2),
(87, 8, 32, 9360000.00, 2),
(88, 8, 48, 13260000.00, 2),
(89, 4, 8, 2800000.00, 2),
(90, 4, 16, 5320000.00, 2),
(91, 4, 32, 10080000.00, 2),
(92, 4, 48, 14280000.00, 2),
(93, 9, 8, 3000000.00, 2),
(94, 9, 16, 5700000.00, 2),
(95, 9, 32, 10800000.00, 2),
(96, 9, 48, 15300000.00, 2),
(97, 10, 8, 2500000.00, 2),
(98, 10, 16, 4750000.00, 2),
(99, 10, 32, 9000000.00, 2),
(100, 10, 48, 12750000.00, 2),
(101, 11, 8, 2800000.00, 2),
(102, 11, 16, 5320000.00, 2),
(103, 11, 32, 10080000.00, 2),
(104, 11, 48, 14280000.00, 2),
(105, 12, 8, 3200000.00, 2),
(106, 12, 16, 6080000.00, 2),
(107, 12, 32, 11520000.00, 2),
(108, 12, 48, 16320000.00, 2),
(109, 19, 8, 2800000.00, 2),
(110, 19, 16, 5320000.00, 2),
(111, 19, 32, 10080000.00, 2),
(112, 19, 48, 14280000.00, 2),
(113, 20, 8, 3000000.00, 2),
(114, 20, 16, 5700000.00, 2),
(115, 20, 32, 10800000.00, 2),
(116, 20, 48, 15300000.00, 2),
(117, 21, 8, 3500000.00, 2),
(118, 21, 16, 6650000.00, 2),
(119, 21, 32, 12600000.00, 2),
(120, 21, 48, 17850000.00, 2),
(121, 13, 8, 3500000.00, 2),
(122, 13, 16, 6650000.00, 2),
(123, 13, 32, 12600000.00, 2),
(124, 13, 48, 17850000.00, 2),
(125, 14, 8, 4000000.00, 2),
(126, 14, 16, 7600000.00, 2),
(127, 14, 32, 14400000.00, 2),
(128, 14, 48, 20400000.00, 2),
(129, 15, 8, 4500000.00, 2),
(130, 15, 16, 8550000.00, 2),
(131, 15, 32, 16200000.00, 2),
(132, 15, 48, 22950000.00, 2),
(133, 16, 8, 5000000.00, 2),
(134, 16, 16, 9500000.00, 2),
(135, 16, 32, 18000000.00, 2),
(136, 16, 48, 25500000.00, 2),
(137, 17, 8, 5500000.00, 2),
(138, 17, 16, 10450000.00, 2),
(139, 17, 32, 19800000.00, 2),
(140, 17, 48, 28050000.00, 2),
(141, 18, 8, 6000000.00, 2),
(142, 18, 16, 11400000.00, 2),
(143, 18, 32, 21600000.00, 2),
(144, 18, 48, 30600000.00, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','staff') COLLATE utf8mb4_general_ci DEFAULT 'staff',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`, `created_at`) VALUES
(2, 'Admin', '$2y$10$GHyPCFqq.h38CH6KYihiBOsaz0y4VqGZbY.tnba3eBHecQUWjXQyO', 'Huỳnh Bảo Minh Phát', 'admin', '2025-11-23 11:17:52'),
(3, 'chidung', '$2y$10$WwArNzxloUmO.yOE1ygy8uJ7ekeGwHZOd9V1PApCvF11zdosg6Tt2', 'Huỳnh Lâm Chí Dũng', 'staff', '2025-11-23 11:33:04'),
(4, 'hongmy', '$2y$10$e.eLBolMowHGk8eI2FHlKOdGYrpZ9tEvIenl5crBlpra235hDh1b2', 'Hồng My', 'staff', '2025-11-26 11:35:48'),
(5, 'chankiet', '$2y$10$3Uh3B3rZW3iD2QdFtpv5MueJKDiK4j2a0.h64rZH8acmftAy8/xBq', 'Chấn Kiệt', 'staff', '2025-11-27 18:15:14'),
(6, 'tuanhuy', '$2y$10$9cOe44nPDNb3HFZjPFrz/u7egczf4QCkKEUBwgoJOJOpHO4U6JXne', 'Nguyễn Tuấn Huy', 'staff', '2025-12-03 14:21:27');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

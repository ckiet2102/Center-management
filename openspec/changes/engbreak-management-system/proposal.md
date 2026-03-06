## Why

Hệ thống Quản lý Trung tâm Ngoại ngữ EngBreak hiện tại được xây dựng trên PHP thuần với MySQL. Cần chuyển đổi hoàn toàn sang kiến trúc Modern Fullstack (Node.js + React.js) để tăng khả năng bảo trì, mở rộng, và tạo giao diện người dùng hiện đại, responsive. Dữ liệu gốc từ file `engbreak_db.sql` sẽ được giữ nguyên cấu trúc và migrate sang hệ thống mới.

## What Changes

- **Xây dựng Backend mới** bằng Node.js (Express) + Sequelize ORM thay thế PHP thuần. Bao gồm toàn bộ RESTful API cho xác thực, quản lý học viên, giảng viên, lớp học, phòng học, ca học, cấp độ, học phí, ưu đãi, và ghi nhật ký hoạt động.
- **Xây dựng Frontend mới** bằng React.js (Vite) + Tailwind CSS. Giao diện dashboard chuyên nghiệp với sidebar điều hướng, topbar hiển thị user, trang đăng nhập, quản lý học viên (CRUD, tìm kiếm, modal), quản lý lớp học, quản lý giảng viên, và quản lý học phí.
- **Chuyển đổi hệ thống xác thực** từ PHP session sang JWT (JSON Web Token) với bcrypt hash password, phân quyền RBAC (admin/staff).
- **Triển khai Stored Procedure logic** qua API endpoint để tự động cập nhật ưu đãi cho học viên dựa trên thâm niên (gọi `UpdateStudentPromotionsBasedOnSeniority`).
- **Tạo file cấu hình** `db_config.js` cho kết nối MySQL và README.md hướng dẫn migrate dữ liệu từ file .sql.

## Capabilities

### New Capabilities
- `auth-system`: Xác thực JWT (login, logout, bảo vệ route), hash mật khẩu bcrypt, phân quyền RBAC admin/staff.
- `student-management`: CRUD học viên, tìm kiếm theo tên/mã, hiển thị join_date và promotion, modal thêm/sửa, gọi stored procedure cập nhật ưu đãi thâm niên.
- `teacher-management`: CRUD giảng viên, hiển thị trạng thái (đang dạy, tạm nghỉ, nghỉ phép, nghỉ việc, thử việc), quản lý hồ sơ chuyên môn.
- `class-management`: CRUD lớp học, hiển thị trạng thái lớp (đang mở, kết thúc), gắn giảng viên/phòng/ca, theo dõi sĩ số.
- `tuition-management`: Quản lý gói học phí theo cấp độ, thu phí, áp dụng ưu đãi, phương thức thanh toán (tiền mặt, chuyển khoản, VietQR).
- `dashboard-layout`: Layout dashboard với sidebar cố định (điều hướng theo quyền), topbar hiển thị tên user hiện hành, responsive design.
- `room-shift-level`: Quản lý phòng học (trạng thái sẵn sàng/bảo trì), ca học, cấp độ khóa học.
- `promotion-system`: Quản lý ưu đãi (thâm niên 1 năm, 2 năm, gia đình, học bổng), tự động áp dụng ưu đãi qua stored procedure.
- `activity-logging`: Ghi nhật ký hoạt động hệ thống (login, CRUD operations) với trigger logic chuyển sang application-level.
- `database-setup`: Cấu hình kết nối MySQL (db_config.js), Sequelize models, migration guide, README.md.

### Modified Capabilities
<!-- No existing capabilities to modify - this is a greenfield rebuild -->

## Impact

- **Codebase**: Toàn bộ codebase mới - Backend (server/) với Express + Sequelize, Frontend (client/) với React + Vite + Tailwind CSS.
- **Database**: Giữ nguyên MySQL schema từ engbreak_db.sql. Sequelize models ánh xạ đúng 17 bảng: users, students, teachers, classes, enrollments, payments, promotions, rooms, shifts, levels, tuition_packages, activity_logs, auth_logs, student_logs, teacher_logs, class_logs, room_logs, và các bảng khác.
- **APIs**: RESTful endpoints mới: `/api/auth/*`, `/api/students/*`, `/api/teachers/*`, `/api/classes/*`, `/api/payments/*`, `/api/promotions/*`, `/api/rooms/*`, `/api/levels/*`, `/api/dashboard/*`.
- **Xác thực**: Chuyển từ PHP session/cookie → JWT token (LocalStorage/Cookie). Password re-hash từ `$2y$` (PHP bcrypt) → `$2b$` (Node bcrypt).
- **Dependencies**: express, sequelize, mysql2, jsonwebtoken, bcryptjs, cors, dotenv (backend); react, react-router-dom, axios, tailwindcss (frontend).

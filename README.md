# EngBreak - Hệ thống Quản lý Trung tâm Ngoại ngữ

Hệ thống quản lý toàn diện cho Trung tâm Ngoại ngữ EngBreak, được xây dựng bằng **Modern Fullstack Architecture**.

## 🚀 Tech Stack

| Layer      | Công nghệ                                      |
|------------|------------------------------------------------|
| **Backend**  | Node.js, Express.js, Sequelize ORM, MySQL, JWT, bcryptjs |
| **Frontend** | React.js (Vite), Tailwind CSS, React Router, Axios |

## 📁 Cấu trúc dự án

```
QLTTNN-react-node/
├── server/                     # Backend Node.js
│   ├── config/db_config.js     # Cấu hình kết nối MySQL
│   ├── controllers/            # Business logic
│   ├── middleware/auth.js      # JWT & RBAC middleware
│   ├── models/                 # Sequelize models (17 bảng)
│   ├── routes/                 # Express route handlers
│   ├── server.js               # Entry point
│   ├── .env                    # Biến môi trường
│   └── package.json
├── client/                     # Frontend React
│   ├── src/
│   │   ├── components/         # UI components (Sidebar, Topbar, Modal)
│   │   ├── context/            # AuthContext (state management)
│   │   ├── pages/              # Page components
│   │   ├── services/api.js     # Axios instance
│   │   └── App.jsx             # Root component + Router
│   └── package.json
├── engbreak_db.sql             # File database gốc
├── instructions.sql            # Hướng dẫn import database
└── README.md
```

## ⚡ Yêu cầu hệ thống

- **Node.js** >= 18.x
- **MySQL** >= 8.0 (hoặc XAMPP/WAMP/Laragon)
- **npm** >= 9.x

## 🔧 Cài đặt & Chạy dự án

### Bước 1: Import Database MySQL

```bash
# Tạo database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS engbreak_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Import dữ liệu từ file SQL
mysql -u root -p engbreak_db < engbreak_db.sql
```

> 💡 Hoặc dùng **phpMyAdmin**: Tạo database `engbreak_db` → Tab Import → Chọn file `engbreak_db.sql` → Execute

### Bước 2: Cấu hình Backend

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Cấu hình biến môi trường (sửa .env nếu cần)
# Mặc định đã có file .env với:
#   DB_HOST=localhost
#   DB_PORT=3306
#   DB_USER=root
#   DB_PASSWORD=
#   DB_NAME=engbreak_db
#   JWT_SECRET=engbreak-secret-key-2024
#   PORT=5000
```

### Bước 3: Cấu hình Frontend

```bash
# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install
```

### Bước 4: Chạy dự án

```bash
# Terminal 1 - Chạy Backend (port 5000)
cd server
npm run dev

# Terminal 2 - Chạy Frontend (port 3000)
cd client
npm run dev
```

Truy cập: **http://localhost:3000**

## 🔑 Tài khoản đăng nhập

| Vai trò   | Username   | Mật khẩu    |
|-----------|------------|-------------|
| **Admin** | `Admin`    | `123456`    |
| Staff     | `chidung`  | *(xem DB)*  |
| Staff     | `chankiet` | *(xem DB)*  |

> ⚠️ Password trong DB đã hash bằng PHP bcrypt (`$2y$`). Backend Node.js tự động xử lý tương thích.

## 📋 API Endpoints

### Authentication
| Method | Endpoint           | Mô tả               | Auth |
|--------|-------------------|----------------------|------|
| POST   | `/api/auth/login`  | Đăng nhập            | ❌   |
| GET    | `/api/auth/me`     | Lấy thông tin user   | ✅   |

### Students (Học viên)
| Method | Endpoint              | Mô tả                      | Auth   |
|--------|-----------------------|-----------------------------|--------|
| GET    | `/api/students`       | Danh sách HV (?search=)     | ✅     |
| GET    | `/api/students/:id`   | Chi tiết HV                 | ✅     |
| POST   | `/api/students`       | Thêm HV mới                | ✅     |
| PUT    | `/api/students/:id`   | Cập nhật HV                 | ✅     |
| DELETE | `/api/students/:id`   | Xóa HV                     | 🔒 Admin |

### Teachers (Giảng viên)
| Method | Endpoint              | Mô tả              | Auth |
|--------|-----------------------|---------------------|------|
| GET    | `/api/teachers`       | Danh sách GV        | ✅   |
| POST   | `/api/teachers`       | Thêm GV             | ✅   |
| PUT    | `/api/teachers/:id`   | Cập nhật GV         | ✅   |

### Classes (Lớp học)
| Method | Endpoint              | Mô tả              | Auth |
|--------|-----------------------|---------------------|------|
| GET    | `/api/classes`        | Danh sách lớp       | ✅   |
| POST   | `/api/classes`        | Tạo lớp mới         | ✅   |
| PUT    | `/api/classes/:id`    | Cập nhật lớp        | ✅   |

### Payments (Học phí)
| Method | Endpoint              | Mô tả              | Auth |
|--------|-----------------------|---------------------|------|
| GET    | `/api/payments`       | Lịch sử thanh toán  | ✅   |
| POST   | `/api/payments`       | Tạo phiếu thu       | ✅   |

### Promotions (Ưu đãi)
| Method | Endpoint                           | Mô tả                          | Auth     |
|--------|------------------------------------|---------------------------------|----------|
| GET    | `/api/promotions`                  | Danh sách ưu đãi               | ✅       |
| POST   | `/api/promotions/update-seniority` | Cập nhật ưu đãi thâm niên (SP) | 🔒 Admin |

### Others
| Method | Endpoint                | Mô tả              | Auth |
|--------|------------------------|---------------------|------|
| GET    | `/api/rooms`            | Danh sách phòng     | ✅   |
| PUT    | `/api/rooms/:id`        | Cập nhật phòng      | ✅   |
| GET    | `/api/shifts`           | Danh sách ca học     | ✅   |
| GET    | `/api/levels`           | Cấp độ khóa học     | ✅   |
| GET    | `/api/tuition-packages` | Gói học phí          | ✅   |
| GET    | `/api/activity-logs`    | Nhật ký hoạt động   | ✅   |
| GET    | `/api/dashboard/stats`  | Thống kê tổng quan  | ✅   |

## 🎨 Tính năng giao diện

- ✅ **Dashboard** với thống kê tổng quan (học viên, lớp, giảng viên, doanh thu)
- ✅ **Quản lý Học viên** - Bảng dữ liệu, tìm kiếm, thêm/sửa bằng Modal
- ✅ **Quản lý Giảng viên** - Card layout với trạng thái color-coded
- ✅ **Quản lý Lớp học** - Hiển thị thông tin giảng viên, phòng, ca, sĩ số
- ✅ **Quản lý Phòng học** - Grid layout với trạng thái phòng
- ✅ **Quản lý Học phí** - Lịch sử thanh toán với phương thức
- ✅ **Ưu đãi** - Cập nhật tự động ưu đãi thâm niên (Stored Procedure)
- ✅ **Nhật ký hoạt động** - Phân trang, color-coded badges
- ✅ **Dark theme** chuyên nghiệp với Tailwind CSS
- ✅ **Responsive** - Sidebar collapse trên mobile
- ✅ **Phân quyền** - Admin/Staff navigation

## 📦 Database Schema (17+ bảng)

`users` • `students` • `teachers` • `classes` • `enrollments` • `payments` • `promotions` • `rooms` • `shifts` • `levels` • `tuition_packages` • `activity_logs` • `auth_logs` • `student_logs` • `teacher_logs` • `class_logs` • `room_logs` • `tuition_logs` • `backup_logs` • `email_logs` • `email_templates` • `registration_keys` • `chat_messages` • `attendance`

---

**© 2025 EngBreak — Trung tâm Ngoại ngữ** | Built with ❤️ using React + Node.js

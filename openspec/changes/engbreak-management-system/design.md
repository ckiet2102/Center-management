## Context

Trung tâm Ngoại ngữ EngBreak hiện có hệ thống quản lý xây dựng trên PHP thuần + MySQL với database `engbreak_db` gồm 17+ bảng (users, students, teachers, classes, enrollments, payments, promotions, rooms, shifts, levels, tuition_packages, và nhiều bảng log). Hệ thống cần được xây dựng lại hoàn toàn sang kiến trúc Modern Fullstack sử dụng Node.js + React.js, giữ nguyên cấu trúc database MySQL gốc.

**Constraints:**
- Database MySQL hiện có với dữ liệu thật (~30 học viên, 16 giảng viên, 12 lớp, 16 phòng)
- Password trong DB dùng PHP bcrypt format (`$2y$`) cần tương thích với Node.js bcrypt (`$2b$`)
- Stored Procedure `UpdateStudentPromotionsBasedOnSeniority` cần được gọi qua API
- Trigger logic trong MySQL (sync logs, track status changes) được giữ ở DB level

## Goals / Non-Goals

**Goals:**
- Xây dựng RESTful API backend với Express + Sequelize ánh xạ đúng toàn bộ schema MySQL
- Tạo giao diện React hiện đại với Tailwind CSS, responsive, dashboard layout chuyên nghiệp
- Triển khai JWT authentication với RBAC (admin/staff) 
- CRUD đầy đủ cho Students, Teachers, Classes, Rooms, Payments, Promotions
- Gọi Stored Procedure cập nhật ưu đãi thâm niên qua API endpoint
- README.md hướng dẫn setup & migrate dữ liệu local

**Non-Goals:**
- Không xây dựng tính năng chat (bảng `chat_messages` tồn tại nhưng chưa cần UI)
- Không triển khai email sending (bảng `email_logs`/`email_templates` chỉ hiển thị lịch sử)
- Không xây dựng hệ thống backup (bảng `backup_logs` chỉ hiển thị log)
- Không deploy production - chỉ chạy local development
- Không viết unit tests trong phase này

## Decisions

### 1. Project Structure: Monorepo với server/ và client/

```
QLTTNN-react-node/
├── server/                    # Backend Node.js
│   ├── config/
│   │   └── db_config.js       # MySQL connection config
│   ├── models/                # Sequelize models
│   ├── routes/                # Express route handlers
│   ├── middleware/             # JWT auth, RBAC middleware
│   ├── controllers/           # Business logic
│   └── server.js              # Entry point
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── context/           # Auth & State context
│   │   ├── services/          # API service layer (axios)
│   │   └── App.jsx            # Root with routing
│   └── tailwind.config.js
├── engbreak_db.sql            # Database file for migration
└── README.md
```

**Rationale:** Monorepo cho phép quản lý cả frontend/backend trong 1 repository, dễ dàng cho development team nhỏ. Tách rõ ràng concerns giữa server/ và client/.

### 2. ORM: Sequelize với model definition (không migration)

Models sẽ được define để map đúng với schema hiện có trong `engbreak_db.sql`, không sử dụng Sequelize migration vì database đã tồn tại và cần import từ file .sql.

**Rationale:** Database đã có schema hoàn chỉnh với data. Dùng `sequelize.sync({ alter: false })` chỉ để validate models, không thay đổi schema.

### 3. Authentication: JWT Access Token + bcrypt compatibility

- Login API nhận username/password, verify bằng bcryptjs (tự động handle `$2y$` → `$2b$` prefix)
- Trả về JWT token (expires: 24h) chứa `{ id, username, role, full_name }`
- Frontend lưu token vào localStorage, gửi kèm Authorization header
- Middleware `verifyToken` protect tất cả route `/api/*` (trừ `/api/auth/login`)
- Middleware `requireRole('admin')` cho các route chỉ admin

**Rationale:** JWT stateless, dễ scale. bcryptjs hỗ trợ verify password hash từ PHP (`$2y$`) mà không cần re-hash.

### 4. State Management: React Context API

Sử dụng Context API cho authentication state (user info, token, login/logout). Không dùng Redux vì ứng dụng có complexity vừa phải, Context đủ cho auth và data fetching.

**Rationale:** Context API built-in React, giảm bundle size và complexity so với Redux Toolkit cho use case này.

### 5. API Design Pattern

```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id

GET    /api/teachers
POST   /api/teachers
PUT    /api/teachers/:id

GET    /api/classes
POST   /api/classes
PUT    /api/classes/:id

GET    /api/payments
POST   /api/payments

GET    /api/promotions
POST   /api/promotions/update-seniority  → calls stored procedure

GET    /api/rooms
GET    /api/shifts
GET    /api/levels
GET    /api/tuition-packages

GET    /api/dashboard/stats              → aggregate data
GET    /api/activity-logs
```

### 6. Tailwind CSS v3 với dark-inspired theme

Color palette: Indigo/Blue primary, slate/gray neutrals. Dashboard layout: sidebar 64px-256px collapsible, topbar 64px fixed. Data tables với pagination, search, và sort. Modals cho form input.

## Risks / Trade-offs

- **[Risk] PHP bcrypt hash compatibility** → bcryptjs tự động xử lý `$2y$` prefix, đã verified trong nhiều production apps. Nếu có issue, thêm logic replace `$2y$` → `$2b$` trước khi compare.
- **[Risk] Trigger logic vẫn ở MySQL level** → Các trigger sync log vẫn hoạt động khi Sequelize write data. Trade-off: consistency đảm bảo, nhưng debug khó hơn vì side-effects ẩn trong DB. Trong tương lai có thể chuyển sang application-level logging.
- **[Risk] Stored Procedure dependency** → `UpdateStudentPromotionsBasedOnSeniority` vẫn được gọi trực tiếp qua `sequelize.query('CALL ...')`. Nếu cần remove SP dependency, logic có thể replicate trong JavaScript.
- **[Trade-off] localStorage cho JWT** → Đơn giản, nhưng vulnerable với XSS. Acceptable cho internal management tool. Có thể upgrade sang httpOnly cookie nếu cần.
- **[Trade-off] Sequelize sync disabled** → Không auto-create tables, yêu cầu user phải import SQL file trước. README.md sẽ hướng dẫn rõ ràng.

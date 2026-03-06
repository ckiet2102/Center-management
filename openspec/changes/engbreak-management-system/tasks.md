## 1. Project Setup & Database Configuration

- [x] 1.1 Initialize Node.js backend project in `server/` directory - run `npm init -y` and install dependencies: express, sequelize, mysql2, jsonwebtoken, bcryptjs, cors, dotenv, nodemon
- [x] 1.2 Create `server/config/db_config.js` with Sequelize instance connecting to MySQL using environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)
- [x] 1.3 Create `server/.env.example` with all required environment variables (DB_HOST=localhost, DB_PORT=3306, DB_USER=root, DB_PASSWORD=, DB_NAME=engbreak_db, JWT_SECRET=engbreak-secret-key, PORT=5000)
- [x] 1.4 Create `server/server.js` entry point with Express app, CORS, JSON body parser, route mounting, and database connection test
- [x] 1.5 Copy `engbreak_db.sql` to project root and create `README.md` with full setup guide (prerequisites, MySQL import instructions, env setup, npm install, run commands, default credentials)

## 2. Sequelize Models

- [x] 2.1 Create `server/models/User.js` model mapping to `users` table (id, username, password, full_name, role, created_at)
- [x] 2.2 Create `server/models/Student.js` model mapping to `students` table with all fields (id, full_name, dob, gender, phone, parent_phone, email, avatar, address, note, join_date, status, learning_status, promotion_id)
- [x] 2.3 Create `server/models/Teacher.js` model mapping to `teachers` table with all fields including code_name, university, p_c, experience, specialty, status
- [x] 2.4 Create `server/models/Class.js` model mapping to `classes` table (id, class_name, level_id, teacher_id, shift_id, room_id, schedule_days, shift, start_date, end_date, status, student_count)
- [x] 2.5 Create `server/models/Enrollment.js` model mapping to `enrollments` table (id, student_id, class_id, registration_date, start_study_date, end_study_date, is_special_schedule, special_days, status, note)
- [x] 2.6 Create `server/models/Payment.js` model mapping to `payments` table with all monetary fields (original_amount, discount_amount, promotion_id, final_amount, payment_method, transaction_code)
- [x] 2.7 Create `server/models/Promotion.js` model mapping to `promotions` table (id, name, discount_percent, condition_type, description)
- [x] 2.8 Create `server/models/Room.js`, `server/models/Shift.js`, `server/models/Level.js`, `server/models/TuitionPackage.js` models
- [x] 2.9 Create `server/models/ActivityLog.js`, `server/models/StudentLog.js`, `server/models/TeacherLog.js`, `server/models/ClassLog.js` log models
- [x] 2.10 Create `server/models/index.js` to initialize all models, define associations (Student.belongsTo Promotion, Class.belongsTo Teacher/Level/Room/Shift, Enrollment.belongsTo Student/Class, Payment.belongsTo Student/Enrollment/Promotion, TuitionPackage.belongsTo Level), and export

## 3. Authentication Backend

- [x] 3.1 Create `server/middleware/auth.js` with `verifyToken` middleware (decode JWT from Authorization Bearer header, attach user to req) and `requireRole` middleware factory
- [x] 3.2 Create `server/controllers/authController.js` with login function (find user by username, verify password with bcryptjs supporting $2y$ prefix, generate JWT with id/username/role/full_name)
- [x] 3.3 Create `server/routes/auth.js` with POST `/login` and GET `/me` endpoints

## 4. Student Management Backend

- [x] 4.1 Create `server/controllers/studentController.js` with: getAllStudents (with search query + Promotion include), getStudentById (with Enrollment + Payment includes), createStudent, updateStudent, deleteStudent (admin only)
- [x] 4.2 Create `server/routes/students.js` with RESTful routes: GET /, GET /:id, POST /, PUT /:id, DELETE /:id (all protected by verifyToken)
- [x] 4.3 Create `server/controllers/studentLogController.js` to insert into `student_logs` table on student create/update/delete operations

## 5. Teacher, Class, Room/Shift/Level Backend

- [x] 5.1 Create `server/controllers/teacherController.js` with getAllTeachers, createTeacher, updateTeacher and `server/routes/teachers.js`
- [x] 5.2 Create `server/controllers/classController.js` with getAllClasses (include Teacher, Level, Room, Shift), createClass, updateClass and `server/routes/classes.js`
- [x] 5.3 Create `server/controllers/roomController.js` with getAllRooms, updateRoom and `server/routes/rooms.js`
- [x] 5.4 Create `server/routes/misc.js` with GET `/shifts`, GET `/levels`, GET `/tuition-packages` endpoints using simple model queries

## 6. Payment & Promotion Backend

- [x] 6.1 Create `server/controllers/paymentController.js` with getAllPayments (include Student, Promotion) and createPayment (calculate discount based on promotion), and `server/routes/payments.js`
- [x] 6.2 Create `server/controllers/promotionController.js` with getAllPromotions and updateSeniority (calls `CALL UpdateStudentPromotionsBasedOnSeniority()` via sequelize.query), and `server/routes/promotions.js`

## 7. Activity Logs & Dashboard Backend

- [x] 7.1 Create `server/controllers/activityLogController.js` with getActivityLogs (paginated, ordered by created_at DESC) and `server/routes/activityLogs.js`
- [x] 7.2 Create `server/controllers/dashboardController.js` with getStats endpoint returning aggregate counts (total students, active classes, total teachers, total revenue) and `server/routes/dashboard.js`
- [x] 7.3 Mount all routes in `server/server.js`: /api/auth, /api/students, /api/teachers, /api/classes, /api/payments, /api/promotions, /api/rooms, /api/shifts, /api/levels, /api/tuition-packages, /api/activity-logs, /api/dashboard

## 8. React Frontend Setup

- [x] 8.1 Initialize React project in `client/` using Vite: `npm create vite@latest ./ -- --template react`
- [x] 8.2 Install frontend dependencies: react-router-dom, axios, tailwindcss, @tailwindcss/vite (hoặc postcss + autoprefixer), react-icons
- [x] 8.3 Configure Tailwind CSS (tailwind.config.js, index.css with @tailwind directives), setup custom color palette (indigo/slate theme)
- [x] 8.4 Create `client/src/services/api.js` - Axios instance with base URL (http://localhost:5000/api), interceptor to attach JWT token from localStorage

## 9. Authentication Frontend

- [x] 9.1 Create `client/src/context/AuthContext.jsx` with AuthProvider managing user state, token storage, login/logout functions
- [x] 9.2 Create `client/src/pages/LoginPage.jsx` - professional login form with EngBreak branding, username/password inputs, error handling, redirect to /dashboard on success
- [x] 9.3 Create `client/src/components/ProtectedRoute.jsx` - wrapper component that redirects to /login if no valid token exists
- [x] 9.4 Setup React Router in `client/src/App.jsx` with routes: /login, /dashboard, /students, /teachers, /classes, /rooms, /payments, /promotions, /activity-logs (all wrapped in ProtectedRoute)

## 10. Dashboard Layout Components

- [x] 10.1 Create `client/src/components/layout/Sidebar.jsx` - fixed left sidebar (w-64) with EngBreak logo, navigation items with icons (react-icons), active state styling, role-based menu filtering
- [x] 10.2 Create `client/src/components/layout/Topbar.jsx` - fixed top bar showing current user name (e.g., "Admin Bảo Minh Phát"), role badge, logout button
- [x] 10.3 Create `client/src/components/layout/DashboardLayout.jsx` - main layout wrapper combining Sidebar + Topbar + content area with proper spacing
- [x] 10.4 Create `client/src/pages/DashboardPage.jsx` - overview page with stat cards (total students, active classes, teachers, revenue), recent activity feed

## 11. Student Management Frontend

- [x] 11.1 Create `client/src/pages/StudentsPage.jsx` - student data table with columns (Mã HV, Họ tên, SĐT, Ngày tham gia, Trạng thái, Ưu đãi), search input, pagination, "Thêm học viên" button
- [x] 11.2 Create `client/src/components/students/StudentModal.jsx` - modal form for add/edit student with all fields (full_name, dob, gender, phone, parent_phone, email, address, note, join_date, promotion_id), form validation
- [x] 11.3 Create `client/src/components/students/StudentDetail.jsx` - detailed view showing student info, enrollment history, and payment history

## 12. Other Management Pages Frontend

- [x] 12.1 Create `client/src/pages/TeachersPage.jsx` - teacher list with status badges (color-coded: đang dạy/tạm nghỉ/nghỉ phép/nghỉ việc/thử việc), edit modal
- [x] 12.2 Create `client/src/pages/ClassesPage.jsx` - class list showing teacher, room, shift, student count, status with visual cards or table
- [x] 12.3 Create `client/src/pages/RoomsPage.jsx` - room grid with status indicators (sẵn sàng=green, bảo trì=orange), edit status
- [x] 12.4 Create `client/src/pages/PaymentsPage.jsx` - payment history table with student name, amount, method, date
- [x] 12.5 Create `client/src/pages/PromotionsPage.jsx` - promotions list with "Cập nhật ưu đãi thâm niên" button (admin only) triggering stored procedure
- [x] 12.6 Create `client/src/pages/ActivityLogsPage.jsx` - activity log timeline/table with action type badges, descriptions, timestamps, pagination

## 13. Polish & Final Integration

- [x] 13.1 Add responsive design breakpoints - sidebar collapse on mobile (<768px), table horizontal scroll, modal full-screen on small devices
- [x] 13.2 Add loading states, error handling toasts/alerts for all API calls across all pages
- [x] 13.3 Verify all API endpoints work correctly end-to-end (login → CRUD students → payments → promotions → logs)
- [x] 13.4 Final README.md review - ensure migration instructions are complete, add API endpoint reference table, default login credentials (Admin/password)

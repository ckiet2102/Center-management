## ADDED Requirements

### Requirement: Dashboard layout with fixed sidebar
The frontend SHALL render a dashboard layout with a fixed sidebar on the left side (width: 256px) containing navigation links. The sidebar SHALL display the EngBreak logo at the top and navigation items below. Navigation items SHALL be conditionally shown based on user role (admin sees all items, staff sees limited items).

#### Scenario: Admin sees full navigation
- **WHEN** admin user logs in and views the dashboard
- **THEN** sidebar displays all navigation items: Dashboard, Học viên, Giảng viên, Lớp học, Phòng học, Học phí, Ưu đãi, Nhật ký hoạt động

#### Scenario: Staff sees limited navigation
- **WHEN** staff user logs in and views the dashboard
- **THEN** sidebar displays limited items: Dashboard, Học viên, Lớp học, Phòng học

### Requirement: Topbar showing current user
The frontend SHALL render a fixed topbar (height: 64px) across the top of the content area. The topbar SHALL display the current authenticated user's full_name and role, with a logout button.

#### Scenario: View topbar
- **WHEN** user "Huỳnh Bảo Minh Phát" (admin) is logged in
- **THEN** topbar displays "Admin Bảo Minh Phát" with a logout button

### Requirement: Login page
The frontend SHALL render a professional login page at the root URL ("/login") with username and password input fields, a login button, and the EngBreak branding. Upon successful login, the frontend SHALL redirect to the dashboard.

#### Scenario: Successful login flow
- **WHEN** user enters valid credentials and clicks login
- **THEN** system authenticates, stores JWT token, and redirects to /dashboard

#### Scenario: Invalid credentials
- **WHEN** user enters incorrect password and clicks login
- **THEN** system displays error message without redirecting

### Requirement: Protected routes
The frontend SHALL redirect unauthenticated users (no valid JWT) to the login page when they attempt to access any dashboard route. The frontend SHALL use React Router for client-side routing.

#### Scenario: Unauthenticated access
- **WHEN** user without stored JWT navigates to /dashboard
- **THEN** frontend redirects to /login

### Requirement: Responsive design
The frontend layout SHALL be fully responsive. On mobile screens (< 768px), the sidebar SHALL collapse to an icon-only mode or a hamburger menu overlay.

#### Scenario: Mobile view
- **WHEN** user accesses the dashboard on a screen width less than 768px
- **THEN** sidebar collapses and content area takes full width

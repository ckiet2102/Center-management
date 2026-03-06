## ADDED Requirements

### Requirement: User can login with credentials
The system SHALL authenticate users by accepting username and password via POST `/api/auth/login`. The system SHALL verify the password against bcrypt hash stored in the `users` table (supporting both `$2y$` and `$2b$` prefixes). Upon success, the system SHALL return a JWT token containing user id, username, role, and full_name.

#### Scenario: Successful login
- **WHEN** user submits valid username "Admin" and correct password to POST `/api/auth/login`
- **THEN** system returns HTTP 200 with JSON `{ token, user: { id, username, role, full_name } }`

#### Scenario: Invalid password
- **WHEN** user submits valid username but incorrect password
- **THEN** system returns HTTP 401 with message "Sai mật khẩu"

#### Scenario: Non-existent user
- **WHEN** user submits a username that does not exist in the `users` table
- **THEN** system returns HTTP 401 with message "Tài khoản không tồn tại"

### Requirement: JWT token protects API routes
The system SHALL require a valid JWT token in the Authorization header (Bearer format) for all API routes except `/api/auth/login`. The middleware SHALL decode the token and attach user info to the request object.

#### Scenario: Request with valid token
- **WHEN** client sends request with valid JWT in Authorization header
- **THEN** system processes the request and returns appropriate response

#### Scenario: Request without token
- **WHEN** client sends request without Authorization header to a protected route
- **THEN** system returns HTTP 401 with message "Token không được cung cấp"

#### Scenario: Request with expired or invalid token
- **WHEN** client sends request with expired or malformed JWT
- **THEN** system returns HTTP 403 with message "Token không hợp lệ"

### Requirement: Role-based access control
The system SHALL support RBAC with two roles: `admin` and `staff`. Admin users SHALL have access to all operations. Staff users SHALL have read access and limited write access (no delete, no user management).

#### Scenario: Admin accesses admin-only route
- **WHEN** authenticated admin user accesses a route requiring admin role
- **THEN** system processes the request normally

#### Scenario: Staff accesses admin-only route
- **WHEN** authenticated staff user accesses a route requiring admin role
- **THEN** system returns HTTP 403 with message "Không có quyền truy cập"

### Requirement: Get current user info
The system SHALL provide GET `/api/auth/me` endpoint that returns the current authenticated user's profile information from the JWT token.

#### Scenario: Get current user
- **WHEN** authenticated user sends GET `/api/auth/me`
- **THEN** system returns HTTP 200 with user info `{ id, username, role, full_name }`

### Requirement: Frontend stores and sends token
The React frontend SHALL store the JWT token in localStorage upon successful login. All subsequent API requests SHALL include the token in the Authorization header. Upon logout or token expiration, the frontend SHALL clear the stored token and redirect to login page.

#### Scenario: Token stored after login
- **WHEN** user successfully logs in via the login form
- **THEN** frontend stores JWT token in localStorage and redirects to dashboard

#### Scenario: Token cleared on logout
- **WHEN** user clicks the logout button
- **THEN** frontend clears JWT from localStorage and redirects to login page

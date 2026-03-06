## ADDED Requirements

### Requirement: Database connection configuration
The system SHALL provide a `server/config/db_config.js` file that exports a Sequelize instance configured to connect to MySQL. The configuration SHALL read from environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) with sensible defaults for local development (localhost:3306, root, engbreak_db).

#### Scenario: Successful database connection
- **WHEN** the server starts with correct MySQL credentials in `.env`
- **THEN** Sequelize connects to the database and logs "Database connected successfully"

#### Scenario: Database connection failure
- **WHEN** the server starts with incorrect MySQL credentials
- **THEN** system logs the connection error and exits gracefully

### Requirement: Sequelize models match SQL schema
The system SHALL define Sequelize models that exactly match the table definitions in `engbreak_db.sql`. Models SHALL NOT use `sync({ force: true })` or `sync({ alter: true })` to avoid modifying the existing database schema. Key models: User, Student, Teacher, Class, Enrollment, Payment, Promotion, Room, Shift, Level, TuitionPackage, ActivityLog, AuthLog, StudentLog, TeacherLog, ClassLog, RoomLog.

#### Scenario: Models load without schema modification
- **WHEN** server starts and models are initialized
- **THEN** Sequelize validates model definitions against existing tables without creating or altering them

### Requirement: README with migration guide
The project SHALL include a README.md at the root that documents: project overview, tech stack, prerequisites (Node.js, MySQL), step-by-step setup (clone, npm install for server and client, create .env, import SQL file into MySQL, start server, start client), available API endpoints, and default login credentials.

#### Scenario: New developer setup
- **WHEN** a developer follows README.md instructions
- **THEN** they can import `engbreak_db.sql` into MySQL, configure `.env`, run `npm install` in both server/ and client/, and start the application locally

### Requirement: Environment configuration
The system SHALL use a `.env` file in the server/ directory for configuration. Required variables: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT. A `.env.example` file SHALL be provided with placeholder values.

#### Scenario: .env.example provided
- **WHEN** developer clones the project
- **THEN** they find `.env.example` with all required variables and can copy it to `.env` with their local values

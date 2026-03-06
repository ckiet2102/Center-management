## ADDED Requirements

### Requirement: List all students
The system SHALL provide GET `/api/students` endpoint that returns all student records from the `students` table, including their associated promotion information via JOIN with `promotions` table.

#### Scenario: Retrieve all students
- **WHEN** authenticated user sends GET `/api/students`
- **THEN** system returns HTTP 200 with array of student objects containing id, full_name, dob, gender, phone, parent_phone, email, address, note, join_date, status, learning_status, promotion_id, and promotion details (name, discount_percent)

### Requirement: Search students by name or ID
The system SHALL support query parameter `?search=` on GET `/api/students` to filter students by full_name (LIKE match) or by id (exact match).

#### Scenario: Search by name
- **WHEN** user sends GET `/api/students?search=Nguyễn`
- **THEN** system returns only students whose full_name contains "Nguyễn"

#### Scenario: Search by ID
- **WHEN** user sends GET `/api/students?search=5`
- **THEN** system returns the student with id=5 (if exists) alongside name matches

### Requirement: Get single student detail
The system SHALL provide GET `/api/students/:id` endpoint returning a single student with enrollment and payment history.

#### Scenario: Existing student
- **WHEN** user sends GET `/api/students/1`
- **THEN** system returns HTTP 200 with full student detail including enrollments and payment records

#### Scenario: Non-existent student
- **WHEN** user sends GET `/api/students/999`
- **THEN** system returns HTTP 404 with message "Không tìm thấy học viên"

### Requirement: Create new student
The system SHALL provide POST `/api/students` endpoint to create a new student record. Required fields: full_name. Optional fields: dob, gender, phone, parent_phone, email, address, note, join_date, promotion_id.

#### Scenario: Successful creation
- **WHEN** user sends POST `/api/students` with `{ full_name: "Nguyễn Văn Test", dob: "2005-01-01", gender: "Nam", phone: "0999888777" }`
- **THEN** system creates the student record and returns HTTP 201 with the new student object

#### Scenario: Missing required field
- **WHEN** user sends POST `/api/students` without full_name
- **THEN** system returns HTTP 400 with validation error message

### Requirement: Update student
The system SHALL provide PUT `/api/students/:id` endpoint to update student information. All fields are optional in the update payload.

#### Scenario: Successful update
- **WHEN** user sends PUT `/api/students/1` with `{ phone: "0900000000" }`
- **THEN** system updates the student and returns HTTP 200 with updated student object

### Requirement: Delete student
The system SHALL provide DELETE `/api/students/:id` endpoint (admin only) to remove a student record.

#### Scenario: Admin deletes student
- **WHEN** admin user sends DELETE `/api/students/1`
- **THEN** system deletes the student and returns HTTP 200 with success message

#### Scenario: Staff attempts delete
- **WHEN** staff user sends DELETE `/api/students/1`
- **THEN** system returns HTTP 403

### Requirement: Student data table UI
The frontend SHALL display students in a data table with columns: Mã HV (id), Họ tên, Ngày sinh, SĐT, Ngày tham gia, Trạng thái học, Ưu đãi. The table SHALL support text search input for filtering by name or ID.

#### Scenario: View student list
- **WHEN** user navigates to the Students page
- **THEN** system displays all students in a paginated data table with search input above

### Requirement: Student add/edit modal
The frontend SHALL use a modal dialog for adding new students and editing existing students. The modal SHALL contain a form with all editable student fields.

#### Scenario: Open add modal
- **WHEN** user clicks "Thêm học viên" button
- **THEN** system shows a modal with empty form fields for student creation

#### Scenario: Open edit modal
- **WHEN** user clicks the edit icon on a student row
- **THEN** system shows a modal pre-filled with the student's current data

### Requirement: Update seniority promotions via API
The system SHALL provide POST `/api/promotions/update-seniority` endpoint (admin only) that calls the MySQL stored procedure `UpdateStudentPromotionsBasedOnSeniority` to automatically update promotion_id for students based on their join_date seniority.

#### Scenario: Execute seniority update
- **WHEN** admin sends POST `/api/promotions/update-seniority`
- **THEN** system calls the stored procedure and returns HTTP 200 with count of updated students

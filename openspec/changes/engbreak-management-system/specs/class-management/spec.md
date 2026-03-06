## ADDED Requirements

### Requirement: List all classes
The system SHALL provide GET `/api/classes` endpoint returning all class records with associated teacher name, level name, room name, and shift info via JOINs.

#### Scenario: Retrieve all classes
- **WHEN** authenticated user sends GET `/api/classes`
- **THEN** system returns HTTP 200 with array of class objects including: id, class_name, teacher (full_name, code_name), level (level_name), room (room_name), shift (shift_name, days, start_time, end_time), start_date, end_date, status, student_count

### Requirement: Create class
The system SHALL provide POST `/api/classes` endpoint to create a new class. Required fields: class_name, level_id. Optional: teacher_id, shift_id, room_id, start_date, end_date.

#### Scenario: Successful class creation
- **WHEN** user sends POST `/api/classes` with `{ class_name: "Ielts 2 - Ca 1 (2-4-6) - Mr.Nam", level_id: 15, teacher_id: 12, shift_id: 1, room_id: 5 }`
- **THEN** system creates the class and returns HTTP 201

### Requirement: Update class
The system SHALL provide PUT `/api/classes/:id` endpoint to update class information. The MySQL trigger `track_class_status_change` SHALL automatically log status changes.

#### Scenario: Update class details
- **WHEN** user sends PUT `/api/classes/1` with `{ room_id: 3 }`
- **THEN** system updates the class and returns HTTP 200

### Requirement: Class list visual UI
The frontend SHALL display classes in a visually distinctive layout showing: tên lớp, giảng viên, phòng, ca học, ngày bắt đầu, sĩ số, và trạng thái (active/inactive) with color-coded status indicators.

#### Scenario: View class list
- **WHEN** user navigates to the Classes page
- **THEN** system displays all classes with status badges and student count

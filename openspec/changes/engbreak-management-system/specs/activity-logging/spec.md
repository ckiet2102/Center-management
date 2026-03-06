## ADDED Requirements

### Requirement: List activity logs
The system SHALL provide GET `/api/activity-logs` endpoint returning activity log records from the `activity_logs` table, ordered by created_at descending. The endpoint SHALL support pagination via `?page=1&limit=20` query params.

#### Scenario: Retrieve recent logs
- **WHEN** authenticated user sends GET `/api/activity-logs?page=1&limit=20`
- **THEN** system returns HTTP 200 with the 20 most recent activity log entries and total count for pagination

### Requirement: Activity log UI
The frontend SHALL display activity logs in a timeline or table format showing: action_type, description, created_at. Each action type SHALL have a distinctive icon or color (LOGIN=blue, HOC_VIEN_THEM=green, HOC_VIEN_SUA=orange, HOC_PHI_=purple).

#### Scenario: View activity logs page
- **WHEN** admin navigates to the Activity Logs page
- **THEN** system displays recent activity entries with action type badges, descriptions, and timestamps

### Requirement: Database triggers log automatically
The system SHALL rely on existing MySQL triggers (sync_auth_logs, sync_student_logs, sync_teacher_logs, sync_class_logs, sync_room_logs, sync_tuition_logs) to automatically insert records into `activity_logs` when operations occur through Sequelize. No application-level duplication of this logic is needed.

#### Scenario: Student creation triggers log
- **WHEN** a new student is created via POST `/api/students`
- **THEN** the MySQL trigger on `student_logs` automatically inserts a corresponding entry in `activity_logs` with action_type "HOC_VIEN_THEM"

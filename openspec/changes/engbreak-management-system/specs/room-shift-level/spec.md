## ADDED Requirements

### Requirement: List rooms
The system SHALL provide GET `/api/rooms` endpoint returning all room records with fields: id, room_name, status (san_sang/dang_su_dung/bao_tri), note.

#### Scenario: Retrieve all rooms
- **WHEN** authenticated user sends GET `/api/rooms`
- **THEN** system returns HTTP 200 with array of room objects

### Requirement: Update room
The system SHALL provide PUT `/api/rooms/:id` endpoint to update room information including status changes.

#### Scenario: Change room status
- **WHEN** user sends PUT `/api/rooms/15` with `{ status: "san_sang" }`
- **THEN** system updates room status and returns HTTP 200

### Requirement: List shifts
The system SHALL provide GET `/api/shifts` endpoint returning all shift records with: id, shift_name, days, start_time, end_time.

#### Scenario: Retrieve all shifts
- **WHEN** authenticated user sends GET `/api/shifts`
- **THEN** system returns HTTP 200 with array of shift objects (e.g., "Ca 1 (2-4-6)", 17:45-19:15)

### Requirement: List levels
The system SHALL provide GET `/api/levels` endpoint returning all course levels sorted by sort_order. Fields: id, level_name, course_duration, description, sort_order.

#### Scenario: Retrieve all levels
- **WHEN** authenticated user sends GET `/api/levels`
- **THEN** system returns HTTP 200 with levels ordered by sort_order (Early, Starter, Mover, ... IELTS 5, Giao tiếp A-C)

### Requirement: Room status visual display
The frontend SHALL display rooms in a grid or table showing room_name and status with color-coded indicators: sẵn sàng (green), đang sử dụng (blue), bảo trì (red/orange).

#### Scenario: View rooms page
- **WHEN** user navigates to the Rooms page
- **THEN** system displays all 16 rooms with their status badges and notes

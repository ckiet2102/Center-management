## ADDED Requirements

### Requirement: List payments
The system SHALL provide GET `/api/payments` endpoint returning all payment records with student name, enrollment info, and promotion details.

#### Scenario: Retrieve all payments
- **WHEN** authenticated user sends GET `/api/payments`
- **THEN** system returns HTTP 200 with array of payment objects including: id, student (full_name), enrollment_id, weeks, original_amount, discount_amount, promotion (name), final_amount, payment_date, payment_method, note

### Requirement: Create payment
The system SHALL provide POST `/api/payments` endpoint to record a new tuition payment. The system SHALL calculate discount_amount based on promotion_id and original_amount.

#### Scenario: Payment with promotion
- **WHEN** user sends POST `/api/payments` with `{ enrollment_id: 1, student_id: 1, weeks: 8, original_amount: 2000000, promotion_id: 2 }`
- **THEN** system calculates 10% discount (200000), sets final_amount to 1800000, creates payment record and returns HTTP 201

#### Scenario: Payment without promotion
- **WHEN** user sends POST `/api/payments` with `{ enrollment_id: 12, student_id: 12, weeks: 8, original_amount: 2800000 }`
- **THEN** system sets discount_amount to 0, final_amount equals original_amount, creates record and returns HTTP 201

### Requirement: List tuition packages
The system SHALL provide GET `/api/tuition-packages` endpoint returning tuition packages grouped by level, showing week_duration, tuition_fee, sessions_per_week, and price_per_session.

#### Scenario: Retrieve tuition packages
- **WHEN** user sends GET `/api/tuition-packages`
- **THEN** system returns HTTP 200 with array of tuition packages including level name

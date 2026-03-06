## ADDED Requirements

### Requirement: List promotions
The system SHALL provide GET `/api/promotions` endpoint returning all promotion records with: id, name, discount_percent, condition_type (none/seniority_1y/seniority_2y/family/special), description.

#### Scenario: Retrieve all promotions
- **WHEN** authenticated user sends GET `/api/promotions`
- **THEN** system returns HTTP 200 with array of promotions: "Học trên 1 năm" (5%), "Học trên 2 năm" (10%), "Gia đình/Người thân" (5%), "Đặc biệt (Học bổng)" (100%)

### Requirement: Trigger seniority promotion update
The system SHALL provide POST `/api/promotions/update-seniority` endpoint (admin only) that executes the MySQL stored procedure `UpdateStudentPromotionsBasedOnSeniority`. This procedure SHALL:
- Set promotion_id=2 for students with join_date >= 24 months ago (unless they already have promotion 2 or 4)
- Set promotion_id=1 for students with join_date >= 12 months but < 24 months ago (unless they already have promotion 1, 2, or 4)

#### Scenario: Update seniority promotions
- **WHEN** admin sends POST `/api/promotions/update-seniority`
- **THEN** system calls `CALL UpdateStudentPromotionsBasedOnSeniority()` via Sequelize raw query and returns HTTP 200 with success message

#### Scenario: Staff cannot trigger update
- **WHEN** staff user sends POST `/api/promotions/update-seniority`
- **THEN** system returns HTTP 403

### Requirement: Promotion display in student context
The frontend SHALL display each student's current promotion status in the student list table and detail view. Promotions SHALL be shown as colored badges: "Học trên 1 năm" (blue), "Học trên 2 năm" (green), "Gia đình" (purple), "Học bổng" (gold).

#### Scenario: Student with promotion
- **WHEN** viewing a student who has promotion_id=2
- **THEN** display "Học trên 2 năm - 10%" badge next to student info

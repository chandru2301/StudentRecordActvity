# Student Attendance Management System

## Overview
This attendance management system provides comprehensive functionality for tracking student attendance across different periods, subjects, and dates. It includes REST API endpoints for marking attendance, retrieving attendance records, and generating attendance summaries.

## Database Schema

### Attendance Entity
- **Table**: `attendance`
- **Relationships**: Many-to-One with Student entity
- **Key Fields**:
  - `id`: Primary key
  - `student_id`: Foreign key to students table
  - `date`: Date of attendance
  - `period`: Period enum (FIRST_PERIOD to EIGHTH_PERIOD)
  - `subject`: Subject name
  - `status`: Attendance status (PRESENT, ABSENT, LATE, EXCUSED, MEDICAL_LEAVE)
  - `remarks`: Optional remarks
  - `marked_by`: Faculty member who marked attendance
  - `marked_at`: Timestamp when attendance was marked

### Periods
The system supports 8 periods per day:
1. **FIRST_PERIOD**: 09:00-10:00
2. **SECOND_PERIOD**: 10:00-11:00
3. **THIRD_PERIOD**: 11:15-12:15
4. **FOURTH_PERIOD**: 12:15-13:15
5. **FIFTH_PERIOD**: 14:00-15:00
6. **SIXTH_PERIOD**: 15:00-16:00
7. **SEVENTH_PERIOD**: 16:15-17:15
8. **EIGHTH_PERIOD**: 17:15-18:15

### Attendance Statuses
- **PRESENT**: Student attended the class
- **ABSENT**: Student was absent
- **LATE**: Student arrived late
- **EXCUSED**: Student was excused (with valid reason)
- **MEDICAL_LEAVE**: Student was on medical leave

## API Endpoints

### Base URL
```
/api/attendance
```

### 1. Mark Attendance
**POST** `/api/attendance/mark`

Mark attendance for a student.

**Request Body:**
```json
{
  "studentId": 1,
  "date": "2024-01-15",
  "period": "FIRST_PERIOD",
  "subject": "Mathematics",
  "status": "PRESENT",
  "remarks": "On time",
  "markedBy": "Dr. Smith"
}
```

**Response:**
```json
{
  "id": 1,
  "studentId": 1,
  "studentName": "John Doe",
  "studentRollNumber": "2024001",
  "date": "2024-01-15",
  "period": "FIRST_PERIOD",
  "periodTimeSlot": "09:00-10:00",
  "subject": "Mathematics",
  "status": "PRESENT",
  "statusDisplayName": "Present",
  "remarks": "On time",
  "markedBy": "Dr. Smith",
  "markedAt": "2024-01-15T09:05:00",
  "createdAt": "2024-01-15T09:05:00",
  "updatedAt": "2024-01-15T09:05:00"
}
```

### 2. Update Attendance
**PUT** `/api/attendance/{id}`

Update an existing attendance record.

**Request Body:** Same as mark attendance

### 3. Get Student Attendance
**GET** `/api/attendance/student/{studentId}`

Get all attendance records for a specific student (ordered by date descending).

**Response:** Array of attendance records

### 4. Get Attendance by Date
**GET** `/api/attendance/student/{studentId}/date/{date}`

Get attendance records for a specific student on a specific date.

**Response:**
```json
{
  "studentId": 1,
  "studentName": "John Doe",
  "studentRollNumber": "2024001",
  "date": "2024-01-15",
  "periods": [
    {
      "period": "FIRST_PERIOD",
      "periodTimeSlot": "09:00-10:00",
      "subject": "Mathematics",
      "status": "PRESENT",
      "statusDisplayName": "Present",
      "remarks": "On time",
      "markedBy": "Dr. Smith"
    }
  ]
}
```

### 5. Get Attendance by Date Range
**GET** `/api/attendance/student/{studentId}/range?startDate=2024-01-01&endDate=2024-01-31`

Get attendance records for a specific student within a date range.

### 6. Get Attendance Summary
**GET** `/api/attendance/student/{studentId}/summary?startDate=2024-01-01&endDate=2024-01-31`

Get comprehensive attendance summary for a student within a date range.

**Response:**
```json
{
  "studentId": 1,
  "studentName": "John Doe",
  "studentRollNumber": "2024001",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "totalRecords": 160,
  "presentCount": 140,
  "absentCount": 15,
  "lateCount": 3,
  "excusedCount": 2,
  "medicalLeaveCount": 0,
  "presentPercentage": 87.5,
  "absentPercentage": 9.375,
  "latePercentage": 1.875,
  "excusedPercentage": 1.25,
  "medicalLeavePercentage": 0.0,
  "attendanceBySubject": {
    "Mathematics": {
      "PRESENT": 18,
      "ABSENT": 2
    },
    "Physics": {
      "PRESENT": 17,
      "ABSENT": 3
    }
  },
  "recentAttendance": [
    // Array of recent attendance records
  ]
}
```

### 7. Get Attendance by Subject
**GET** `/api/attendance/student/{studentId}/subject/{subject}`

Get attendance records for a specific student and subject.

### 8. Get Attendance by Period
**GET** `/api/attendance/student/{studentId}/period/{period}`

Get attendance records for a specific student and period.

### 9. Get Attendance by ID
**GET** `/api/attendance/{id}`

Get a specific attendance record by ID.

### 10. Delete Attendance
**DELETE** `/api/attendance/{id}`

Delete an attendance record.

### 11. Get Available Periods
**GET** `/api/attendance/periods`

Get all available periods with their time slots.

**Response:**
```json
[
  {
    "period": "FIRST_PERIOD",
    "timeSlot": "09:00-10:00"
  },
  {
    "period": "SECOND_PERIOD",
    "timeSlot": "10:00-11:00"
  }
]
```

### 12. Get Available Statuses
**GET** `/api/attendance/statuses`

Get all available attendance statuses.

**Response:**
```json
[
  {
    "status": "PRESENT",
    "displayName": "Present"
  },
  {
    "status": "ABSENT",
    "displayName": "Absent"
  }
]
```

## Usage Examples

### Marking Attendance
```bash
curl -X POST http://localhost:8080/api/attendance/mark \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "date": "2024-01-15",
    "period": "FIRST_PERIOD",
    "subject": "Mathematics",
    "status": "PRESENT",
    "markedBy": "Dr. Smith"
  }'
```

### Getting Student Attendance Summary
```bash
curl "http://localhost:8080/api/attendance/student/1/summary?startDate=2024-01-01&endDate=2024-01-31"
```

### Getting Daily Attendance
```bash
curl "http://localhost:8080/api/attendance/student/1/date/2024-01-15"
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200 OK**: Successful operation
- **400 Bad Request**: Invalid input or business logic error
- **500 Internal Server Error**: Server error

Error responses include a message field:
```json
{
  "message": "Student not found with ID: 999"
}
```

## Business Rules

1. **Unique Constraint**: Only one attendance record per student, date, and period combination
2. **Date Validation**: Start date cannot be after end date
3. **Student Validation**: Student must exist before marking attendance
4. **Period Validation**: Period must be one of the defined enum values
5. **Status Validation**: Status must be one of the defined enum values

## Database Migration

To create the attendance table, run the following SQL:

```sql
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    date DATE NOT NULL,
    period VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    remarks TEXT,
    marked_by VARCHAR(100),
    marked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE KEY unique_attendance (student_id, date, period)
);
```

## Features

- ✅ Mark attendance for students
- ✅ Update attendance records
- ✅ View attendance by student, date, subject, or period
- ✅ Generate attendance summaries with percentages
- ✅ Track attendance by subject
- ✅ Get daily attendance breakdown
- ✅ Comprehensive error handling
- ✅ Data validation
- ✅ RESTful API design
- ✅ Support for multiple periods per day
- ✅ Flexible attendance statuses
- ✅ Audit trail (marked by, marked at)
- ✅ Date range queries
- ✅ Attendance statistics and analytics

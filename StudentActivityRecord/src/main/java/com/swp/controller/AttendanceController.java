package com.swp.controller;

import com.swp.dto.AttendancePeriodResponse;
import com.swp.dto.AttendanceRequest;
import com.swp.dto.AttendanceResponse;
import com.swp.dto.AttendanceSummaryResponse;
import com.swp.entity.Attendance;
import com.swp.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    /**
     * Mark attendance for a student
     * POST /api/attendance/mark
     */
    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@Valid @RequestBody AttendanceRequest request) {
        try {
            AttendanceResponse response = attendanceService.markAttendance(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to mark attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Update attendance record
     * PUT /api/attendance/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @Valid @RequestBody AttendanceRequest request) {
        try {
            AttendanceResponse response = attendanceService.updateAttendance(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to update attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Get all attendance records for a specific student
     * GET /api/attendance/student/{studentId}
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getAttendanceByStudent(@PathVariable Long studentId) {
        try {
            List<AttendanceResponse> response = attendanceService.getAttendanceByStudent(studentId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Get attendance records for a specific student and date
     * GET /api/attendance/student/{studentId}/date/{date}
     */
    @GetMapping("/student/{studentId}/date/{date}")
    public ResponseEntity<?> getAttendanceByStudentAndDate(
            @PathVariable Long studentId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            AttendancePeriodResponse response = attendanceService.getAttendanceByStudentAndDate(studentId, date);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Get attendance records for a specific student within a date range
     * GET /api/attendance/student/{studentId}/range?startDate=2024-01-01&endDate=2024-01-31
     */
    @GetMapping("/student/{studentId}/range")
    public ResponseEntity<?> getAttendanceByStudentAndDateRange(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<AttendanceResponse> response = attendanceService.getAttendanceByStudentAndDateRange(studentId, startDate, endDate);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Get attendance summary for a specific student within a date range
     * GET /api/attendance/student/{studentId}/summary?startDate=2024-01-01&endDate=2024-01-31
     */
    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<?> getAttendanceSummary(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            AttendanceSummaryResponse response = attendanceService.getAttendanceSummary(studentId, startDate, endDate);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch attendance summary: " + e.getMessage()));
        }
    }
    
    /**
     * Get attendance records for a specific student and subject
     * GET /api/attendance/student/{studentId}/subject/{subject}
     */
    @GetMapping("/student/{studentId}/subject/{subject}")
    public ResponseEntity<?> getAttendanceByStudentAndSubject(
            @PathVariable Long studentId,
            @PathVariable String subject) {
        try {
            List<AttendanceResponse> response = attendanceService.getAttendanceByStudentAndSubject(studentId, subject);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Get attendance records for a specific student and period
     * GET /api/attendance/student/{studentId}/period/{period}
     */
    @GetMapping("/student/{studentId}/period/{period}")
    public ResponseEntity<?> getAttendanceByStudentAndPeriod(
            @PathVariable Long studentId,
            @PathVariable Attendance.Period period) {
        try {
            List<AttendanceResponse> response = attendanceService.getAttendanceByStudentAndPeriod(studentId, period);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Get attendance record by ID
     * GET /api/attendance/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAttendanceById(@PathVariable Long id) {
        try {
            AttendanceResponse response = attendanceService.getAttendanceById(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Delete attendance record
     * DELETE /api/attendance/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        try {
            attendanceService.deleteAttendance(id);
            return ResponseEntity.ok(new SuccessResponse("Attendance record deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to delete attendance: " + e.getMessage()));
        }
    }
    
    /**
     * Get all available periods
     * GET /api/attendance/periods
     */
    @GetMapping("/periods")
    public ResponseEntity<?> getAvailablePeriods() {
        try {
            List<PeriodInfo> periods = List.of(
                new PeriodInfo(Attendance.Period.FIRST_PERIOD, "09:00-10:00"),
                new PeriodInfo(Attendance.Period.SECOND_PERIOD, "10:00-11:00"),
                new PeriodInfo(Attendance.Period.THIRD_PERIOD, "11:15-12:15"),
                new PeriodInfo(Attendance.Period.FOURTH_PERIOD, "12:15-13:15"),
                new PeriodInfo(Attendance.Period.FIFTH_PERIOD, "14:00-15:00"),
                new PeriodInfo(Attendance.Period.SIXTH_PERIOD, "15:00-16:00"),
                new PeriodInfo(Attendance.Period.SEVENTH_PERIOD, "16:15-17:15"),
                new PeriodInfo(Attendance.Period.EIGHTH_PERIOD, "17:15-18:15")
            );
            return ResponseEntity.ok(periods);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch periods: " + e.getMessage()));
        }
    }
    
    /**
     * Get all available attendance statuses
     * GET /api/attendance/statuses
     */
    @GetMapping("/statuses")
    public ResponseEntity<?> getAvailableStatuses() {
        try {
            List<StatusInfo> statuses = List.of(
                new StatusInfo(Attendance.AttendanceStatus.PRESENT, "Present"),
                new StatusInfo(Attendance.AttendanceStatus.ABSENT, "Absent"),
                new StatusInfo(Attendance.AttendanceStatus.LATE, "Late"),
                new StatusInfo(Attendance.AttendanceStatus.EXCUSED, "Excused"),
                new StatusInfo(Attendance.AttendanceStatus.MEDICAL_LEAVE, "Medical Leave")
            );
            return ResponseEntity.ok(statuses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch statuses: " + e.getMessage()));
        }
    }
    
    // Helper classes for responses
    public static class ErrorResponse {
        private String message;
        
        public ErrorResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
    
    public static class SuccessResponse {
        private String message;
        
        public SuccessResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
    
    public static class PeriodInfo {
        private Attendance.Period period;
        private String timeSlot;
        
        public PeriodInfo(Attendance.Period period, String timeSlot) {
            this.period = period;
            this.timeSlot = timeSlot;
        }
        
        public Attendance.Period getPeriod() {
            return period;
        }
        
        public void setPeriod(Attendance.Period period) {
            this.period = period;
        }
        
        public String getTimeSlot() {
            return timeSlot;
        }
        
        public void setTimeSlot(String timeSlot) {
            this.timeSlot = timeSlot;
        }
    }
    
    public static class StatusInfo {
        private Attendance.AttendanceStatus status;
        private String displayName;
        
        public StatusInfo(Attendance.AttendanceStatus status, String displayName) {
            this.status = status;
            this.displayName = displayName;
        }
        
        public Attendance.AttendanceStatus getStatus() {
            return status;
        }
        
        public void setStatus(Attendance.AttendanceStatus status) {
            this.status = status;
        }
        
        public String getDisplayName() {
            return displayName;
        }
        
        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }
    }
}

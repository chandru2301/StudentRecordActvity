package com.swp.dto;

import com.swp.entity.Attendance;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AttendanceRequest {
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Period is required")
    private Attendance.Period period;
    
    @NotNull(message = "Subject is required")
    private String subject;
    
    @NotNull(message = "Status is required")
    private Attendance.AttendanceStatus status;
    
    private String remarks;
    
    private String markedBy;
}

package com.swp.dto;

import com.swp.entity.Attendance;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AttendanceResponse {
    
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private LocalDate date;
    private Attendance.Period period;
    private String periodTimeSlot;
    private String subject;
    private Attendance.AttendanceStatus status;
    private String statusDisplayName;
    private String remarks;
    private String markedBy;
    private LocalDateTime markedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public AttendanceResponse(Attendance attendance) {
        this.id = attendance.getId();
        this.studentId = attendance.getStudentId();
        this.studentName = attendance.getStudentName();
        this.studentRollNumber = attendance.getStudentRollNumber();
        this.date = attendance.getDate();
        this.period = attendance.getPeriod();
        this.periodTimeSlot = attendance.getPeriod().getTimeSlot();
        this.subject = attendance.getSubject();
        this.status = attendance.getStatus();
        this.statusDisplayName = attendance.getStatus().getDisplayName();
        this.remarks = attendance.getRemarks();
        this.markedBy = attendance.getMarkedBy();
        this.markedAt = attendance.getMarkedAt();
        this.createdAt = attendance.getCreatedAt();
        this.updatedAt = attendance.getUpdatedAt();
    }
}

package com.swp.dto;

import com.swp.entity.Attendance;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class AttendanceSummaryResponse {
    
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalRecords;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private long excusedCount;
    private long medicalLeaveCount;
    private double presentPercentage;
    private double absentPercentage;
    private double latePercentage;
    private double excusedPercentage;
    private double medicalLeavePercentage;
    private Map<String, Map<Attendance.AttendanceStatus, Long>> attendanceBySubject;
    private List<AttendanceResponse> recentAttendance;
    
    public AttendanceSummaryResponse() {}
    
    public AttendanceSummaryResponse(Long studentId, String studentName, String studentRollNumber, 
                                   LocalDate startDate, LocalDate endDate) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentRollNumber = studentRollNumber;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

package com.swp.dto;

import com.swp.entity.Attendance;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AttendancePeriodResponse {
    
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private LocalDate date;
    private List<PeriodAttendance> periods;
    
    @Data
    public static class PeriodAttendance {
        private Attendance.Period period;
        private String periodTimeSlot;
        private String subject;
        private Attendance.AttendanceStatus status;
        private String statusDisplayName;
        private String remarks;
        private String markedBy;
        
        public PeriodAttendance(Attendance attendance) {
            this.period = attendance.getPeriod();
            this.periodTimeSlot = attendance.getPeriod().getTimeSlot();
            this.subject = attendance.getSubject();
            this.status = attendance.getStatus();
            this.statusDisplayName = attendance.getStatus().getDisplayName();
            this.remarks = attendance.getRemarks();
            this.markedBy = attendance.getMarkedBy();
        }
    }
}

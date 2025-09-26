package com.swp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Student is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnore
    private Student student;
    
    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;
    
    @NotNull(message = "Period is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Period period;
    
    @NotNull(message = "Subject is required")
    @Column(nullable = false)
    private String subject;
    
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;
    
    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
    
    @Column(name = "marked_by")
    private String markedBy; // Faculty member who marked the attendance
    
    @Column(name = "marked_at")
    private LocalDateTime markedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (markedAt == null) {
            markedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper method to get student ID for JSON serialization
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }
    
    // Helper method to set student by ID
    public void setStudentId(Long studentId) {
        if (studentId != null) {
            Student student = new Student();
            student.setId(studentId);
            this.student = student;
        }
    }
    
    // Helper method to get student name
    public String getStudentName() {
        return student != null ? student.getName() : null;
    }
    
    // Helper method to get student roll number
    public String getStudentRollNumber() {
        return student != null ? student.getRollNumber() : null;
    }
    
    // Enum for attendance periods
    public enum Period {
        FIRST_PERIOD("09:00-10:00"),
        SECOND_PERIOD("10:00-11:00"),
        THIRD_PERIOD("11:15-12:15"),
        FOURTH_PERIOD("12:15-13:15"),
        FIFTH_PERIOD("14:00-15:00"),
        SIXTH_PERIOD("15:00-16:00"),
        SEVENTH_PERIOD("16:15-17:15"),
        EIGHTH_PERIOD("17:15-18:15");
        
        private final String timeSlot;
        
        Period(String timeSlot) {
            this.timeSlot = timeSlot;
        }
        
        public String getTimeSlot() {
            return timeSlot;
        }
    }
    
    // Enum for attendance status
    public enum AttendanceStatus {
        PRESENT("Present"),
        ABSENT("Absent"),
        LATE("Late"),
        EXCUSED("Excused"),
        MEDICAL_LEAVE("Medical Leave");
        
        private final String displayName;
        
        AttendanceStatus(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
}

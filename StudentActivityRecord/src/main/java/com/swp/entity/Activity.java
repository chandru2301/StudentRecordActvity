package com.swp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    @NotNull(message = "Activity type is required")
    private ActivityType activityType;
    
    @Column(name = "from_date", nullable = false)
    @NotNull(message = "From date is required")
    private LocalDate fromDate;
    
    @Column(name = "to_date", nullable = false)
    @NotNull(message = "To date is required")
    private LocalDate toDate;
    
    @Column(name = "certificate_url")
    private String certificateUrl;
    
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Student is required")
    @JsonIgnore
    private Student student;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
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
}

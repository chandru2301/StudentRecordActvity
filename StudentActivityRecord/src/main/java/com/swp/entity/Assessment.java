package com.swp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "assessments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Assessment title is required")
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @NotNull(message = "Faculty is required")
    @JsonIgnore
    private Faculty faculty;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Assessment type is required")
    @Column(nullable = false)
    private AssessmentType type;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Assessment status is required")
    @Column(nullable = false)
    private AssessmentStatus status;

    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes; // null means no time limit

    @Column(name = "max_attempts")
    private Integer maxAttempts = 1; // default 1 attempt

    @Column(name = "total_marks")
    private Double totalMarks;

    @Column(name = "passing_marks")
    private Double passingMarks;

    @Column(name = "is_randomized")
    private Boolean isRandomized = false;

    @Column(name = "show_correct_answers")
    private Boolean showCorrectAnswers = false;

    @Column(name = "allow_review")
    private Boolean allowReview = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Question> questions;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<StudentAnswer> studentAnswers;

    // Helper methods for DTO mapping
    public Long getFacultyId() {
        return faculty != null ? faculty.getId() : null;
    }

    public String getFacultyName() {
        return faculty != null ? faculty.getName() : null;
    }

    public String getFacultyEmail() {
        return faculty != null ? faculty.getEmail() : null;
    }

    public enum AssessmentType {
        QUIZ("Quiz"),
        EXAM("Exam"),
        ASSIGNMENT("Assignment"),
        TEST("Test"),
        SURVEY("Survey");

        private final String displayName;

        AssessmentType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum AssessmentStatus {
        DRAFT("Draft"),
        PUBLISHED("Published"),
        ACTIVE("Active"),
        COMPLETED("Completed"),
        ARCHIVED("Archived");

        private final String displayName;

        AssessmentStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}

package com.swp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Student is required")
    @JsonIgnore
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    @NotNull(message = "Assessment is required")
    @JsonIgnore
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @NotNull(message = "Question is required")
    @JsonIgnore
    private Question question;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText; // For text-based answers

    @Column(name = "selected_option_id")
    private Long selectedOptionId; // For multiple choice questions

    @Column(name = "is_correct")
    private Boolean isCorrect; // null means not graded yet

    @Column(name = "marks_obtained")
    private Double marksObtained = 0.0;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback; // Faculty feedback

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds; // Time taken to answer this question

    @Enumerated(EnumType.STRING)
    @Column(name = "answer_status")
    private AnswerStatus answerStatus = AnswerStatus.SUBMITTED;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @Column(name = "graded_by")
    private String gradedBy; // Faculty who graded this answer

    // Helper methods for DTO mapping
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }

    public String getStudentName() {
        return student != null ? student.getName() : null;
    }

    public String getStudentRollNumber() {
        return student != null ? student.getRollNumber() : null;
    }

    public Long getAssessmentId() {
        return assessment != null ? assessment.getId() : null;
    }

    public String getAssessmentTitle() {
        return assessment != null ? assessment.getTitle() : null;
    }

    public Long getQuestionId() {
        return question != null ? question.getId() : null;
    }

    public String getQuestionText() {
        return question != null ? question.getQuestionText() : null;
    }

    public enum AnswerStatus {
        SUBMITTED("Submitted"),
        GRADED("Graded"),
        REVIEWED("Reviewed");

        private final String displayName;

        AnswerStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}

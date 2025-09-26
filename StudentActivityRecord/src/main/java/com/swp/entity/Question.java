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
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Question text is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id", nullable = false)
    @NotNull(message = "Assessment is required")
    @JsonIgnore
    private Assessment assessment;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Question type is required")
    @Column(nullable = false)
    private QuestionType type;

    @Column(name = "question_order")
    private Integer questionOrder;

    @Column(name = "marks")
    private Double marks = 1.0; // default 1 mark per question

    @Column(name = "negative_marks")
    private Double negativeMarks = 0.0; // for negative marking

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "is_required")
    private Boolean isRequired = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuestionOption> options;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<StudentAnswer> studentAnswers;

    // Helper methods for DTO mapping
    public Long getAssessmentId() {
        return assessment != null ? assessment.getId() : null;
    }

    public String getAssessmentTitle() {
        return assessment != null ? assessment.getTitle() : null;
    }

    public enum QuestionType {
        MULTIPLE_CHOICE("Multiple Choice"),
        SINGLE_CHOICE("Single Choice"),
        TRUE_FALSE("True/False"),
        SHORT_ANSWER("Short Answer"),
        ESSAY("Essay"),
        FILL_IN_BLANK("Fill in the Blank"),
        MATCHING("Matching");

        private final String displayName;

        QuestionType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}

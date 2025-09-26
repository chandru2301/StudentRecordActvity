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

@Entity
@Table(name = "question_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Option text is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String optionText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @NotNull(message = "Question is required")
    @JsonIgnore
    private Question question;

    @Column(name = "option_order")
    private Integer optionOrder;

    @Column(name = "is_correct")
    private Boolean isCorrect = false;

    @Column(name = "option_letter")
    private String optionLetter; // A, B, C, D, etc.

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Helper methods for DTO mapping
    public Long getQuestionId() {
        return question != null ? question.getId() : null;
    }

    public Long getAssessmentId() {
        return question != null && question.getAssessment() != null ? question.getAssessment().getId() : null;
    }
}

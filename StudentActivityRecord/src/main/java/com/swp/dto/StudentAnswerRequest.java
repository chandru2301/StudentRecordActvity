package com.swp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentAnswerRequest {
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    @NotNull(message = "Assessment ID is required")
    private Long assessmentId;
    
    @NotNull(message = "Question ID is required")
    private Long questionId;
    
    private String answerText; // For text-based answers
    
    private Long selectedOptionId; // For multiple choice questions
    
    private Integer timeTakenSeconds; // Time taken to answer this question
}

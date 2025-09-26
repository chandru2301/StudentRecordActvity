package com.swp.dto;

import com.swp.entity.Assessment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentRequest {
    
    @NotBlank(message = "Assessment title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Faculty ID is required")
    private Long facultyId;
    
    @NotNull(message = "Assessment type is required")
    private Assessment.AssessmentType type;
    
    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;
    
    @NotNull(message = "End date is required")
    private LocalDateTime endDate;
    
    private Integer timeLimitMinutes;
    
    private Integer maxAttempts = 1;
    
    private Double totalMarks;
    
    private Double passingMarks;
    
    private Boolean isRandomized = false;
    
    private Boolean showCorrectAnswers = false;
    
    private Boolean allowReview = true;
    
    private List<QuestionRequest> questions;
}

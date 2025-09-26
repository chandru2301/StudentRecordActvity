package com.swp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeAnswerRequest {
    
    @NotNull(message = "Student answer ID is required")
    private Long studentAnswerId;
    
    private Boolean isCorrect;
    
    private Double marksObtained;
    
    private String feedback;
    
    private String gradedBy;
}

package com.swp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionOptionRequest {
    
    @NotBlank(message = "Option text is required")
    private String optionText;
    
    private Integer optionOrder;
    
    private Boolean isCorrect = false;
    
    private String optionLetter;
}

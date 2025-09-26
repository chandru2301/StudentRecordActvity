package com.swp.dto;

import com.swp.entity.Question;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class QuestionRequest {
    
    @NotBlank(message = "Question text is required")
    private String questionText;
    
    @NotNull(message = "Question type is required")
    private Question.QuestionType type;
    
    private Integer questionOrder;
    
    private Double marks = 1.0;
    
    private Double negativeMarks = 0.0;
    
    private String explanation;
    
    private Boolean isRequired = true;
    
    private List<QuestionOptionRequest> options;
}

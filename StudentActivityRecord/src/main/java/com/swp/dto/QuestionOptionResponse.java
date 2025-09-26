package com.swp.dto;

import com.swp.entity.QuestionOption;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuestionOptionResponse {
    
    private Long id;
    private String optionText;
    private Long questionId;
    private Integer optionOrder;
    private Boolean isCorrect;
    private String optionLetter;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public QuestionOptionResponse(QuestionOption option) {
        this.id = option.getId();
        this.optionText = option.getOptionText();
        this.questionId = option.getQuestionId();
        this.optionOrder = option.getOptionOrder();
        this.isCorrect = option.getIsCorrect();
        this.optionLetter = option.getOptionLetter();
        this.createdAt = option.getCreatedAt();
        this.updatedAt = option.getUpdatedAt();
    }
}

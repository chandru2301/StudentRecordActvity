package com.swp.dto;

import com.swp.entity.Question;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuestionResponse {
    
    private Long id;
    private String questionText;
    private Long assessmentId;
    private String assessmentTitle;
    private Question.QuestionType type;
    private String typeDisplayName;
    private Integer questionOrder;
    private Double marks;
    private Double negativeMarks;
    private String explanation;
    private Boolean isRequired;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuestionOptionResponse> options;
    
    public QuestionResponse(Question question) {
        this.id = question.getId();
        this.questionText = question.getQuestionText();
        this.assessmentId = question.getAssessmentId();
        this.assessmentTitle = question.getAssessmentTitle();
        this.type = question.getType();
        this.typeDisplayName = question.getType().getDisplayName();
        this.questionOrder = question.getQuestionOrder();
        this.marks = question.getMarks();
        this.negativeMarks = question.getNegativeMarks();
        this.explanation = question.getExplanation();
        this.isRequired = question.getIsRequired();
        this.createdAt = question.getCreatedAt();
        this.updatedAt = question.getUpdatedAt();
    }
}

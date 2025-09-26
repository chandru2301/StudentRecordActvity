package com.swp.dto;

import com.swp.entity.StudentAnswer;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StudentAnswerResponse {
    
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private Long assessmentId;
    private String assessmentTitle;
    private Long questionId;
    private String questionText;
    private String answerText;
    private Long selectedOptionId;
    private Boolean isCorrect;
    private Double marksObtained;
    private String feedback;
    private Integer timeTakenSeconds;
    private StudentAnswer.AnswerStatus answerStatus;
    private String answerStatusDisplayName;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private LocalDateTime gradedAt;
    private String gradedBy;
    
    public StudentAnswerResponse(StudentAnswer studentAnswer) {
        this.id = studentAnswer.getId();
        this.studentId = studentAnswer.getStudentId();
        this.studentName = studentAnswer.getStudentName();
        this.studentRollNumber = studentAnswer.getStudentRollNumber();
        this.assessmentId = studentAnswer.getAssessmentId();
        this.assessmentTitle = studentAnswer.getAssessmentTitle();
        this.questionId = studentAnswer.getQuestionId();
        this.questionText = studentAnswer.getQuestionText();
        this.answerText = studentAnswer.getAnswerText();
        this.selectedOptionId = studentAnswer.getSelectedOptionId();
        this.isCorrect = studentAnswer.getIsCorrect();
        this.marksObtained = studentAnswer.getMarksObtained();
        this.feedback = studentAnswer.getFeedback();
        this.timeTakenSeconds = studentAnswer.getTimeTakenSeconds();
        this.answerStatus = studentAnswer.getAnswerStatus();
        this.answerStatusDisplayName = studentAnswer.getAnswerStatus().getDisplayName();
        this.submittedAt = studentAnswer.getSubmittedAt();
        this.updatedAt = studentAnswer.getUpdatedAt();
        this.gradedAt = studentAnswer.getGradedAt();
        this.gradedBy = studentAnswer.getGradedBy();
    }
}

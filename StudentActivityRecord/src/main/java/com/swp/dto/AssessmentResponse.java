package com.swp.dto;

import com.swp.entity.Assessment;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentResponse {
    
    private Long id;
    private String title;
    private String description;
    private Long facultyId;
    private String facultyName;
    private String facultyEmail;
    private Assessment.AssessmentType type;
    private String typeDisplayName;
    private Assessment.AssessmentStatus status;
    private String statusDisplayName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer timeLimitMinutes;
    private Integer maxAttempts;
    private Double totalMarks;
    private Double passingMarks;
    private Boolean isRandomized;
    private Boolean showCorrectAnswers;
    private Boolean allowReview;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuestionResponse> questions;
    private Integer totalQuestions;
    private Long totalSubmissions;
    private Long pendingGrading;
    
    public AssessmentResponse(Assessment assessment) {
        this.id = assessment.getId();
        this.title = assessment.getTitle();
        this.description = assessment.getDescription();
        this.facultyId = assessment.getFacultyId();
        this.facultyName = assessment.getFacultyName();
        this.facultyEmail = assessment.getFacultyEmail();
        this.type = assessment.getType();
        this.typeDisplayName = assessment.getType().getDisplayName();
        this.status = assessment.getStatus();
        this.statusDisplayName = assessment.getStatus().getDisplayName();
        this.startDate = assessment.getStartDate();
        this.endDate = assessment.getEndDate();
        this.timeLimitMinutes = assessment.getTimeLimitMinutes();
        this.maxAttempts = assessment.getMaxAttempts();
        this.totalMarks = assessment.getTotalMarks();
        this.passingMarks = assessment.getPassingMarks();
        this.isRandomized = assessment.getIsRandomized();
        this.showCorrectAnswers = assessment.getShowCorrectAnswers();
        this.allowReview = assessment.getAllowReview();
        this.createdAt = assessment.getCreatedAt();
        this.updatedAt = assessment.getUpdatedAt();
        this.totalQuestions = assessment.getQuestions() != null ? assessment.getQuestions().size() : 0;
    }
}

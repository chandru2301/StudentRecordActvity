package com.swp.dto;

import com.swp.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    
    private Long id;
    
    private ActivityType activityType;
    
    private LocalDate fromDate;
    
    private LocalDate toDate;
    
    private String certificateUrl;
    
    private String feedback;
    
    private Long studentId;
    
    private String studentName;
    
    private String studentEmail;
    
    private String studentClassName;
    
    private String studentDepartment;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}

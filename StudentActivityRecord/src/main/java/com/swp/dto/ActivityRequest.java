package com.swp.dto;

import com.swp.entity.ActivityType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityRequest {
    
    @NotNull(message = "Activity type is required")
    private ActivityType activityType;
    
    @NotNull(message = "From date is required")
    private LocalDate fromDate;
    
    @NotNull(message = "To date is required")
    private LocalDate toDate;
    
    private String certificateUrl;
    
    private String feedback;
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
}

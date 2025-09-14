package com.swp.controller;

import com.swp.dto.ActivityRequest;
import com.swp.dto.ActivityResponse;
import com.swp.entity.Activity;
import com.swp.entity.ActivityType;
import com.swp.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ActivityController {
    
    private final ActivityService activityService;
    
    /**
     * Create a new activity
     * @param activityRequest the activity request data
     * @return the created activity response
     */
    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody ActivityRequest activityRequest) {
        log.info("Creating new activity for student ID: {}", activityRequest.getStudentId());
        
        Activity activity = convertToEntity(activityRequest);
        Activity createdActivity = activityService.createActivity(activity);
        ActivityResponse response = convertToResponse(createdActivity);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Get all activities for a specific student
     * @param studentId the student ID
     * @return list of activities for the student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByStudent(@PathVariable Long studentId) {
        log.info("Fetching activities for student ID: {}", studentId);
        
        List<Activity> activities = activityService.getActivitiesByStudent(studentId);
        List<ActivityResponse> responses = activities.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * Get all activities
     * @return list of all activities
     */
    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getAllActivities() {
        log.info("Fetching all activities");
        
        List<Activity> activities = activityService.getAllActivities();
        List<ActivityResponse> responses = activities.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * Get activity by ID
     * @param id the activity ID
     * @return the activity response
     */
    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> getActivityById(@PathVariable Long id) {
        log.info("Fetching activity with ID: {}", id);
        
        Activity activity = activityService.getActivityById(id);
        ActivityResponse response = convertToResponse(activity);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Update an existing activity
     * @param id the activity ID
     * @param activityRequest the updated activity request data
     * @return the updated activity response
     */
    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(@PathVariable Long id, 
                                                          @Valid @RequestBody ActivityRequest activityRequest) {
        log.info("Updating activity with ID: {}", id);
        
        Activity activity = convertToEntity(activityRequest);
        Activity updatedActivity = activityService.updateActivity(id, activity);
        ActivityResponse response = convertToResponse(updatedActivity);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete an activity
     * @param id the activity ID
     * @return no content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        log.info("Deleting activity with ID: {}", id);
        
        activityService.deleteActivity(id);
        
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get activities by activity type
     * @param activityType the activity type
     * @return list of activities of the specified type
     */
    @GetMapping("/type/{activityType}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByType(@PathVariable ActivityType activityType) {
        log.info("Fetching activities by type: {}", activityType);
        
        List<Activity> activities = activityService.getActivitiesByType(activityType);
        List<ActivityResponse> responses = activities.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * Get activities within a date range
     * @param startDate the start date (format: yyyy-MM-dd)
     * @param endDate the end date (format: yyyy-MM-dd)
     * @return list of activities within the date range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByDateRange(
            @RequestParam LocalDate startDate, 
            @RequestParam LocalDate endDate) {
        log.info("Fetching activities from {} to {}", startDate, endDate);
        
        List<Activity> activities = activityService.getActivitiesByDateRange(startDate, endDate);
        List<ActivityResponse> responses = activities.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    /**
     * Count activities for a student
     * @param studentId the student ID
     * @return count of activities for the student
     */
    @GetMapping("/student/{studentId}/count")
    public ResponseEntity<Long> countActivitiesByStudent(@PathVariable Long studentId) {
        log.info("Counting activities for student ID: {}", studentId);
        
        long count = activityService.countActivitiesByStudent(studentId);
        
        return ResponseEntity.ok(count);
    }
    
    /**
     * Convert ActivityRequest to Activity entity
     * @param request the activity request
     * @return the activity entity
     */
    private Activity convertToEntity(ActivityRequest request) {
        Activity activity = new Activity();
        activity.setActivityType(request.getActivityType());
        activity.setFromDate(request.getFromDate());
        activity.setToDate(request.getToDate());
        activity.setCertificateUrl(request.getCertificateUrl());
        activity.setFeedback(request.getFeedback());
        activity.setStudentId(request.getStudentId());
        return activity;
    }
    
    /**
     * Convert Activity entity to ActivityResponse
     * @param activity the activity entity
     * @return the activity response
     */
    private ActivityResponse convertToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setActivityType(activity.getActivityType());
        response.setFromDate(activity.getFromDate());
        response.setToDate(activity.getToDate());
        response.setCertificateUrl(activity.getCertificateUrl());
        response.setFeedback(activity.getFeedback());
        response.setStudentId(activity.getStudentId());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        
        // Set student information if available
        if (activity.getStudent() != null) {
            response.setStudentName(activity.getStudent().getName());
            response.setStudentEmail(activity.getStudent().getEmail());
            response.setStudentClassName(activity.getStudent().getClassName());
            response.setStudentDepartment(activity.getStudent().getDepartment());
        }
        
        return response;
    }
}

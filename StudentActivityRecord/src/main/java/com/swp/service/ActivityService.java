package com.swp.service;

import com.swp.entity.Activity;
import com.swp.entity.Student;
import com.swp.repository.ActivityRepository;
import com.swp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    private final StudentRepository studentRepository;
    
    /**
     * Create a new activity
     * @param activity the activity to create
     * @return the created activity
     * @throws IllegalArgumentException if student is not found
     */
    public Activity createActivity(Activity activity) {
        log.info("Creating activity for student ID: {}", activity.getStudentId());
        
        // Validate student exists
        Long studentId = activity.getStudentId();
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID is required");
        }
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));
        
        activity.setStudent(student);
        
        // Validate date range
        validateDateRange(activity.getFromDate(), activity.getToDate());
        
        Activity savedActivity = activityRepository.save(activity);
        log.info("Activity created successfully with ID: {}", savedActivity.getId());
        
        return savedActivity;
    }
    
    /**
     * Get all activities for a specific student
     * @param studentId the student ID
     * @return list of activities for the student
     */
    @Transactional(readOnly = true)
    public List<Activity> getActivitiesByStudent(Long studentId) {
        log.info("Fetching activities for student ID: {}", studentId);
        
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID is required");
        }
        
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        
        List<Activity> activities = activityRepository.findByStudentId(studentId);
        log.info("Found {} activities for student ID: {}", activities.size(), studentId);
        
        return activities;
    }
    
    /**
     * Get all activities
     * @return list of all activities
     */
    @Transactional(readOnly = true)
    public List<Activity> getAllActivities() {
        log.info("Fetching all activities");
        List<Activity> activities = activityRepository.findAll();
        log.info("Found {} total activities", activities.size());
        return activities;
    }
    
    /**
     * Update an existing activity
     * @param id the activity ID
     * @param updatedActivity the updated activity data
     * @return the updated activity
     * @throws IllegalArgumentException if activity or student is not found
     */
    public Activity updateActivity(Long id, Activity updatedActivity) {
        log.info("Updating activity with ID: {}", id);
        
        Activity existingActivity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found with ID: " + id));
        
        // Validate student exists if student ID is provided
        if (updatedActivity.getStudentId() != null) {
            Student student = studentRepository.findById(updatedActivity.getStudentId())
                    .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + updatedActivity.getStudentId()));
            existingActivity.setStudent(student);
        }
        
        // Update fields
        if (updatedActivity.getActivityType() != null) {
            existingActivity.setActivityType(updatedActivity.getActivityType());
        }
        if (updatedActivity.getFromDate() != null) {
            existingActivity.setFromDate(updatedActivity.getFromDate());
        }
        if (updatedActivity.getToDate() != null) {
            existingActivity.setToDate(updatedActivity.getToDate());
        }
        if (updatedActivity.getCertificateUrl() != null) {
            existingActivity.setCertificateUrl(updatedActivity.getCertificateUrl());
        }
        if (updatedActivity.getFeedback() != null) {
            existingActivity.setFeedback(updatedActivity.getFeedback());
        }
        
        // Validate date range
        validateDateRange(existingActivity.getFromDate(), existingActivity.getToDate());
        
        Activity savedActivity = activityRepository.save(existingActivity);
        log.info("Activity updated successfully with ID: {}", savedActivity.getId());
        
        return savedActivity;
    }
    
    /**
     * Delete an activity
     * @param id the activity ID
     * @throws IllegalArgumentException if activity is not found
     */
    public void deleteActivity(Long id) {
        log.info("Deleting activity with ID: {}", id);
        
        if (!activityRepository.existsById(id)) {
            throw new IllegalArgumentException("Activity not found with ID: " + id);
        }
        
        activityRepository.deleteById(id);
        log.info("Activity deleted successfully with ID: {}", id);
    }
    
    /**
     * Get activity by ID
     * @param id the activity ID
     * @return the activity if found
     * @throws IllegalArgumentException if activity is not found
     */
    @Transactional(readOnly = true)
    public Activity getActivityById(Long id) {
        log.info("Fetching activity with ID: {}", id);
        
        return activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found with ID: " + id));
    }
    
    /**
     * Get activities by activity type
     * @param activityType the activity type
     * @return list of activities of the specified type
     */
    @Transactional(readOnly = true)
    public List<Activity> getActivitiesByType(com.swp.entity.ActivityType activityType) {
        log.info("Fetching activities by type: {}", activityType);
        return activityRepository.findByActivityType(activityType);
    }
    
    /**
     * Get activities within a date range
     * @param startDate the start date
     * @param endDate the end date
     * @return list of activities within the date range
     */
    @Transactional(readOnly = true)
    public List<Activity> getActivitiesByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching activities from {} to {}", startDate, endDate);
        validateDateRange(startDate, endDate);
        return activityRepository.findByDateRange(startDate, endDate);
    }
    
    /**
     * Count activities for a student
     * @param studentId the student ID
     * @return count of activities for the student
     */
    @Transactional(readOnly = true)
    public long countActivitiesByStudent(Long studentId) {
        log.info("Counting activities for student ID: {}", studentId);
        return activityRepository.countByStudentId(studentId);
    }
    
    /**
     * Validate date range
     * @param fromDate the start date
     * @param toDate the end date
     * @throws IllegalArgumentException if date range is invalid
     */
    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate == null || toDate == null) {
            throw new IllegalArgumentException("Both from date and to date are required");
        }
        
        if (fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException("From date cannot be after to date");
        }
        
        if (fromDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("From date cannot be in the future");
        }
    }
}

package com.swp.repository;

import com.swp.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    /**
     * Find all activities for a specific student
     * @param studentId the ID of the student
     * @return list of activities for the student
     */
    @Query("SELECT a FROM Activity a WHERE a.student.id = :studentId ORDER BY a.fromDate DESC")
    List<Activity> findByStudentId(@Param("studentId") Long studentId);
    
    /**
     * Find all activities for a specific student using Spring Data JPA naming convention
     * @param student the student entity
     * @return list of activities for the student
     */
    List<Activity> findByStudentOrderByFromDateDesc(com.swp.entity.Student student);
    
    /**
     * Find activities by activity type
     * @param activityType the type of activity
     * @return list of activities of the specified type
     */
    List<Activity> findByActivityType(com.swp.entity.ActivityType activityType);
    
    /**
     * Find activities within a date range
     * @param startDate the start date
     * @param endDate the end date
     * @return list of activities within the date range
     */
    @Query("SELECT a FROM Activity a WHERE a.fromDate >= :startDate AND a.toDate <= :endDate ORDER BY a.fromDate DESC")
    List<Activity> findByDateRange(@Param("startDate") java.time.LocalDate startDate, 
                                   @Param("endDate") java.time.LocalDate endDate);
    
    /**
     * Count activities by student
     * @param studentId the ID of the student
     * @return count of activities for the student
     */
    @Query("SELECT COUNT(a) FROM Activity a WHERE a.student.id = :studentId")
    long countByStudentId(@Param("studentId") Long studentId);
}

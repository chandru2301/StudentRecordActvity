package com.swp.repository;

import com.swp.entity.StudentParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentParticipantRepository extends JpaRepository<StudentParticipant, Long> {
    
    // Find participants by event ID
    List<StudentParticipant> findByEventId(Long eventId);
    
    // Find participants by department
    List<StudentParticipant> findByDepartment(String department);
    
    // Find participants by class name
    List<StudentParticipant> findByClassName(String className);
    
    // Find participants by name (case insensitive)
    @Query("SELECT p FROM StudentParticipant p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<StudentParticipant> findByNameContainingIgnoreCase(@Param("name") String name);
    
    // Count participants by event
    Long countByEventId(Long eventId);
    
    // Count participants by department
    Long countByDepartment(String department);
    
    // Find participants by event and department
    @Query("SELECT p FROM StudentParticipant p WHERE p.event.id = :eventId AND p.department = :department")
    List<StudentParticipant> findByEventIdAndDepartment(@Param("eventId") Long eventId, @Param("department") String department);
    
    // Delete participants by event ID
    void deleteByEventId(Long eventId);
}

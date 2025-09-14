package com.swp.repository;

import com.swp.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find events by event type
    List<Event> findByEventType(com.swp.entity.EventType eventType);
    
    // Find events within a date range
    @Query("SELECT e FROM Event e WHERE e.fromDate >= :startDate AND e.toDate <= :endDate")
    List<Event> findEventsInDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Find events by participant count
    @Query("SELECT e FROM Event e WHERE SIZE(e.participants) >= :minParticipants")
    List<Event> findEventsWithMinParticipants(@Param("minParticipants") int minParticipants);
    
    // Find events by department
    @Query("SELECT DISTINCT e FROM Event e JOIN e.participants p WHERE p.department = :department")
    List<Event> findEventsByDepartment(@Param("department") String department);
    
    // Count total participants for an event
    @Query("SELECT COUNT(p) FROM StudentParticipant p WHERE p.event.id = :eventId")
    Long countParticipantsByEventId(@Param("eventId") Long eventId);
}

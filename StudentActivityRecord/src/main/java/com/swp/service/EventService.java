package com.swp.service;

import com.swp.dto.EventRequest;
import com.swp.dto.EventResponse;
import com.swp.dto.ParticipantRequest;
import com.swp.dto.ParticipantResponse;
import com.swp.entity.Event;
import com.swp.entity.EventType;
import com.swp.entity.StudentParticipant;
import com.swp.repository.EventRepository;
import com.swp.repository.StudentParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private StudentParticipantRepository participantRepository;
    
    /**
     * Create a new event with participants
     */
    public EventResponse createEvent(EventRequest eventRequest) {
        // Validate dates
        if (eventRequest.getFromDate().isAfter(eventRequest.getToDate())) {
            throw new IllegalArgumentException("From date cannot be after to date");
        }
        
        // Create event entity
        Event event = new Event();
        event.setEventType(eventRequest.getEventType());
        event.setFromDate(eventRequest.getFromDate());
        event.setToDate(eventRequest.getToDate());
        
        // Save event first to get the ID
        Event savedEvent = eventRepository.save(event);
        
        // Create and save participants
        List<StudentParticipant> participants = eventRequest.getParticipants().stream()
                .map(participantRequest -> {
                    StudentParticipant participant = new StudentParticipant();
                    participant.setName(participantRequest.getName());
                    participant.setClassName(participantRequest.getClassName());
                    participant.setDepartment(participantRequest.getDepartment());
                    participant.setEvent(savedEvent);
                    return participantRepository.save(participant);
                })
                .collect(Collectors.toList());
        
        savedEvent.setParticipants(participants);
        
        return convertToEventResponse(savedEvent);
    }
    
    /**
     * Get all events
     */
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get event by ID
     */
    @Transactional(readOnly = true)
    public Optional<EventResponse> getEventById(Long id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.map(this::convertToEventResponse);
    }
    
    /**
     * Delete event by ID
     */
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new IllegalArgumentException("Event with ID " + id + " not found");
        }
        
        // Delete participants first (due to foreign key constraint)
        participantRepository.deleteByEventId(id);
        
        // Delete event
        eventRepository.deleteById(id);
    }
    
    /**
     * Get events by type
     */
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByType(EventType eventType) {
        List<Event> events = eventRepository.findByEventType(eventType);
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get events in date range
     */
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsInDateRange(LocalDate startDate, LocalDate endDate) {
        List<Event> events = eventRepository.findEventsInDateRange(startDate, endDate);
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get events by department
     */
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByDepartment(String department) {
        List<Event> events = eventRepository.findEventsByDepartment(department);
        return events.stream()
                .map(this::convertToEventResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert Event entity to EventResponse DTO
     */
    private EventResponse convertToEventResponse(Event event) {
        List<ParticipantResponse> participantResponses = event.getParticipants().stream()
                .map(participant -> new ParticipantResponse(
                        participant.getId(),
                        participant.getName(),
                        participant.getClassName(),
                        participant.getDepartment()
                ))
                .collect(Collectors.toList());
        
        return new EventResponse(
                event.getId(),
                event.getEventType(),
                event.getFromDate(),
                event.getToDate(),
                participantResponses
        );
    }
}

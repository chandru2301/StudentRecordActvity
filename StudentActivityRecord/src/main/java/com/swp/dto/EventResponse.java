package com.swp.dto;

import com.swp.entity.EventType;
import java.time.LocalDate;
import java.util.List;

public class EventResponse {
    
    private Long id;
    private EventType eventType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private List<ParticipantResponse> participants;
    
    // Constructors
    public EventResponse() {}
    
    public EventResponse(Long id, EventType eventType, LocalDate fromDate, LocalDate toDate, List<ParticipantResponse> participants) {
        this.id = id;
        this.eventType = eventType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.participants = participants;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public EventType getEventType() {
        return eventType;
    }
    
    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }
    
    public LocalDate getFromDate() {
        return fromDate;
    }
    
    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }
    
    public LocalDate getToDate() {
        return toDate;
    }
    
    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }
    
    public List<ParticipantResponse> getParticipants() {
        return participants;
    }
    
    public void setParticipants(List<ParticipantResponse> participants) {
        this.participants = participants;
    }
}

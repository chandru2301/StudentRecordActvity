package com.swp.dto;

import com.swp.entity.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public class EventRequest {
    
    @NotNull(message = "Event type is required")
    private EventType eventType;
    
    @NotNull(message = "From date is required")
    private LocalDate fromDate;
    
    @NotNull(message = "To date is required")
    private LocalDate toDate;
    
    @NotNull(message = "Participants list is required")
    @Size(min = 1, message = "At least one participant is required")
    private List<ParticipantRequest> participants;
    
    // Constructors
    public EventRequest() {}
    
    public EventRequest(EventType eventType, LocalDate fromDate, LocalDate toDate, List<ParticipantRequest> participants) {
        this.eventType = eventType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.participants = participants;
    }
    
    // Getters and Setters
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
    
    public List<ParticipantRequest> getParticipants() {
        return participants;
    }
    
    public void setParticipants(List<ParticipantRequest> participants) {
        this.participants = participants;
    }
}

package com.swp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;
    
    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;
    
    @Column(name = "to_date", nullable = false)
    private LocalDate toDate;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentParticipant> participants = new ArrayList<>();
    
    // Constructors
    public Event() {}
    
    public Event(EventType eventType, LocalDate fromDate, LocalDate toDate) {
        this.eventType = eventType;
        this.fromDate = fromDate;
        this.toDate = toDate;
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
    
    public List<StudentParticipant> getParticipants() {
        return participants;
    }
    
    public void setParticipants(List<StudentParticipant> participants) {
        this.participants = participants;
    }
    
    // Helper methods
    public void addParticipant(StudentParticipant participant) {
        participants.add(participant);
        participant.setEvent(this);
    }
    
    public void removeParticipant(StudentParticipant participant) {
        participants.remove(participant);
        participant.setEvent(null);
    }
    
    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", eventType=" + eventType +
                ", fromDate=" + fromDate +
                ", toDate=" + toDate +
                ", participantsCount=" + participants.size() +
                '}';
    }
}

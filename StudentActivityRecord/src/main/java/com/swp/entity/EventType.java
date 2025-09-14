package com.swp.entity;

public enum EventType {
    ACADEMIC("Academic Event"),
    CULTURAL("Cultural Event"),
    SPORTS("Sports Event");
    
    private final String displayName;
    
    EventType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

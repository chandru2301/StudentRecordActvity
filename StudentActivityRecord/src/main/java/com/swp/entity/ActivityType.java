package com.swp.entity;

public enum ActivityType {
    HACKATHON("Hackathon"),
    INTER_COLLEGE("Inter College"),
    OUTER_COLLEGE("Outer College"),
    GOVERNMENT_EVENT("Government Event");
    
    private final String displayName;
    
    ActivityType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}

package com.swp.dto;

public class ParticipantResponse {
    
    private Long id;
    private String name;
    private String className;
    private String department;
    
    // Constructors
    public ParticipantResponse() {}
    
    public ParticipantResponse(Long id, String name, String className, String department) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.department = department;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getClassName() {
        return className;
    }
    
    public void setClassName(String className) {
        this.className = className;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
}

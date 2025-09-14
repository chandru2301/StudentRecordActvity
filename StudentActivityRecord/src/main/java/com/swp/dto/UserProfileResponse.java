package com.swp.dto;

import com.swp.entity.Faculty;
import com.swp.entity.Student;
import com.swp.entity.User;
import lombok.Data;

@Data
public class UserProfileResponse {
    
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String role;
    private Object profile;
    
    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole().name();
        
        // Note: Profile will be set separately to avoid circular references
        this.profile = null;
    }
    
    public UserProfileResponse(User user, Student student, Faculty faculty) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole().name();
        
        // Set profile based on role
        if (user.getRole() == User.Role.STUDENT && student != null) {
            this.profile = student;
        } else if (user.getRole() == User.Role.FACULTY && faculty != null) {
            this.profile = faculty;
        }
    }
}

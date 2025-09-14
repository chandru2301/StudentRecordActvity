package com.swp.dto;

import com.swp.entity.Faculty;
import com.swp.entity.Student;
import com.swp.entity.User;
import lombok.Data;

@Data
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String role;
    private Object profile;
    
    public AuthResponse(String token, User user, Student student, Faculty faculty) {
        this.token = token;
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        
        // Set profile based on role
        if (user.getRole() == User.Role.STUDENT && student != null) {
            this.profile = student;
        } else if (user.getRole() == User.Role.FACULTY && faculty != null) {
            this.profile = faculty;
        }
    }
}

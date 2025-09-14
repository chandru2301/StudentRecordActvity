package com.swp.dto;

import com.swp.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    
    // Common fields
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
    private String phoneNumber;
    
    @NotNull(message = "Role is required")
    private User.Role role;
    
    // Student specific fields
    private String name;
    private String degree;
    private LocalDate dob;
    private String rollNumber;
    private StudentType type;
    
    // Faculty specific fields
    private String department;
    
    public enum StudentType {
        HOSTELLER, DAY_SCHOLAR
    }
}

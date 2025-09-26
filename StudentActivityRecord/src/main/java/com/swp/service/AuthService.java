package com.swp.service;

import com.swp.dto.AuthResponse;
import com.swp.dto.LoginRequest;
import com.swp.dto.RegisterRequest;
import com.swp.dto.UserProfileResponse;
import com.swp.entity.Faculty;
import com.swp.entity.Student;
import com.swp.entity.User;
import com.swp.repository.FacultyRepository;
import com.swp.repository.StudentRepository;
import com.swp.repository.UserRepository;
import com.swp.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate captcha (simplified - in production, use proper captcha service)
        // For now, we'll skip captcha validation in the service
        
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        
        User savedUser = userRepository.save(user);
        
        // Create profile based on role
        Student student = null;
        Faculty faculty = null;
        
        if (request.getRole() == User.Role.STUDENT) {
            student = createStudentProfile(savedUser, request);
        } else if (request.getRole() == User.Role.FACULTY) {
            faculty = createFacultyProfile(savedUser, request);
        }
        
        // Generate JWT token
        String token = jwtUtil.generateTokenFromUsername(savedUser.getUsername());
        
        return new AuthResponse(token, savedUser, student, faculty);
    }
    
    public AuthResponse login(LoginRequest request) {
        // Validate captcha (simplified - in production, use proper captcha service)
        // For now, we'll skip captcha validation in the service
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateJwtToken(authentication);
        
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get profile data
        Student student = null;
        Faculty faculty = null;
        
        if (user.getRole() == User.Role.STUDENT) {
            student = studentRepository.findByUser_Id(user.getId()).orElse(null);
        } else if (user.getRole() == User.Role.FACULTY) {
            faculty = facultyRepository.findByUser_Id(user.getId()).orElse(null);
        }
        
        return new AuthResponse(token, user, student, faculty);
    }
    
    public UserProfileResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get profile data
        Student student = null;
        Faculty faculty = null;
        
        if (user.getRole() == User.Role.STUDENT) {
            student = studentRepository.findByUser_Id(user.getId()).orElse(null);
        } else if (user.getRole() == User.Role.FACULTY) {
            faculty = facultyRepository.findByUser_Id(user.getId()).orElse(null);
        }
        
        return new UserProfileResponse(user, student, faculty);
    }
    
    private Student createStudentProfile(User user, RegisterRequest request) {
        // Check if roll number already exists
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new RuntimeException("Roll number is already taken!");
        }
        
        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setDegree(request.getDegree());
        student.setClassName(request.getClassName());
        student.setDepartment(request.getDepartment());
        student.setDob(request.getDob());
        student.setRollNumber(request.getRollNumber());
        student.setType(Student.StudentType.valueOf(request.getType().name()));
        student.setUser(user);
        
        return studentRepository.save(student);
    }
    
    private Faculty createFacultyProfile(User user, RegisterRequest request) {
        Faculty faculty = new Faculty();
        faculty.setName(request.getName());
        faculty.setEmail(request.getEmail());
        faculty.setPhoneNumber(request.getPhoneNumber());
        faculty.setDepartment(request.getDepartment());
        faculty.setUser(user);
        
        return facultyRepository.save(faculty);
    }
    
    private boolean isValidCaptcha(String captcha) {
        // Simplified captcha validation - in production, integrate with proper captcha service
        return captcha != null && captcha.length() >= 4;
    }
}

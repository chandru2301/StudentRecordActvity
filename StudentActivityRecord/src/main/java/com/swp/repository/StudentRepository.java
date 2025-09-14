package com.swp.repository;

import com.swp.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByEmail(String email);
    
    Optional<Student> findByRollNumber(String rollNumber);
    
    Optional<Student> findByUser_Id(Long userId);
    
    boolean existsByEmail(String email);
    
    boolean existsByRollNumber(String rollNumber);
}

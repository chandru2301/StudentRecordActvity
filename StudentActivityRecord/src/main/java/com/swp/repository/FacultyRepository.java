package com.swp.repository;

import com.swp.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    
    Optional<Faculty> findByEmail(String email);
    
    Optional<Faculty> findByUser_Id(Long userId);
    
    boolean existsByEmail(String email);
}

package com.swp.repository;

import com.swp.entity.Assessment;
import com.swp.entity.Assessment.AssessmentStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    // Find assessments by faculty
    List<Assessment> findByFaculty_Id(Long facultyId);
    Page<Assessment> findByFaculty_Id(Long facultyId, Pageable pageable);
    List<Assessment> findByFaculty_IdOrderByCreatedAtDesc(Long facultyId);
    
    // Find assessments by status
    List<Assessment> findByStatus(Assessment.AssessmentStatus status);
    Page<Assessment> findByStatus(Assessment.AssessmentStatus status, Pageable pageable);
    
    // Find assessments by faculty and status
    List<Assessment> findByFaculty_IdAndStatus(Long facultyId, Assessment.AssessmentStatus status);
    
    // Find assessments by type
    List<Assessment> findByType(Assessment.AssessmentType type);
    List<Assessment> findByFaculty_IdAndType(Long facultyId, Assessment.AssessmentType type);
    
    // Find active assessments (available for students to take)
    @Query("SELECT a FROM Assessment a WHERE a.status = 'ACTIVE' AND a.startDate <= :currentTime AND a.endDate >= :currentTime")
    List<Assessment> findActiveAssessments(@Param("currentTime") LocalDateTime currentTime);
    
    // Find assessments within date range
    List<Assessment> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Assessment> findByFaculty_IdAndStartDateBetween(Long facultyId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find assessments by title (search)
    List<Assessment> findByTitleContainingIgnoreCase(String title);
    List<Assessment> findByFaculty_IdAndTitleContainingIgnoreCase(Long facultyId, String title);
    
    // Count assessments by faculty
    long countByFaculty_Id(Long facultyId);
    long countByFaculty_IdAndStatus(Long facultyId, Assessment.AssessmentStatus status);
    
    // Find assessments with questions
    @Query("SELECT a FROM Assessment a LEFT JOIN FETCH a.questions WHERE a.id = :assessmentId")
    Optional<Assessment> findByIdWithQuestions(@Param("assessmentId") Long assessmentId);
    
    // Find assessments with student answers
    @Query("SELECT a FROM Assessment a LEFT JOIN FETCH a.studentAnswers WHERE a.id = :assessmentId")
    Optional<Assessment> findByIdWithStudentAnswers(@Param("assessmentId") Long assessmentId);
    
    // Find assessments that need grading
    @Query("SELECT DISTINCT a FROM Assessment a JOIN a.studentAnswers sa WHERE a.faculty.id = :facultyId AND sa.answerStatus = 'SUBMITTED'")
    List<Assessment> findAssessmentsNeedingGrading(@Param("facultyId") Long facultyId);
    
    // Find recent assessments
    @Query("SELECT a FROM Assessment a WHERE a.faculty.id = :facultyId ORDER BY a.createdAt DESC")
    Page<Assessment> findRecentAssessments(@Param("facultyId") Long facultyId, Pageable pageable);
    
    // Find assessments by student participation
    @Query("SELECT DISTINCT a FROM Assessment a JOIN a.studentAnswers sa WHERE sa.student.id = :studentId")
    List<Assessment> findAssessmentsByStudentParticipation(@Param("studentId") Long studentId);
    
    // Find all active assessments (regardless of time)
    List<Assessment> findByStatusOrderByCreatedAtDesc(AssessmentStatus status);
    
    // Find available assessments for student (all active assessments within time range)
    @Query("SELECT a FROM Assessment a WHERE a.status = 'ACTIVE' AND a.startDate <= :currentTime AND a.endDate >= :currentTime")
    List<Assessment> findAvailableAssessmentsForStudent(@Param("currentTime") LocalDateTime currentTime);
    
    // Find assessments that student has already attempted
    @Query("SELECT DISTINCT a FROM Assessment a JOIN a.studentAnswers sa WHERE sa.student.id = :studentId")
    List<Assessment> findAssessmentsAttemptedByStudent(@Param("studentId") Long studentId);
}

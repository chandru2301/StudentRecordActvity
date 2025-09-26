package com.swp.repository;

import com.swp.entity.StudentAnswer;
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
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    
    // Find answers by student
    List<StudentAnswer> findByStudent_Id(Long studentId);
    Page<StudentAnswer> findByStudent_Id(Long studentId, Pageable pageable);
    List<StudentAnswer> findByStudent_IdOrderBySubmittedAtDesc(Long studentId);
    
    // Find answers by assessment
    List<StudentAnswer> findByAssessment_Id(Long assessmentId);
    List<StudentAnswer> findByAssessment_IdOrderBySubmittedAtDesc(Long assessmentId);
    
    // Find answers by question
    List<StudentAnswer> findByQuestion_Id(Long questionId);
    
    // Find answers by student and assessment
    List<StudentAnswer> findByStudent_IdAndAssessment_Id(Long studentId, Long assessmentId);
    List<StudentAnswer> findByStudent_IdAndAssessment_IdOrderBySubmittedAtDesc(Long studentId, Long assessmentId);
    
    // Find answers by student and question
    Optional<StudentAnswer> findByStudent_IdAndQuestion_Id(Long studentId, Long questionId);
    
    // Find answers by status
    List<StudentAnswer> findByAnswerStatus(StudentAnswer.AnswerStatus answerStatus);
    List<StudentAnswer> findByAssessment_IdAndAnswerStatus(Long assessmentId, StudentAnswer.AnswerStatus answerStatus);
    
    // Find answers that need grading
    List<StudentAnswer> findByAnswerStatusOrderBySubmittedAtAsc(StudentAnswer.AnswerStatus answerStatus);
    List<StudentAnswer> findByAssessment_IdAndAnswerStatusOrderBySubmittedAtAsc(Long assessmentId, StudentAnswer.AnswerStatus answerStatus);
    
    // Find answers by faculty (through assessment)
    @Query("SELECT sa FROM StudentAnswer sa JOIN sa.assessment a WHERE a.faculty.id = :facultyId")
    List<StudentAnswer> findByFacultyId(@Param("facultyId") Long facultyId);
    
    @Query("SELECT sa FROM StudentAnswer sa JOIN sa.assessment a WHERE a.faculty.id = :facultyId AND sa.answerStatus = :status")
    List<StudentAnswer> findByFacultyIdAndStatus(@Param("facultyId") Long facultyId, @Param("status") StudentAnswer.AnswerStatus status);
    
    // Find answers submitted within date range
    List<StudentAnswer> findBySubmittedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<StudentAnswer> findByStudent_IdAndSubmittedAtBetween(Long studentId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find answers by marks
    List<StudentAnswer> findByMarksObtainedGreaterThan(Double marks);
    List<StudentAnswer> findByMarksObtainedLessThan(Double marks);
    List<StudentAnswer> findByMarksObtainedBetween(Double minMarks, Double maxMarks);
    
    // Find correct/incorrect answers
    List<StudentAnswer> findByIsCorrectTrue();
    List<StudentAnswer> findByIsCorrectFalse();
    List<StudentAnswer> findByStudent_IdAndIsCorrectTrue(Long studentId);
    List<StudentAnswer> findByAssessment_IdAndIsCorrectTrue(Long assessmentId);
    
    // Count answers
    long countByStudent_Id(Long studentId);
    long countByAssessment_Id(Long assessmentId);
    long countByStudent_IdAndAssessment_Id(Long studentId, Long assessmentId);
    long countByAnswerStatus(StudentAnswer.AnswerStatus answerStatus);
    long countByAssessment_IdAndAnswerStatus(Long assessmentId, StudentAnswer.AnswerStatus answerStatus);
    
    // Find latest answer by student and assessment
    @Query("SELECT sa FROM StudentAnswer sa WHERE sa.student.id = :studentId AND sa.assessment.id = :assessmentId ORDER BY sa.submittedAt DESC")
    List<StudentAnswer> findLatestByStudentAndAssessment(@Param("studentId") Long studentId, @Param("assessmentId") Long assessmentId);
    
    // Find answers by selected option
    List<StudentAnswer> findBySelectedOptionId(Long selectedOptionId);
    
    // Find answers with feedback
    List<StudentAnswer> findByFeedbackIsNotNull();
    List<StudentAnswer> findByStudent_IdAndFeedbackIsNotNull(Long studentId);
    
    // Find answers graded by specific faculty
    List<StudentAnswer> findByGradedBy(String gradedBy);
    List<StudentAnswer> findByAssessment_IdAndGradedBy(Long assessmentId, String gradedBy);
    
    // Find answers graded within date range
    List<StudentAnswer> findByGradedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Statistics queries
    @Query("SELECT AVG(sa.marksObtained) FROM StudentAnswer sa WHERE sa.assessment.id = :assessmentId AND sa.marksObtained IS NOT NULL")
    Double getAverageMarksByAssessment(@Param("assessmentId") Long assessmentId);
    
    @Query("SELECT COUNT(sa) FROM StudentAnswer sa WHERE sa.assessment.id = :assessmentId AND sa.isCorrect = true")
    Long getCorrectAnswersCountByAssessment(@Param("assessmentId") Long assessmentId);
    
    @Query("SELECT COUNT(sa) FROM StudentAnswer sa WHERE sa.assessment.id = :assessmentId")
    Long getTotalAnswersCountByAssessment(@Param("assessmentId") Long assessmentId);
}

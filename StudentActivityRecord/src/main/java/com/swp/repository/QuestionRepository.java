package com.swp.repository;

import com.swp.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    // Find questions by assessment
    List<Question> findByAssessment_Id(Long assessmentId);
    List<Question> findByAssessment_IdOrderByQuestionOrderAsc(Long assessmentId);
    
    // Find questions by type
    List<Question> findByType(Question.QuestionType type);
    List<Question> findByAssessment_IdAndType(Long assessmentId, Question.QuestionType type);
    
    // Find questions with options
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.options WHERE q.id = :questionId")
    Optional<Question> findByIdWithOptions(@Param("questionId") Long questionId);
    
    // Find questions by assessment with options
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.options WHERE q.assessment.id = :assessmentId ORDER BY q.questionOrder ASC")
    List<Question> findByAssessmentIdWithOptions(@Param("assessmentId") Long assessmentId);
    
    // Find questions by assessment with student answers
    @Query("SELECT q FROM Question q LEFT JOIN FETCH q.studentAnswers WHERE q.assessment.id = :assessmentId")
    List<Question> findByAssessmentIdWithStudentAnswers(@Param("assessmentId") Long assessmentId);
    
    // Count questions by assessment
    long countByAssessment_Id(Long assessmentId);
    
    // Find questions by assessment and order
    List<Question> findByAssessment_IdAndQuestionOrderBetween(Long assessmentId, Integer startOrder, Integer endOrder);
    
    // Find questions that need grading
    @Query("SELECT DISTINCT q FROM Question q JOIN q.studentAnswers sa WHERE q.assessment.id = :assessmentId AND sa.answerStatus = 'SUBMITTED'")
    List<Question> findQuestionsNeedingGrading(@Param("assessmentId") Long assessmentId);
    
    // Find questions by student answers
    @Query("SELECT q FROM Question q JOIN q.studentAnswers sa WHERE sa.student.id = :studentId AND sa.assessment.id = :assessmentId")
    List<Question> findQuestionsByStudentAnswers(@Param("studentId") Long studentId, @Param("assessmentId") Long assessmentId);
    
    // Find questions with correct options
    @Query("SELECT q FROM Question q JOIN q.options o WHERE q.assessment.id = :assessmentId AND o.isCorrect = true")
    List<Question> findQuestionsWithCorrectOptions(@Param("assessmentId") Long assessmentId);
}

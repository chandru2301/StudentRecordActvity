package com.swp.repository;

import com.swp.entity.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
    
    // Find options by question
    List<QuestionOption> findByQuestion_Id(Long questionId);
    List<QuestionOption> findByQuestion_IdOrderByOptionOrderAsc(Long questionId);
    
    // Find correct options
    List<QuestionOption> findByIsCorrectTrue();
    List<QuestionOption> findByQuestion_IdAndIsCorrectTrue(Long questionId);
    
    // Find options by question and order
    List<QuestionOption> findByQuestion_IdAndOptionOrderBetween(Long questionId, Integer startOrder, Integer endOrder);
    
    // Count options by question
    long countByQuestion_Id(Long questionId);
    
    // Find options by assessment
    @Query("SELECT o FROM QuestionOption o JOIN o.question q WHERE q.assessment.id = :assessmentId")
    List<QuestionOption> findByAssessmentId(@Param("assessmentId") Long assessmentId);
    
    // Find correct options by assessment
    @Query("SELECT o FROM QuestionOption o JOIN o.question q WHERE q.assessment.id = :assessmentId AND o.isCorrect = true")
    List<QuestionOption> findCorrectOptionsByAssessmentId(@Param("assessmentId") Long assessmentId);
    
    // Find options by question type
    @Query("SELECT o FROM QuestionOption o JOIN o.question q WHERE q.type = :questionType")
    List<QuestionOption> findByQuestionType(@Param("questionType") com.swp.entity.Question.QuestionType questionType);
    
    // Find options by option letter
    List<QuestionOption> findByOptionLetter(String optionLetter);
    List<QuestionOption> findByQuestion_IdAndOptionLetter(Long questionId, String optionLetter);
}

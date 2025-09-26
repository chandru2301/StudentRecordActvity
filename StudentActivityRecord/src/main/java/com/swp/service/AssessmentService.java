package com.swp.service;

import com.swp.dto.*;
import com.swp.entity.*;
import com.swp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AssessmentService {
    
    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    
    /**
     * Create a new assessment with questions
     */
    public AssessmentResponse createAssessment(AssessmentRequest request) {
        log.info("Creating new assessment: {}", request.getTitle());
        
        // Validate faculty exists
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new IllegalArgumentException("Faculty not found with ID: " + request.getFacultyId()));
        
        // Create assessment
        Assessment assessment = new Assessment();
        assessment.setTitle(request.getTitle());
        assessment.setDescription(request.getDescription());
        assessment.setFaculty(faculty);
        assessment.setType(request.getType());
        assessment.setStatus(Assessment.AssessmentStatus.DRAFT);
        assessment.setStartDate(request.getStartDate());
        assessment.setEndDate(request.getEndDate());
        assessment.setTimeLimitMinutes(request.getTimeLimitMinutes());
        assessment.setMaxAttempts(request.getMaxAttempts());
        assessment.setTotalMarks(request.getTotalMarks());
        assessment.setPassingMarks(request.getPassingMarks());
        assessment.setIsRandomized(request.getIsRandomized());
        assessment.setShowCorrectAnswers(request.getShowCorrectAnswers());
        assessment.setAllowReview(request.getAllowReview());
        
        Assessment savedAssessment = assessmentRepository.save(assessment);
        
        // Create questions and options
        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            createQuestionsForAssessment(savedAssessment, request.getQuestions());
        }
        
        log.info("Assessment created successfully with ID: {}", savedAssessment.getId());
        return new AssessmentResponse(savedAssessment);
    }
    
    /**
     * Create questions for an assessment
     */
    private void createQuestionsForAssessment(Assessment assessment, List<QuestionRequest> questionRequests) {
        for (int i = 0; i < questionRequests.size(); i++) {
            QuestionRequest questionRequest = questionRequests.get(i);
            
            Question question = new Question();
            question.setQuestionText(questionRequest.getQuestionText());
            question.setAssessment(assessment);
            question.setType(questionRequest.getType());
            question.setQuestionOrder(questionRequest.getQuestionOrder() != null ? questionRequest.getQuestionOrder() : i + 1);
            question.setMarks(questionRequest.getMarks());
            question.setNegativeMarks(questionRequest.getNegativeMarks());
            question.setExplanation(questionRequest.getExplanation());
            question.setIsRequired(questionRequest.getIsRequired());
            
            Question savedQuestion = questionRepository.save(question);
            
            // Create options for the question
            if (questionRequest.getOptions() != null && !questionRequest.getOptions().isEmpty()) {
                createOptionsForQuestion(savedQuestion, questionRequest.getOptions());
            }
        }
    }
    
    /**
     * Create options for a question
     */
    private void createOptionsForQuestion(Question question, List<QuestionOptionRequest> optionRequests) {
        for (int i = 0; i < optionRequests.size(); i++) {
            QuestionOptionRequest optionRequest = optionRequests.get(i);
            
            QuestionOption option = new QuestionOption();
            option.setOptionText(optionRequest.getOptionText());
            option.setQuestion(question);
            option.setOptionOrder(optionRequest.getOptionOrder() != null ? optionRequest.getOptionOrder() : i + 1);
            option.setIsCorrect(optionRequest.getIsCorrect());
            option.setOptionLetter(optionRequest.getOptionLetter() != null ? optionRequest.getOptionLetter() : String.valueOf((char) ('A' + i)));
            
            questionOptionRepository.save(option);
        }
    }
    
    /**
     * Update an assessment
     */
    public AssessmentResponse updateAssessment(Long id, AssessmentRequest request) {
        log.info("Updating assessment with ID: {}", id);
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + id));
        
        assessment.setTitle(request.getTitle());
        assessment.setDescription(request.getDescription());
        assessment.setType(request.getType());
        assessment.setStartDate(request.getStartDate());
        assessment.setEndDate(request.getEndDate());
        assessment.setTimeLimitMinutes(request.getTimeLimitMinutes());
        assessment.setMaxAttempts(request.getMaxAttempts());
        assessment.setTotalMarks(request.getTotalMarks());
        assessment.setPassingMarks(request.getPassingMarks());
        assessment.setIsRandomized(request.getIsRandomized());
        assessment.setShowCorrectAnswers(request.getShowCorrectAnswers());
        assessment.setAllowReview(request.getAllowReview());
        
        Assessment updatedAssessment = assessmentRepository.save(assessment);
        
        log.info("Assessment updated successfully");
        return new AssessmentResponse(updatedAssessment);
    }
    
    /**
     * Publish an assessment (change status to ACTIVE)
     */
    public AssessmentResponse publishAssessment(Long id) {
        log.info("Publishing assessment with ID: {}", id);
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + id));
        
        if (assessment.getQuestions() == null || assessment.getQuestions().isEmpty()) {
            throw new IllegalArgumentException("Cannot publish assessment without questions");
        }
        
        assessment.setStatus(Assessment.AssessmentStatus.ACTIVE);
        Assessment updatedAssessment = assessmentRepository.save(assessment);
        
        log.info("Assessment published successfully");
        return new AssessmentResponse(updatedAssessment);
    }
    
    /**
     * Get assessment by ID
     */
    @Transactional(readOnly = true)
    public AssessmentResponse getAssessmentById(Long id) {
        log.info("Fetching assessment with ID: {}", id);
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + id));
        
        return new AssessmentResponse(assessment);
    }
    
    /**
     * Get assessment with questions
     */
    @Transactional(readOnly = true)
    public AssessmentResponse getAssessmentWithQuestions(Long id) {
        log.info("Fetching assessment with questions for ID: {}", id);
        
        Assessment assessment = assessmentRepository.findByIdWithQuestions(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + id));
        
        AssessmentResponse response = new AssessmentResponse(assessment);
        
        // Convert questions to response DTOs
        if (assessment.getQuestions() != null) {
            List<QuestionResponse> questionResponses = assessment.getQuestions().stream()
                    .map(question -> {
                        QuestionResponse questionResponse = new QuestionResponse(question);
                        // Convert options to response DTOs
                        if (question.getOptions() != null) {
                            List<QuestionOptionResponse> optionResponses = question.getOptions().stream()
                                    .map(QuestionOptionResponse::new)
                                    .collect(Collectors.toList());
                            questionResponse.setOptions(optionResponses);
                        }
                        return questionResponse;
                    })
                    .collect(Collectors.toList());
            response.setQuestions(questionResponses);
        }
        
        return response;
    }
    
    /**
     * Get assessments by faculty
     */
    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAssessmentsByFaculty(Long facultyId) {
        log.info("Fetching assessments for faculty ID: {}", facultyId);
        
        List<Assessment> assessments = assessmentRepository.findByFaculty_IdOrderByCreatedAtDesc(facultyId);
        
        return assessments.stream()
                .map(AssessmentResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all active assessments (for students to see what's available)
     */
    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAllActiveAssessments() {
        log.info("Fetching all active assessments");
        
        List<Assessment> assessments = assessmentRepository.findByStatusOrderByCreatedAtDesc(Assessment.AssessmentStatus.ACTIVE);
        
        log.info("Found {} active assessments", assessments.size());
        
        return assessments.stream()
                .map(AssessmentResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get available assessments for student
     */
    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAvailableAssessmentsForStudent(Long studentId) {
        log.info("Fetching available assessments for student ID: {}", studentId);
        
        // Get all active assessments within time range
        List<Assessment> allActiveAssessments = assessmentRepository.findAvailableAssessmentsForStudent(LocalDateTime.now());
        
        // Get assessments the student has already attempted
        List<Assessment> attemptedAssessments = assessmentRepository.findAssessmentsAttemptedByStudent(studentId);
        
        // Filter out assessments the student has already attempted
        List<Assessment> availableAssessments = allActiveAssessments.stream()
                .filter(assessment -> attemptedAssessments.stream()
                        .noneMatch(attempted -> attempted.getId().equals(assessment.getId())))
                .collect(Collectors.toList());
        
        return availableAssessments.stream()
                .map(AssessmentResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Submit student answer
     */
    public StudentAnswerResponse submitAnswer(StudentAnswerRequest request) {
        log.info("Submitting answer for student ID: {}, question ID: {}", request.getStudentId(), request.getQuestionId());
        
        // Validate student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));
        
        // Validate assessment exists
        Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + request.getAssessmentId()));
        
        // Validate question exists
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found with ID: " + request.getQuestionId()));
        
        // Check if assessment is active
        if (assessment.getStatus() != Assessment.AssessmentStatus.ACTIVE) {
            throw new IllegalArgumentException("Assessment is not active");
        }
        
        // Check if assessment is within time limits
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(assessment.getStartDate()) || now.isAfter(assessment.getEndDate())) {
            throw new IllegalArgumentException("Assessment is not available at this time");
        }
        
        // Check if student has already answered this question
        Optional<StudentAnswer> existingAnswer = studentAnswerRepository.findByStudent_IdAndQuestion_Id(request.getStudentId(), request.getQuestionId());
        
        StudentAnswer studentAnswer;
        if (existingAnswer.isPresent()) {
            // Update existing answer
            studentAnswer = existingAnswer.get();
            studentAnswer.setAnswerText(request.getAnswerText());
            studentAnswer.setSelectedOptionId(request.getSelectedOptionId());
            studentAnswer.setTimeTakenSeconds(request.getTimeTakenSeconds());
            studentAnswer.setAnswerStatus(StudentAnswer.AnswerStatus.SUBMITTED);
        } else {
            // Create new answer
            studentAnswer = new StudentAnswer();
            studentAnswer.setStudent(student);
            studentAnswer.setAssessment(assessment);
            studentAnswer.setQuestion(question);
            studentAnswer.setAnswerText(request.getAnswerText());
            studentAnswer.setSelectedOptionId(request.getSelectedOptionId());
            studentAnswer.setTimeTakenSeconds(request.getTimeTakenSeconds());
            studentAnswer.setAnswerStatus(StudentAnswer.AnswerStatus.SUBMITTED);
        }
        
        StudentAnswer savedAnswer = studentAnswerRepository.save(studentAnswer);
        
        log.info("Answer submitted successfully with ID: {}", savedAnswer.getId());
        return new StudentAnswerResponse(savedAnswer);
    }
    
    /**
     * Grade a student answer
     */
    public StudentAnswerResponse gradeAnswer(GradeAnswerRequest request) {
        log.info("Grading answer with ID: {}", request.getStudentAnswerId());
        
        StudentAnswer studentAnswer = studentAnswerRepository.findById(request.getStudentAnswerId())
                .orElseThrow(() -> new IllegalArgumentException("Student answer not found with ID: " + request.getStudentAnswerId()));
        
        studentAnswer.setIsCorrect(request.getIsCorrect());
        studentAnswer.setMarksObtained(request.getMarksObtained());
        studentAnswer.setFeedback(request.getFeedback());
        studentAnswer.setGradedBy(request.getGradedBy());
        studentAnswer.setGradedAt(LocalDateTime.now());
        studentAnswer.setAnswerStatus(StudentAnswer.AnswerStatus.GRADED);
        
        StudentAnswer gradedAnswer = studentAnswerRepository.save(studentAnswer);
        
        log.info("Answer graded successfully");
        return new StudentAnswerResponse(gradedAnswer);
    }
    
    /**
     * Get student answers for an assessment
     */
    @Transactional(readOnly = true)
    public List<StudentAnswerResponse> getStudentAnswersForAssessment(Long assessmentId) {
        log.info("Fetching student answers for assessment ID: {}", assessmentId);
        
        List<StudentAnswer> answers = studentAnswerRepository.findByAssessment_IdOrderBySubmittedAtDesc(assessmentId);
        
        return answers.stream()
                .map(StudentAnswerResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get answers that need grading
     */
    @Transactional(readOnly = true)
    public List<StudentAnswerResponse> getAnswersNeedingGrading(Long facultyId) {
        log.info("Fetching answers needing grading for faculty ID: {}", facultyId);
        
        List<StudentAnswer> answers = studentAnswerRepository.findByFacultyIdAndStatus(facultyId, StudentAnswer.AnswerStatus.SUBMITTED);
        
        return answers.stream()
                .map(StudentAnswerResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Delete an assessment
     */
    public void deleteAssessment(Long id) {
        log.info("Deleting assessment with ID: {}", id);
        
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with ID: " + id));
        
        assessmentRepository.delete(assessment);
        
        log.info("Assessment deleted successfully");
    }
    
    /**
     * Get available assessment types
     */
    @Transactional(readOnly = true)
    public List<String> getAvailableAssessmentTypes() {
        return List.of(
                Assessment.AssessmentType.QUIZ.name(),
                Assessment.AssessmentType.EXAM.name(),
                Assessment.AssessmentType.ASSIGNMENT.name(),
                Assessment.AssessmentType.TEST.name(),
                Assessment.AssessmentType.SURVEY.name()
        );
    }
    
    /**
     * Get available question types
     */
    @Transactional(readOnly = true)
    public List<String> getAvailableQuestionTypes() {
        return List.of(
                Question.QuestionType.MULTIPLE_CHOICE.name(),
                Question.QuestionType.SINGLE_CHOICE.name(),
                Question.QuestionType.TRUE_FALSE.name(),
                Question.QuestionType.SHORT_ANSWER.name(),
                Question.QuestionType.ESSAY.name(),
                Question.QuestionType.FILL_IN_BLANK.name(),
                Question.QuestionType.MATCHING.name()
        );
    }
}

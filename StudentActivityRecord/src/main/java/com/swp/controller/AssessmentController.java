package com.swp.controller;

import com.swp.dto.*;
import com.swp.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AssessmentController {
    
    private final AssessmentService assessmentService;
    
    /**
     * Create a new assessment
     * POST /api/assessments
     */
    @PostMapping
    public ResponseEntity<AssessmentResponse> createAssessment(@Valid @RequestBody AssessmentRequest request) {
        log.info("Received request to create assessment: {}", request.getTitle());
        try {
            AssessmentResponse response = assessmentService.createAssessment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating assessment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update an assessment
     * PUT /api/assessments/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<AssessmentResponse> updateAssessment(@PathVariable Long id, @Valid @RequestBody AssessmentRequest request) {
        log.info("Received request to update assessment with ID: {}", id);
        try {
            AssessmentResponse response = assessmentService.updateAssessment(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating assessment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Publish an assessment
     * PUT /api/assessments/{id}/publish
     */
    @PutMapping("/{id}/publish")
    public ResponseEntity<AssessmentResponse> publishAssessment(@PathVariable Long id) {
        log.info("Received request to publish assessment with ID: {}", id);
        try {
            AssessmentResponse response = assessmentService.publishAssessment(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error publishing assessment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get assessment by ID
     * GET /api/assessments/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<AssessmentResponse> getAssessmentById(@PathVariable Long id) {
        log.info("Fetching assessment with ID: {}", id);
        try {
            AssessmentResponse response = assessmentService.getAssessmentById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching assessment: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get assessment with questions
     * GET /api/assessments/{id}/questions
     */
    @GetMapping("/{id}/questions")
    public ResponseEntity<AssessmentResponse> getAssessmentWithQuestions(@PathVariable Long id) {
        log.info("Fetching assessment with questions for ID: {}", id);
        try {
            AssessmentResponse response = assessmentService.getAssessmentWithQuestions(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching assessment with questions: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get assessments by faculty
     * GET /api/assessments/faculty/{facultyId}
     */
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<AssessmentResponse>> getAssessmentsByFaculty(@PathVariable Long facultyId) {
        log.info("Fetching assessments for faculty ID: {}", facultyId);
        try {
            List<AssessmentResponse> responses = assessmentService.getAssessmentsByFaculty(facultyId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching assessments by faculty: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get all active assessments
     * GET /api/assessments/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<AssessmentResponse>> getAllActiveAssessments() {
        log.info("Fetching all active assessments");
        try {
            List<AssessmentResponse> responses = assessmentService.getAllActiveAssessments();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching active assessments: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get available assessments for student
     * GET /api/assessments/student/{studentId}/available
     */
    @GetMapping("/student/{studentId}/available")
    public ResponseEntity<List<AssessmentResponse>> getAvailableAssessmentsForStudent(@PathVariable Long studentId) {
        log.info("Fetching available assessments for student ID: {}", studentId);
        try {
            List<AssessmentResponse> responses = assessmentService.getAvailableAssessmentsForStudent(studentId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching available assessments for student: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Submit student answer
     * POST /api/assessments/answers
     */
    @PostMapping("/answers")
    public ResponseEntity<StudentAnswerResponse> submitAnswer(@Valid @RequestBody StudentAnswerRequest request) {
        log.info("Received request to submit answer for student ID: {}, question ID: {}", 
                request.getStudentId(), request.getQuestionId());
        try {
            StudentAnswerResponse response = assessmentService.submitAnswer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error submitting answer: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Grade a student answer
     * PUT /api/assessments/answers/grade
     */
    @PutMapping("/answers/grade")
    public ResponseEntity<StudentAnswerResponse> gradeAnswer(@Valid @RequestBody GradeAnswerRequest request) {
        log.info("Received request to grade answer with ID: {}", request.getStudentAnswerId());
        try {
            StudentAnswerResponse response = assessmentService.gradeAnswer(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error grading answer: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get student answers for an assessment
     * GET /api/assessments/{assessmentId}/answers
     */
    @GetMapping("/{assessmentId}/answers")
    public ResponseEntity<List<StudentAnswerResponse>> getStudentAnswersForAssessment(@PathVariable Long assessmentId) {
        log.info("Fetching student answers for assessment ID: {}", assessmentId);
        try {
            List<StudentAnswerResponse> responses = assessmentService.getStudentAnswersForAssessment(assessmentId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching student answers for assessment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get answers that need grading
     * GET /api/assessments/faculty/{facultyId}/grading
     */
    @GetMapping("/faculty/{facultyId}/grading")
    public ResponseEntity<List<StudentAnswerResponse>> getAnswersNeedingGrading(@PathVariable Long facultyId) {
        log.info("Fetching answers needing grading for faculty ID: {}", facultyId);
        try {
            List<StudentAnswerResponse> responses = assessmentService.getAnswersNeedingGrading(facultyId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching answers needing grading: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete an assessment
     * DELETE /api/assessments/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long id) {
        log.info("Received request to delete assessment with ID: {}", id);
        try {
            assessmentService.deleteAssessment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting assessment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get available assessment types
     * GET /api/assessments/types
     */
    @GetMapping("/types")
    public ResponseEntity<List<String>> getAvailableAssessmentTypes() {
        log.info("Fetching available assessment types");
        try {
            List<String> types = assessmentService.getAvailableAssessmentTypes();
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            log.error("Error fetching assessment types: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get available question types
     * GET /api/assessments/question-types
     */
    @GetMapping("/question-types")
    public ResponseEntity<List<String>> getAvailableQuestionTypes() {
        log.info("Fetching available question types");
        try {
            List<String> types = assessmentService.getAvailableQuestionTypes();
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            log.error("Error fetching question types: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}

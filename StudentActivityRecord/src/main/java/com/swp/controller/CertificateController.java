package com.swp.controller;

import com.swp.dto.CertificateResponse;
import com.swp.dto.CertificateReviewRequest;
import com.swp.dto.CertificateSummaryResponse;
import com.swp.dto.CertificateUploadRequest;
import com.swp.entity.Certificate;
import com.swp.service.CertificateService;
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
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class CertificateController {

    private final CertificateService certificateService;

    /**
     * Upload a new certificate
     */
    @PostMapping("/upload")
    public ResponseEntity<CertificateResponse> uploadCertificate(@Valid @RequestBody CertificateUploadRequest request) {
        log.info("Received certificate upload request for student ID: {}", request.getStudentId());
        try {
            CertificateResponse response = certificateService.uploadCertificate(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error uploading certificate: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Review and approve/reject a certificate
     */
    @PutMapping("/review")
    public ResponseEntity<CertificateResponse> reviewCertificate(@Valid @RequestBody CertificateReviewRequest request) {
        log.info("Received certificate review request for certificate ID: {}", request.getCertificateId());
        try {
            CertificateResponse response = certificateService.reviewCertificate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error reviewing certificate: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get certificate by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getCertificateById(@PathVariable Long id) {
        log.info("Fetching certificate with ID: {}", id);
        try {
            CertificateResponse response = certificateService.getCertificateById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching certificate: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all certificates for a student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByStudent(@PathVariable Long studentId) {
        log.info("Fetching certificates for student ID: {}", studentId);
        try {
            List<CertificateResponse> responses = certificateService.getCertificatesByStudent(studentId);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching certificates for student: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get certificates for a student with pagination
     */
    @GetMapping("/student/{studentId}/paginated")
    public ResponseEntity<Page<CertificateResponse>> getCertificatesByStudentWithPagination(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        log.info("Fetching certificates for student ID: {} with pagination", studentId);
        try {
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<CertificateResponse> responses = certificateService.getCertificatesByStudentWithPagination(studentId, pageable);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching certificates for student with pagination: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get certificate summary for a student
     */
    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<CertificateSummaryResponse> getCertificateSummary(@PathVariable Long studentId) {
        log.info("Fetching certificate summary for student ID: {}", studentId);
        try {
            CertificateSummaryResponse response = certificateService.getCertificateSummary(studentId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching certificate summary: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get certificates by status (for faculty review)
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByStatus(@PathVariable String status) {
        log.info("Fetching certificates with status: {}", status);
        try {
            Certificate.CertificateStatus certificateStatus = Certificate.CertificateStatus.valueOf(status.toUpperCase());
            List<CertificateResponse> responses = certificateService.getCertificatesByStatus(certificateStatus);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching certificates by status: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get certificates by status with pagination
     */
    @GetMapping("/status/{status}/paginated")
    public ResponseEntity<Page<CertificateResponse>> getCertificatesByStatusWithPagination(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        log.info("Fetching certificates with status: {} with pagination", status);
        try {
            Certificate.CertificateStatus certificateStatus = Certificate.CertificateStatus.valueOf(status.toUpperCase());
            Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<CertificateResponse> responses = certificateService.getCertificatesByStatusWithPagination(certificateStatus, pageable);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching certificates by status with pagination: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get certificates reviewed by specific faculty
     */
    @GetMapping("/reviewed-by/{reviewedBy}")
    public ResponseEntity<List<CertificateResponse>> getCertificatesReviewedBy(@PathVariable String reviewedBy) {
        log.info("Fetching certificates reviewed by: {}", reviewedBy);
        try {
            List<CertificateResponse> responses = certificateService.getCertificatesReviewedBy(reviewedBy);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching certificates reviewed by faculty: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete a certificate
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        log.info("Deleting certificate with ID: {}", id);
        try {
            certificateService.deleteCertificate(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting certificate: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get available certificate types
     */
    @GetMapping("/types")
    public ResponseEntity<List<String>> getAvailableCertificateTypes() {
        log.info("Fetching available certificate types");
        try {
            List<String> types = certificateService.getAvailableCertificateTypes();
            return ResponseEntity.ok(types);
        } catch (Exception e) {
            log.error("Error fetching certificate types: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get available certificate statuses
     */
    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAvailableCertificateStatuses() {
        log.info("Fetching available certificate statuses");
        try {
            List<String> statuses = certificateService.getAvailableCertificateStatuses();
            return ResponseEntity.ok(statuses);
        } catch (Exception e) {
            log.error("Error fetching certificate statuses: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}

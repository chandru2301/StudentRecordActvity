package com.swp.service;

import com.swp.dto.CertificateResponse;
import com.swp.dto.CertificateReviewRequest;
import com.swp.dto.CertificateSummaryResponse;
import com.swp.dto.CertificateUploadRequest;
import com.swp.entity.Certificate;
import com.swp.entity.Student;
import com.swp.repository.CertificateRepository;
import com.swp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final StudentRepository studentRepository;

    /**
     * Upload a new certificate
     */
    public CertificateResponse uploadCertificate(CertificateUploadRequest request) {
        log.info("Uploading certificate for student ID: {}", request.getStudentId());
        
        // Validate student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));

        // Create certificate entity
        Certificate certificate = new Certificate();
        certificate.setStudent(student);
        certificate.setCertificateName(request.getCertificateName());
        certificate.setCertificateType(request.getCertificateType());
        certificate.setFileName(request.getFileName());
        certificate.setFilePath(request.getFilePath());
        certificate.setFileSize(request.getFileSize());
        certificate.setFileType(request.getFileType());
        certificate.setStatus(Certificate.CertificateStatus.PENDING);
        certificate.setSubmittedAt(LocalDateTime.now());

        Certificate savedCertificate = certificateRepository.save(certificate);
        log.info("Certificate uploaded successfully with ID: {}", savedCertificate.getId());
        
        return new CertificateResponse(savedCertificate);
    }

    /**
     * Review and approve/reject a certificate
     */
    public CertificateResponse reviewCertificate(CertificateReviewRequest request) {
        log.info("Reviewing certificate ID: {} with status: {}", request.getCertificateId(), request.getStatus());
        
        Certificate certificate = certificateRepository.findById(request.getCertificateId())
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with ID: " + request.getCertificateId()));

        // Update certificate status
        certificate.setStatus(request.getStatus());
        certificate.setReviewedAt(LocalDateTime.now());
        certificate.setReviewedBy(request.getReviewedBy());
        certificate.setReviewNotes(request.getReviewNotes());

        Certificate updatedCertificate = certificateRepository.save(certificate);
        log.info("Certificate reviewed successfully. Status: {}", updatedCertificate.getStatus());
        
        return new CertificateResponse(updatedCertificate);
    }

    /**
     * Get certificate by ID
     */
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateById(Long id) {
        log.info("Fetching certificate with ID: {}", id);
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found with ID: " + id));
        return new CertificateResponse(certificate);
    }

    /**
     * Get all certificates for a student
     */
    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesByStudent(Long studentId) {
        log.info("Fetching certificates for student ID: {}", studentId);
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        
        List<Certificate> certificates = certificateRepository.findByStudent_IdOrderBySubmittedAtDesc(studentId);
        log.info("Found {} certificates for student ID: {}", certificates.size(), studentId);
        
        return certificates.stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get certificates by student with pagination
     */
    @Transactional(readOnly = true)
    public Page<CertificateResponse> getCertificatesByStudentWithPagination(Long studentId, Pageable pageable) {
        log.info("Fetching certificates for student ID: {} with pagination", studentId);
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        
        Page<Certificate> certificates = certificateRepository.findCertificatesByStudentWithPagination(studentId, pageable);
        log.info("Found {} certificates for student ID: {}", certificates.getTotalElements(), studentId);
        
        return certificates.map(CertificateResponse::new);
    }

    /**
     * Get certificates by status (for faculty review)
     */
    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesByStatus(Certificate.CertificateStatus status) {
        log.info("Fetching certificates with status: {}", status);
        List<Certificate> certificates = certificateRepository.findByStatusOrderBySubmittedAtAsc(status);
        log.info("Found {} certificates with status: {}", certificates.size(), status);
        
        return certificates.stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get certificates by status with pagination
     */
    @Transactional(readOnly = true)
    public Page<CertificateResponse> getCertificatesByStatusWithPagination(Certificate.CertificateStatus status, Pageable pageable) {
        log.info("Fetching certificates with status: {} with pagination", status);
        Page<Certificate> certificates = certificateRepository.findByStatusOrderBySubmittedAtAsc(status, pageable);
        log.info("Found {} certificates with status: {}", certificates.getTotalElements(), status);
        
        return certificates.map(CertificateResponse::new);
    }

    /**
     * Get certificate summary for a student
     */
    @Transactional(readOnly = true)
    public CertificateSummaryResponse getCertificateSummary(Long studentId) {
        log.info("Fetching certificate summary for student ID: {}", studentId);
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        // Get certificate statistics
        List<Object[]> statusStats = certificateRepository.getCertificateStatsByStudent(studentId);
        List<Object[]> typeStats = certificateRepository.getCertificateTypesByStudent(studentId);
        
        // Get recent certificates
        List<Certificate> recentCertificates = certificateRepository.findByStudent_IdOrderBySubmittedAtDesc(studentId)
                .stream()
                .limit(5)
                .collect(Collectors.toList());

        // Build summary response
        CertificateSummaryResponse summary = new CertificateSummaryResponse();
        summary.setStudentId(studentId);
        summary.setStudentName(student.getName());
        summary.setStudentRollNumber(student.getRollNumber());
        summary.setTotalCertificates(certificateRepository.countByStudent_Id(studentId));
        
        // Process status statistics
        long pendingCount = 0, approvedCount = 0, rejectedCount = 0, underReviewCount = 0;
        for (Object[] stat : statusStats) {
            Certificate.CertificateStatus status = (Certificate.CertificateStatus) stat[0];
            long count = (Long) stat[1];
            
            switch (status) {
                case PENDING -> pendingCount = count;
                case APPROVED -> approvedCount = count;
                case REJECTED -> rejectedCount = count;
                case UNDER_REVIEW -> underReviewCount = count;
            }
        }
        
        summary.setPendingCount(pendingCount);
        summary.setApprovedCount(approvedCount);
        summary.setRejectedCount(rejectedCount);
        summary.setUnderReviewCount(underReviewCount);
        
        // Process type statistics
        List<CertificateSummaryResponse.CertificateTypeSummary> typeSummaries = typeStats.stream()
                .map(stat -> {
                    String type = (String) stat[0];
                    long count = (Long) stat[1];
                    // For now, we'll set all counts to 0 for type-specific stats
                    // This could be enhanced with additional queries if needed
                    return new CertificateSummaryResponse.CertificateTypeSummary(type, count, 0, 0, 0);
                })
                .collect(Collectors.toList());
        
        summary.setCertificateTypeSummaries(typeSummaries);
        summary.setRecentCertificates(recentCertificates.stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList()));

        log.info("Certificate summary generated for student ID: {}", studentId);
        return summary;
    }

    /**
     * Get certificates reviewed by specific faculty
     */
    @Transactional(readOnly = true)
    public List<CertificateResponse> getCertificatesReviewedBy(String reviewedBy) {
        log.info("Fetching certificates reviewed by: {}", reviewedBy);
        List<Certificate> certificates = certificateRepository.findByReviewedByOrderByReviewedAtDesc(reviewedBy);
        log.info("Found {} certificates reviewed by: {}", certificates.size(), reviewedBy);
        
        return certificates.stream()
                .map(CertificateResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Delete a certificate
     */
    public void deleteCertificate(Long id) {
        log.info("Deleting certificate with ID: {}", id);
        if (!certificateRepository.existsById(id)) {
            throw new IllegalArgumentException("Certificate not found with ID: " + id);
        }
        certificateRepository.deleteById(id);
        log.info("Certificate deleted successfully with ID: {}", id);
    }

    /**
     * Get available certificate types
     */
    @Transactional(readOnly = true)
    public List<String> getAvailableCertificateTypes() {
        return List.of(
            Certificate.CertificateType.ACADEMIC.name(),
            Certificate.CertificateType.ACHIEVEMENT.name(),
            Certificate.CertificateType.PARTICIPATION.name(),
            Certificate.CertificateType.COMPLETION.name(),
            Certificate.CertificateType.MERIT.name(),
            Certificate.CertificateType.OTHER.name()
        );
    }

    /**
     * Get available certificate statuses
     */
    @Transactional(readOnly = true)
    public List<String> getAvailableCertificateStatuses() {
        return List.of(
            Certificate.CertificateStatus.PENDING.name(),
            Certificate.CertificateStatus.APPROVED.name(),
            Certificate.CertificateStatus.REJECTED.name(),
            Certificate.CertificateStatus.UNDER_REVIEW.name()
        );
    }
}

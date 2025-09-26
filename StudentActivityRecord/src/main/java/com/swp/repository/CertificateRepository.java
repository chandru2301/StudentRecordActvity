package com.swp.repository;

import com.swp.entity.Certificate;
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
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    
    // Find certificates by student
    List<Certificate> findByStudent_Id(Long studentId);
    Page<Certificate> findByStudent_Id(Long studentId, Pageable pageable);
    List<Certificate> findByStudent_IdOrderBySubmittedAtDesc(Long studentId);
    
    // Find certificates by status
    List<Certificate> findByStatus(Certificate.CertificateStatus status);
    Page<Certificate> findByStatus(Certificate.CertificateStatus status, Pageable pageable);
    
    // Find certificates by student and status
    List<Certificate> findByStudent_IdAndStatus(Long studentId, Certificate.CertificateStatus status);
    
    // Find certificates by certificate type
    List<Certificate> findByCertificateType(String certificateType);
    List<Certificate> findByStudent_IdAndCertificateType(Long studentId, String certificateType);
    
    // Find certificates submitted within date range
    List<Certificate> findBySubmittedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Certificate> findByStudent_IdAndSubmittedAtBetween(Long studentId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find certificates reviewed by specific faculty
    List<Certificate> findByReviewedBy(String reviewedBy);
    List<Certificate> findByReviewedByOrderByReviewedAtDesc(String reviewedBy);
    
    // Count certificates by status
    long countByStatus(Certificate.CertificateStatus status);
    long countByStudent_Id(Long studentId);
    long countByStudent_IdAndStatus(Long studentId, Certificate.CertificateStatus status);
    
    // Find pending certificates (for faculty review)
    List<Certificate> findByStatusOrderBySubmittedAtAsc(Certificate.CertificateStatus status);
    Page<Certificate> findByStatusOrderBySubmittedAtAsc(Certificate.CertificateStatus status, Pageable pageable);
    
    // Find certificates with review notes
    List<Certificate> findByReviewNotesIsNotNull();
    List<Certificate> findByStudent_IdAndReviewNotesIsNotNull(Long studentId);
    
    // Custom query for certificate statistics
    @Query("SELECT c.status, COUNT(c) FROM Certificate c WHERE c.student.id = :studentId GROUP BY c.status")
    List<Object[]> getCertificateStatsByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT c.certificateType, COUNT(c) FROM Certificate c WHERE c.student.id = :studentId GROUP BY c.certificateType")
    List<Object[]> getCertificateTypesByStudent(@Param("studentId") Long studentId);
    
    // Find certificates submitted in the last N days
    @Query("SELECT c FROM Certificate c WHERE c.submittedAt >= :since ORDER BY c.submittedAt DESC")
    List<Certificate> findRecentCertificates(@Param("since") LocalDateTime since);
    
    // Find certificates by student with pagination and sorting
    @Query("SELECT c FROM Certificate c WHERE c.student.id = :studentId ORDER BY c.submittedAt DESC")
    Page<Certificate> findCertificatesByStudentWithPagination(@Param("studentId") Long studentId, Pageable pageable);
}

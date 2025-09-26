package com.swp.dto;

import com.swp.entity.Certificate;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CertificateResponse {
    
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private String certificateName;
    private String certificateType;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private Certificate.CertificateStatus status;
    private String statusDisplayName;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
    private String reviewNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CertificateResponse(Certificate certificate) {
        this.id = certificate.getId();
        this.studentId = certificate.getStudentId();
        this.studentName = certificate.getStudentName();
        this.studentRollNumber = certificate.getStudentRollNumber();
        this.certificateName = certificate.getCertificateName();
        this.certificateType = certificate.getCertificateType();
        this.fileName = certificate.getFileName();
        this.filePath = certificate.getFilePath();
        this.fileSize = certificate.getFileSize();
        this.fileType = certificate.getFileType();
        this.status = certificate.getStatus();
        this.statusDisplayName = certificate.getStatus().getDisplayName();
        this.submittedAt = certificate.getSubmittedAt();
        this.reviewedAt = certificate.getReviewedAt();
        this.reviewedBy = certificate.getReviewedBy();
        this.reviewNotes = certificate.getReviewNotes();
        this.createdAt = certificate.getCreatedAt();
        this.updatedAt = certificate.getUpdatedAt();
    }
}

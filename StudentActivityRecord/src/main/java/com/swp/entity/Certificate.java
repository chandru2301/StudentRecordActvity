package com.swp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Student is required")
    @JsonIgnore
    private Student student;

    @NotBlank(message = "Certificate name is required")
    @Column(name = "certificate_name", nullable = false)
    private String certificateName;

    @NotBlank(message = "Certificate type is required")
    @Column(name = "certificate_type", nullable = false)
    private String certificateType;

    @NotBlank(message = "File name is required")
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @NotBlank(message = "File path is required")
    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @NotBlank(message = "File type is required")
    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private CertificateStatus status;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "review_notes", length = 1000)
    private String reviewNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods for DTO mapping
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }

    public String getStudentName() {
        return student != null ? student.getName() : null;
    }

    public String getStudentRollNumber() {
        return student != null ? student.getRollNumber() : null;
    }

    public enum CertificateStatus {
        PENDING("Pending Review"),
        APPROVED("Approved"),
        REJECTED("Rejected"),
        UNDER_REVIEW("Under Review");

        private final String displayName;

        CertificateStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum CertificateType {
        ACADEMIC("Academic Certificate"),
        ACHIEVEMENT("Achievement Certificate"),
        PARTICIPATION("Participation Certificate"),
        COMPLETION("Course Completion Certificate"),
        MERIT("Merit Certificate"),
        OTHER("Other");

        private final String displayName;

        CertificateType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}

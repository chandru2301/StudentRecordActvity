package com.swp.dto;

import com.swp.entity.Certificate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CertificateReviewRequest {
    
    @NotNull(message = "Certificate ID is required")
    private Long certificateId;
    
    @NotNull(message = "Status is required")
    private Certificate.CertificateStatus status;
    
    @NotBlank(message = "Reviewed by is required")
    private String reviewedBy;
    
    private String reviewNotes;
}

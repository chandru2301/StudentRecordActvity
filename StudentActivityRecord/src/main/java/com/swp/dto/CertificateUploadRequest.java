package com.swp.dto;

import com.swp.entity.Certificate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CertificateUploadRequest {
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    @NotBlank(message = "Certificate name is required")
    private String certificateName;
    
    @NotBlank(message = "Certificate type is required")
    private String certificateType;
    
    @NotBlank(message = "File name is required")
    private String fileName;
    
    @NotBlank(message = "File path is required")
    private String filePath;
    
    private Long fileSize;
    
    @NotBlank(message = "File type is required")
    private String fileType;
}

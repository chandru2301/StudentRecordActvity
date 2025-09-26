package com.swp.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CertificateSummaryResponse {
    
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private long totalCertificates;
    private long pendingCount;
    private long approvedCount;
    private long rejectedCount;
    private long underReviewCount;
    private List<CertificateResponse> recentCertificates;
    private List<CertificateTypeSummary> certificateTypeSummaries;
    
    @Data
    public static class CertificateTypeSummary {
        private String certificateType;
        private long count;
        private long approvedCount;
        private long pendingCount;
        private long rejectedCount;
        
        public CertificateTypeSummary(String certificateType, long count, long approvedCount, long pendingCount, long rejectedCount) {
            this.certificateType = certificateType;
            this.count = count;
            this.approvedCount = approvedCount;
            this.pendingCount = pendingCount;
            this.rejectedCount = rejectedCount;
        }
    }
}

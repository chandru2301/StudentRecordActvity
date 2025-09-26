-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    certificate_name VARCHAR(255) NOT NULL,
    certificate_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(255) NULL,
    review_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_certificates_student_id (student_id),
    INDEX idx_certificates_status (status),
    INDEX idx_certificates_submitted_at (submitted_at),
    INDEX idx_certificates_reviewed_by (reviewed_by)
);

-- Insert sample certificate types enum values (if needed)
-- The enum values are handled in the Java entity, but this is for reference:
-- PENDING, APPROVED, REJECTED, UNDER_REVIEW

-- Insert sample certificate types (if needed)
-- The enum values are handled in the Java entity, but this is for reference:
-- ACADEMIC, ACHIEVEMENT, PARTICIPATION, COMPLETION, MERIT, OTHER

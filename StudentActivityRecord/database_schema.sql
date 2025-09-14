-- Database schema for Student Activity Management
-- This script creates the necessary tables for the activity management system

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_type ENUM('HACKATHON', 'INTER_COLLEGE', 'OUTER_COLLEGE', 'GOVERNMENT_EVENT') NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    certificate_url VARCHAR(500),
    feedback TEXT,
    student_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_date_range (from_date, to_date)
);

-- Update students table to include new fields if they don't exist
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS class_name VARCHAR(100) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS department VARCHAR(100) NOT NULL DEFAULT '';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_class_name ON students(class_name);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);

-- Insert sample data for testing (optional)
INSERT IGNORE INTO students (name, email, phone_number, degree, class_name, department, dob, roll_number, type, created_at, updated_at) VALUES
('John Doe', 'john.doe@example.com', '1234567890', 'Bachelor of Technology', 'XII-A', 'Computer Science', '2000-01-15', 'CS001', 'HOSTELLER', NOW(), NOW()),
('Jane Smith', 'jane.smith@example.com', '0987654321', 'Bachelor of Technology', 'XII-B', 'Information Technology', '1999-05-20', 'IT001', 'DAY_SCHOLAR', NOW(), NOW()),
('Mike Johnson', 'mike.johnson@example.com', '1122334455', 'Bachelor of Technology', 'XII-C', 'Electronics', '2001-03-10', 'EC001', 'HOSTELLER', NOW(), NOW());

-- Insert sample activities for testing (optional)
INSERT IGNORE INTO activities (activity_type, from_date, to_date, certificate_url, feedback, student_id, created_at, updated_at) VALUES
('HACKATHON', '2024-01-15', '2024-01-17', '/uploads/certificates/sample1.pdf', 'Great learning experience with industry mentors. Learned about modern web development and team collaboration.', 1, NOW(), NOW()),
('INTER_COLLEGE', '2024-02-10', '2024-02-12', '/uploads/certificates/sample2.pdf', 'Excellent opportunity to network with students from other colleges and showcase our projects.', 2, NOW(), NOW()),
('GOVERNMENT_EVENT', '2024-03-05', '2024-03-07', NULL, 'Attended a government-sponsored tech conference. Gained insights into digital transformation initiatives.', 3, NOW(), NOW());
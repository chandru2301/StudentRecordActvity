-- Assessment System Database Schema
-- This script creates all tables required for the quiz/assessment system

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    faculty_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    time_limit_minutes INT,
    max_attempts INT DEFAULT 1,
    total_marks DECIMAL(10,2),
    passing_marks DECIMAL(10,2),
    is_randomized BOOLEAN DEFAULT FALSE,
    show_correct_answers BOOLEAN DEFAULT FALSE,
    allow_review BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    INDEX idx_assessments_faculty (faculty_id),
    INDEX idx_assessments_status (status),
    INDEX idx_assessments_type (type),
    INDEX idx_assessments_dates (start_date, end_date)
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    assessment_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    question_order INT,
    marks DECIMAL(10,2) DEFAULT 1.0,
    negative_marks DECIMAL(10,2) DEFAULT 0.0,
    explanation TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    INDEX idx_questions_assessment (assessment_id),
    INDEX idx_questions_type (type),
    INDEX idx_questions_order (assessment_id, question_order)
);

-- Create question_options table
CREATE TABLE IF NOT EXISTS question_options (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    option_text TEXT NOT NULL,
    question_id BIGINT NOT NULL,
    option_order INT,
    is_correct BOOLEAN DEFAULT FALSE,
    option_letter VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_options_question (question_id),
    INDEX idx_options_order (question_id, option_order),
    INDEX idx_options_correct (question_id, is_correct)
);

-- Create student_answers table
CREATE TABLE IF NOT EXISTS student_answers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    assessment_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    answer_text TEXT,
    selected_option_id BIGINT,
    is_correct BOOLEAN,
    marks_obtained DECIMAL(10,2) DEFAULT 0.0,
    feedback TEXT,
    time_taken_seconds INT,
    answer_status VARCHAR(50) DEFAULT 'SUBMITTED',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    graded_at DATETIME,
    graded_by VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_option_id) REFERENCES question_options(id) ON DELETE SET NULL,
    INDEX idx_answers_student (student_id),
    INDEX idx_answers_assessment (assessment_id),
    INDEX idx_answers_question (question_id),
    INDEX idx_answers_status (answer_status),
    INDEX idx_answers_submitted (submitted_at),
    UNIQUE KEY unique_student_question (student_id, question_id)
);

-- Insert sample data for testing
INSERT INTO assessments (title, description, faculty_id, type, status, start_date, end_date, time_limit_minutes, max_attempts, total_marks, passing_marks) VALUES
('Mathematics Quiz 1', 'Basic algebra and geometry questions', 1, 'QUIZ', 'ACTIVE', '2024-01-01 09:00:00', '2024-12-31 23:59:59', 30, 2, 100.0, 60.0),
('Science Test', 'Physics and chemistry fundamentals', 1, 'TEST', 'DRAFT', '2024-01-15 10:00:00', '2024-01-15 12:00:00', 120, 1, 50.0, 25.0);

-- Insert sample questions
INSERT INTO questions (question_text, assessment_id, type, question_order, marks, explanation) VALUES
('What is 2 + 2?', 1, 'SINGLE_CHOICE', 1, 10.0, 'Basic addition'),
('What is the capital of France?', 1, 'SINGLE_CHOICE', 2, 10.0, 'Geography knowledge'),
('Explain the water cycle', 2, 'ESSAY', 1, 25.0, 'Detailed explanation required'),
('True or False: The sun is a star', 2, 'TRUE_FALSE', 2, 5.0, 'Basic astronomy');

-- Insert sample question options
INSERT INTO question_options (option_text, question_id, option_order, is_correct, option_letter) VALUES
('3', 1, 1, FALSE, 'A'),
('4', 1, 2, TRUE, 'B'),
('5', 1, 3, FALSE, 'C'),
('6', 1, 4, FALSE, 'D'),
('London', 2, 1, FALSE, 'A'),
('Paris', 2, 2, TRUE, 'B'),
('Berlin', 2, 3, FALSE, 'C'),
('Madrid', 2, 4, FALSE, 'D'),
('True', 4, 1, TRUE, 'A'),
('False', 4, 2, FALSE, 'B');

-- Create views for common queries
CREATE VIEW assessment_summary AS
SELECT 
    a.id,
    a.title,
    a.type,
    a.status,
    a.start_date,
    a.end_date,
    a.total_marks,
    COUNT(DISTINCT q.id) as total_questions,
    COUNT(DISTINCT sa.student_id) as total_students,
    COUNT(DISTINCT CASE WHEN sa.answer_status = 'SUBMITTED' THEN sa.id END) as pending_grading
FROM assessments a
LEFT JOIN questions q ON a.id = q.assessment_id
LEFT JOIN student_answers sa ON a.id = sa.assessment_id
GROUP BY a.id, a.title, a.type, a.status, a.start_date, a.end_date, a.total_marks;

CREATE VIEW student_performance AS
SELECT 
    sa.student_id,
    s.name as student_name,
    s.roll_number,
    a.id as assessment_id,
    a.title as assessment_title,
    COUNT(sa.id) as total_answers,
    SUM(CASE WHEN sa.is_correct = TRUE THEN 1 ELSE 0 END) as correct_answers,
    SUM(sa.marks_obtained) as total_marks_obtained,
    AVG(sa.marks_obtained) as average_marks
FROM student_answers sa
JOIN students s ON sa.student_id = s.id
JOIN assessments a ON sa.assessment_id = a.id
WHERE sa.answer_status = 'GRADED'
GROUP BY sa.student_id, s.name, s.roll_number, a.id, a.title;

-- Create indexes for better performance
CREATE INDEX idx_assessments_active ON assessments(status, start_date, end_date);
CREATE INDEX idx_questions_with_options ON questions(assessment_id, question_order);
CREATE INDEX idx_student_answers_grading ON student_answers(answer_status, submitted_at);
CREATE INDEX idx_student_answers_performance ON student_answers(student_id, assessment_id, is_correct);

-- Add constraints
ALTER TABLE assessments ADD CONSTRAINT chk_assessment_dates CHECK (end_date > start_date);
ALTER TABLE assessments ADD CONSTRAINT chk_assessment_marks CHECK (passing_marks <= total_marks);
ALTER TABLE questions ADD CONSTRAINT chk_question_marks CHECK (marks >= 0);
ALTER TABLE student_answers ADD CONSTRAINT chk_answer_marks CHECK (marks_obtained >= 0);

-- Migration script to update existing Student records with missing className and department fields
-- Run this script before starting the application

-- Update existing Student records that have NULL className
UPDATE students 
SET class_name = 'Default Class' 
WHERE class_name IS NULL OR class_name = '';

-- Update existing Student records that have NULL department  
UPDATE students 
SET department = 'Default Department'
WHERE department IS NULL OR department = '';

-- Verify the updates
SELECT id, name, class_name, department 
FROM students 
WHERE class_name IS NULL OR department IS NULL OR class_name = '' OR department = '';

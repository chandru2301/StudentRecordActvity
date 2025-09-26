package com.swp.service;

import com.swp.dto.AttendancePeriodResponse;
import com.swp.dto.AttendanceRequest;
import com.swp.dto.AttendanceResponse;
import com.swp.dto.AttendanceSummaryResponse;
import com.swp.entity.Attendance;
import com.swp.entity.Student;
import com.swp.repository.AttendanceRepository;
import com.swp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    
    /**
     * Mark attendance for a student
     */
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        log.info("Marking attendance for student ID: {}, date: {}, period: {}", 
                request.getStudentId(), request.getDate(), request.getPeriod());
        
        // Validate student exists
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));
        
        // Check if attendance already exists for this student, date, and period
        if (attendanceRepository.existsByStudent_IdAndDateAndPeriod(
                request.getStudentId(), request.getDate(), request.getPeriod())) {
            throw new IllegalArgumentException("Attendance already marked for this student, date, and period");
        }
        
        // Create attendance record
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setDate(request.getDate());
        attendance.setPeriod(request.getPeriod());
        attendance.setSubject(request.getSubject());
        attendance.setStatus(request.getStatus());
        attendance.setRemarks(request.getRemarks());
        attendance.setMarkedBy(request.getMarkedBy());
        attendance.setMarkedAt(LocalDateTime.now());
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        log.info("Attendance marked successfully with ID: {}", savedAttendance.getId());
        
        return new AttendanceResponse(savedAttendance);
    }
    
    /**
     * Update attendance record
     */
    public AttendanceResponse updateAttendance(Long attendanceId, AttendanceRequest request) {
        log.info("Updating attendance with ID: {}", attendanceId);
        
        Attendance existingAttendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new IllegalArgumentException("Attendance not found with ID: " + attendanceId));
        
        // Validate student exists if student ID is provided
        if (request.getStudentId() != null) {
            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));
            existingAttendance.setStudent(student);
        }
        
        // Update fields
        if (request.getDate() != null) {
            existingAttendance.setDate(request.getDate());
        }
        if (request.getPeriod() != null) {
            existingAttendance.setPeriod(request.getPeriod());
        }
        if (request.getSubject() != null) {
            existingAttendance.setSubject(request.getSubject());
        }
        if (request.getStatus() != null) {
            existingAttendance.setStatus(request.getStatus());
        }
        if (request.getRemarks() != null) {
            existingAttendance.setRemarks(request.getRemarks());
        }
        if (request.getMarkedBy() != null) {
            existingAttendance.setMarkedBy(request.getMarkedBy());
        }
        
        existingAttendance.setMarkedAt(LocalDateTime.now());
        
        Attendance savedAttendance = attendanceRepository.save(existingAttendance);
        log.info("Attendance updated successfully with ID: {}", savedAttendance.getId());
        
        return new AttendanceResponse(savedAttendance);
    }
    
    /**
     * Get attendance records for a specific student
     */
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByStudent(Long studentId) {
        log.info("Fetching attendance records for student ID: {}", studentId);
        
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID is required");
        }
        
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        
        List<Attendance> attendanceRecords = attendanceRepository.findByStudent_IdOrderByDateDesc(studentId);
        log.info("Found {} attendance records for student ID: {}", attendanceRecords.size(), studentId);
        
        return attendanceRecords.stream()
                .map(AttendanceResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get attendance records for a specific student and date
     */
    @Transactional(readOnly = true)
    public AttendancePeriodResponse getAttendanceByStudentAndDate(Long studentId, LocalDate date) {
        log.info("Fetching attendance records for student ID: {} on date: {}", studentId, date);
        
        if (studentId == null || date == null) {
            throw new IllegalArgumentException("Student ID and date are required");
        }
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));
        
        List<Attendance> attendanceRecords = attendanceRepository.findByStudent_IdAndDate(studentId, date);
        
        AttendancePeriodResponse response = new AttendancePeriodResponse();
        response.setStudentId(studentId);
        response.setStudentName(student.getName());
        response.setStudentRollNumber(student.getRollNumber());
        response.setDate(date);
        
        List<AttendancePeriodResponse.PeriodAttendance> periods = attendanceRecords.stream()
                .map(AttendancePeriodResponse.PeriodAttendance::new)
                .collect(Collectors.toList());
        
        response.setPeriods(periods);
        
        log.info("Found {} attendance records for student ID: {} on date: {}", 
                attendanceRecords.size(), studentId, date);
        
        return response;
    }
    
    /**
     * Get attendance records for a specific student within a date range
     */
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByStudentAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching attendance records for student ID: {} from {} to {}", 
                studentId, startDate, endDate);
        
        if (studentId == null || startDate == null || endDate == null) {
            throw new IllegalArgumentException("Student ID, start date, and end date are required");
        }
        
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        
        List<Attendance> attendanceRecords = attendanceRepository.findByStudent_IdAndDateBetween(studentId, startDate, endDate);
        log.info("Found {} attendance records for student ID: {} from {} to {}", 
                attendanceRecords.size(), studentId, startDate, endDate);
        
        return attendanceRecords.stream()
                .map(AttendanceResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get attendance summary for a specific student within a date range
     */
    @Transactional(readOnly = true)
    public AttendanceSummaryResponse getAttendanceSummary(Long studentId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching attendance summary for student ID: {} from {} to {}", 
                studentId, startDate, endDate);
        
        if (studentId == null || startDate == null || endDate == null) {
            throw new IllegalArgumentException("Student ID, start date, and end date are required");
        }
        
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));
        
        // Get attendance summary data
        List<Object[]> summaryData = attendanceRepository.getAttendanceSummaryByStudentAndDateRange(studentId, startDate, endDate);
        Object[] percentageData = attendanceRepository.getAttendancePercentageByStudentAndDateRange(studentId, startDate, endDate);
        List<Object[]> subjectData = attendanceRepository.getAttendanceBySubjectAndStudentAndDateRange(studentId, startDate, endDate);
        
        // Get recent attendance records
        List<Attendance> recentAttendance = attendanceRepository.findByStudent_IdAndDateBetween(studentId, startDate, endDate)
                .stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(10)
                .collect(Collectors.toList());
        
        // Build summary response
        AttendanceSummaryResponse summary = new AttendanceSummaryResponse(
                studentId, student.getName(), student.getRollNumber(), startDate, endDate);
        
        // Calculate counts and percentages
        long totalRecords = 0;
        long presentCount = 0;
        long absentCount = 0;
        long lateCount = 0;
        long excusedCount = 0;
        long medicalLeaveCount = 0;
        
        for (Object[] data : summaryData) {
            Attendance.AttendanceStatus status = (Attendance.AttendanceStatus) data[0];
            Long count = (Long) data[1];
            totalRecords += count;
            
            switch (status) {
                case PRESENT:
                    presentCount = count;
                    break;
                case ABSENT:
                    absentCount = count;
                    break;
                case LATE:
                    lateCount = count;
                    break;
                case EXCUSED:
                    excusedCount = count;
                    break;
                case MEDICAL_LEAVE:
                    medicalLeaveCount = count;
                    break;
            }
        }
        
        summary.setTotalRecords(totalRecords);
        summary.setPresentCount(presentCount);
        summary.setAbsentCount(absentCount);
        summary.setLateCount(lateCount);
        summary.setExcusedCount(excusedCount);
        summary.setMedicalLeaveCount(medicalLeaveCount);
        
        // Set percentages
        if (percentageData != null && percentageData.length >= 3) {
            summary.setPresentPercentage(((Number) percentageData[0]).doubleValue());
            summary.setAbsentPercentage(((Number) percentageData[1]).doubleValue());
            summary.setLatePercentage(((Number) percentageData[2]).doubleValue());
        }
        
        // Build attendance by subject map
        Map<String, Map<Attendance.AttendanceStatus, Long>> attendanceBySubject = new HashMap<>();
        for (Object[] data : subjectData) {
            String subject = (String) data[0];
            Attendance.AttendanceStatus status = (Attendance.AttendanceStatus) data[1];
            Long count = (Long) data[2];
            
            attendanceBySubject.computeIfAbsent(subject, k -> new HashMap<>()).put(status, count);
        }
        summary.setAttendanceBySubject(attendanceBySubject);
        
        // Set recent attendance
        summary.setRecentAttendance(recentAttendance.stream()
                .map(AttendanceResponse::new)
                .collect(Collectors.toList()));
        
        log.info("Generated attendance summary for student ID: {} with {} total records", 
                studentId, totalRecords);
        
        return summary;
    }
    
    /**
     * Get attendance records for a specific student and subject
     */
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByStudentAndSubject(Long studentId, String subject) {
        log.info("Fetching attendance records for student ID: {} and subject: {}", studentId, subject);
        
        if (studentId == null || subject == null || subject.trim().isEmpty()) {
            throw new IllegalArgumentException("Student ID and subject are required");
        }
        
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        
        List<Attendance> attendanceRecords = attendanceRepository.findByStudent_IdAndSubjectOrderByDateDesc(studentId, subject);
        log.info("Found {} attendance records for student ID: {} and subject: {}", 
                attendanceRecords.size(), studentId, subject);
        
        return attendanceRecords.stream()
                .map(AttendanceResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get attendance records for a specific student and period
     */
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByStudentAndPeriod(Long studentId, Attendance.Period period) {
        log.info("Fetching attendance records for student ID: {} and period: {}", studentId, period);
        
        if (studentId == null || period == null) {
            throw new IllegalArgumentException("Student ID and period are required");
        }
        
        // Verify student exists
        if (!studentRepository.existsById(studentId)) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        
        List<Attendance> attendanceRecords = attendanceRepository.findByStudent_IdAndPeriod(studentId, period);
        log.info("Found {} attendance records for student ID: {} and period: {}", 
                attendanceRecords.size(), studentId, period);
        
        return attendanceRecords.stream()
                .map(AttendanceResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Delete attendance record
     */
    public void deleteAttendance(Long attendanceId) {
        log.info("Deleting attendance record with ID: {}", attendanceId);
        
        if (!attendanceRepository.existsById(attendanceId)) {
            throw new IllegalArgumentException("Attendance record not found with ID: " + attendanceId);
        }
        
        attendanceRepository.deleteById(attendanceId);
        log.info("Attendance record deleted successfully with ID: {}", attendanceId);
    }
    
    /**
     * Get attendance record by ID
     */
    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(Long attendanceId) {
        log.info("Fetching attendance record with ID: {}", attendanceId);
        
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new IllegalArgumentException("Attendance record not found with ID: " + attendanceId));
        
        return new AttendanceResponse(attendance);
    }
}

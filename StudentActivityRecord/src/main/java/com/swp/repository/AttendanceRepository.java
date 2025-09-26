package com.swp.repository;

import com.swp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    /**
     * Find attendance records for a specific student
     */
    List<Attendance> findByStudent_Id(Long studentId);
    
    /**
     * Find attendance records for a specific student and date
     */
    List<Attendance> findByStudent_IdAndDate(Long studentId, LocalDate date);
    
    /**
     * Find attendance records for a specific student within a date range
     */
    List<Attendance> findByStudent_IdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Find attendance records for a specific student and period
     */
    List<Attendance> findByStudent_IdAndPeriod(Long studentId, Attendance.Period period);
    
    /**
     * Find attendance records for a specific student, date, and period
     */
    Optional<Attendance> findByStudent_IdAndDateAndPeriod(Long studentId, LocalDate date, Attendance.Period period);
    
    /**
     * Find attendance records for a specific student and subject
     */
    List<Attendance> findByStudent_IdAndSubject(Long studentId, String subject);
    
    /**
     * Find attendance records for a specific student and status
     */
    List<Attendance> findByStudent_IdAndStatus(Long studentId, Attendance.AttendanceStatus status);
    
    /**
     * Find attendance records for a specific date
     */
    List<Attendance> findByDate(LocalDate date);
    
    /**
     * Find attendance records for a specific subject
     */
    List<Attendance> findBySubject(String subject);
    
    /**
     * Find attendance records for a specific period
     */
    List<Attendance> findByPeriod(Attendance.Period period);
    
    /**
     * Find attendance records for a specific status
     */
    List<Attendance> findByStatus(Attendance.AttendanceStatus status);
    
    /**
     * Count attendance records for a specific student
     */
    long countByStudent_Id(Long studentId);
    
    /**
     * Count attendance records for a specific student and status
     */
    long countByStudent_IdAndStatus(Long studentId, Attendance.AttendanceStatus status);
    
    /**
     * Count attendance records for a specific student within a date range
     */
    long countByStudent_IdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Count attendance records for a specific student, status, and date range
     */
    long countByStudent_IdAndStatusAndDateBetween(Long studentId, Attendance.AttendanceStatus status, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get attendance summary for a student within a date range
     */
    @Query("SELECT a.status, COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.date BETWEEN :startDate AND :endDate GROUP BY a.status")
    List<Object[]> getAttendanceSummaryByStudentAndDateRange(@Param("studentId") Long studentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Get attendance percentage for a student within a date range
     */
    @Query("SELECT " +
           "COUNT(CASE WHEN a.status = 'PRESENT' THEN 1 END) * 100.0 / COUNT(*) as presentPercentage, " +
           "COUNT(CASE WHEN a.status = 'ABSENT' THEN 1 END) * 100.0 / COUNT(*) as absentPercentage, " +
           "COUNT(CASE WHEN a.status = 'LATE' THEN 1 END) * 100.0 / COUNT(*) as latePercentage " +
           "FROM Attendance a WHERE a.student.id = :studentId AND a.date BETWEEN :startDate AND :endDate")
    Object[] getAttendancePercentageByStudentAndDateRange(@Param("studentId") Long studentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Get attendance records for a student by subject within a date range
     */
    @Query("SELECT a.subject, a.status, COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.date BETWEEN :startDate AND :endDate GROUP BY a.subject, a.status ORDER BY a.subject, a.status")
    List<Object[]> getAttendanceBySubjectAndStudentAndDateRange(@Param("studentId") Long studentId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    /**
     * Check if attendance already exists for a student on a specific date and period
     */
    boolean existsByStudent_IdAndDateAndPeriod(Long studentId, LocalDate date, Attendance.Period period);
    
    /**
     * Find attendance records for a specific student ordered by date descending
     */
    List<Attendance> findByStudent_IdOrderByDateDesc(Long studentId);
    
    /**
     * Find attendance records for a specific student ordered by date ascending
     */
    List<Attendance> findByStudent_IdOrderByDateAsc(Long studentId);
    
    /**
     * Find attendance records for a specific student and subject ordered by date descending
     */
    List<Attendance> findByStudent_IdAndSubjectOrderByDateDesc(Long studentId, String subject);
}

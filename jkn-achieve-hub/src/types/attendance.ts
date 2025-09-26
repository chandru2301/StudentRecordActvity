export interface AttendanceRequest {
  studentId: number;
  date: string; // ISO date string
  period: string;
  subject: string;
  status: string;
  remarks?: string;
  markedBy?: string;
}

export interface AttendanceResponse {
  id: number;
  studentId: number;
  studentName: string;
  studentRollNumber: string;
  date: string;
  period: string;
  periodTimeSlot: string;
  subject: string;
  status: string;
  statusDisplayName: string;
  remarks?: string;
  markedBy?: string;
  markedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummaryResponse {
  studentId: number;
  studentName: string;
  studentRollNumber: string;
  startDate: string;
  endDate: string;
  totalRecords: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  medicalLeaveCount: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
  excusedPercentage: number;
  medicalLeavePercentage: number;
  attendanceBySubject: Record<string, Record<string, number>>;
  recentAttendance: AttendanceResponse[];
}

export interface AttendancePeriodResponse {
  studentId: number;
  studentName: string;
  studentRollNumber: string;
  date: string;
  periods: PeriodAttendance[];
}

export interface PeriodAttendance {
  period: string;
  periodTimeSlot: string;
  subject: string;
  status: string;
  statusDisplayName: string;
  remarks?: string;
  markedBy?: string;
}

export interface AttendancePeriod {
  period: string;
  timeSlot: string;
}

export interface AttendanceStatus {
  status: string;
  displayName: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excused: number;
  medicalLeave: number;
  total: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
  excusedPercentage: number;
  medicalLeavePercentage: number;
}

export interface DailyAttendance {
  date: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  medicalLeave: number;
  percentage: number;
}

import { AttendanceRequest, AttendanceResponse, AttendanceSummaryResponse, AttendancePeriodResponse } from '../types/attendance';

const API_BASE_URL = 'http://localhost:8081/api';

export interface AttendancePeriod {
  period: string;
  timeSlot: string;
}

export interface AttendanceStatus {
  status: string;
  displayName: string;
}

class AttendanceService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
      
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const htmlText = await response.text();
        console.error('Received HTML instead of JSON:', htmlText.substring(0, 200));
        throw new Error(`Server returned HTML instead of JSON. This usually means the API endpoint doesn't exist or the server is not running. Status: ${response.status}`);
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If we can't parse JSON, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            // Keep the default error message
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to the server. Please check if the backend server is running on ${API_BASE_URL}`);
      }
      throw error;
    }
  }

  /**
   * Mark attendance for a student
   */
  async markAttendance(data: AttendanceRequest): Promise<AttendanceResponse> {
    return this.request<AttendanceResponse>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update attendance record
   */
  async updateAttendance(id: number, data: AttendanceRequest): Promise<AttendanceResponse> {
    return this.request<AttendanceResponse>(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get all attendance records for a specific student
   */
  async getAttendanceByStudent(studentId: number): Promise<AttendanceResponse[]> {
    return this.request<AttendanceResponse[]>(`/attendance/student/${studentId}`);
  }

  /**
   * Get attendance records for a specific student and date
   */
  async getAttendanceByStudentAndDate(studentId: number, date: string): Promise<AttendancePeriodResponse> {
    return this.request<AttendancePeriodResponse>(`/attendance/student/${studentId}/date/${date}`);
  }

  /**
   * Get attendance records for a specific student within a date range
   */
  async getAttendanceByStudentAndDateRange(
    studentId: number, 
    startDate: string, 
    endDate: string
  ): Promise<AttendanceResponse[]> {
    return this.request<AttendanceResponse[]>(
      `/attendance/student/${studentId}/range?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Get attendance summary for a specific student within a date range
   */
  async getAttendanceSummary(
    studentId: number, 
    startDate: string, 
    endDate: string
  ): Promise<AttendanceSummaryResponse> {
    return this.request<AttendanceSummaryResponse>(
      `/attendance/student/${studentId}/summary?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Get attendance records for a specific student and subject
   */
  async getAttendanceByStudentAndSubject(studentId: number, subject: string): Promise<AttendanceResponse[]> {
    return this.request<AttendanceResponse[]>(`/attendance/student/${studentId}/subject/${encodeURIComponent(subject)}`);
  }

  /**
   * Get attendance records for a specific student and period
   */
  async getAttendanceByStudentAndPeriod(studentId: number, period: string): Promise<AttendanceResponse[]> {
    return this.request<AttendanceResponse[]>(`/attendance/student/${studentId}/period/${period}`);
  }

  /**
   * Get attendance record by ID
   */
  async getAttendanceById(id: number): Promise<AttendanceResponse> {
    return this.request<AttendanceResponse>(`/attendance/${id}`);
  }

  /**
   * Delete attendance record
   */
  async deleteAttendance(id: number): Promise<void> {
    return this.request<void>(`/attendance/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all available periods
   */
  async getAvailablePeriods(): Promise<AttendancePeriod[]> {
    return this.request<AttendancePeriod[]>('/attendance/periods');
  }

  /**
   * Get all available attendance statuses
   */
  async getAvailableStatuses(): Promise<AttendanceStatus[]> {
    return this.request<AttendanceStatus[]>('/attendance/statuses');
  }
}

export const attendanceService = new AttendanceService();

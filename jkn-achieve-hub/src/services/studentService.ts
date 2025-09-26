import api from './authService';

// Types based on backend entities
export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  degree: string;
  className: string;
  department: string;
  dob: string;
  rollNumber: string;
  type: 'HOSTELLER' | 'DAY_SCHOLAR';
  createdAt: string;
  updatedAt: string;
}

export interface StudentStats {
  totalActivities: number;
  completedActivities: number;
  pendingActivities: number;
  averageGrade: number;
  attendancePercentage: number;
  documentsCount: number;
}

export interface StudentActivitySummary {
  id: number;
  activityType: string;
  fromDate: string;
  toDate: string;
  status: 'COMPLETED' | 'PENDING' | 'IN_PROGRESS';
  feedback?: string;
  certificateUrl?: string;
}

export interface StudentPerformance {
  id: number;
  subject: string;
  grade: number;
  semester: string;
  year: number;
  date: string;
}

export interface StudentDocument {
  id: number;
  name: string;
  type: string;
  url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
  approvedAt?: string;
}

export interface StudentParent {
  id: number;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
}

export interface StudentFeedback {
  id: number;
  teacherName: string;
  teacherImage: string;
  subject: string;
  date: string;
  lesson: string;
  comment: string;
  grade: number;
  status: 'COMPLETED' | 'PENDING';
}

export const studentService = {
  // Get student profile by ID (using auth/me endpoint)
  async getStudentProfile(studentId: number): Promise<StudentProfile> {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;
      // Transform user data to student profile format
      return {
        id: userData.id,
        name: userData.name || 'Unknown',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        degree: userData.profile?.degree || '',
        className: userData.profile?.className || '',
        department: userData.profile?.department || '',
        dob: userData.profile?.dob || '',
        rollNumber: userData.profile?.rollNumber || '',
        type: userData.profile?.type || 'DAY_SCHOLAR',
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  },

  // Get student statistics
  async getStudentStats(studentId: number): Promise<StudentStats> {
    try {
      const response = await api.get(`/students/${studentId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      // Return default stats if API fails
      return {
        totalActivities: 0,
        completedActivities: 0,
        pendingActivities: 0,
        averageGrade: 0,
        attendancePercentage: 0,
        documentsCount: 0
      };
    }
  },

  // Get student activities summary (using activities endpoint)
  async getStudentActivitiesSummary(studentId: number): Promise<StudentActivitySummary[]> {
    try {
      const response = await api.get(`/activities/student/${studentId}`);
      // Transform activities to summary format
      return response.data.map((activity: any) => ({
        id: activity.id,
        activityType: activity.activityType,
        fromDate: activity.fromDate,
        toDate: activity.toDate,
        status: activity.status,
        feedback: activity.feedback,
        certificateUrl: activity.certificateUrl
      }));
    } catch (error) {
      console.error('Error fetching student activities summary:', error);
      return [];
    }
  },

  // Get student performance data (not implemented in backend)
  async getStudentPerformance(studentId: number): Promise<StudentPerformance[]> {
    try {
      // This endpoint doesn't exist in the backend, return empty array
      console.warn('Student performance endpoint not implemented in backend');
      return [];
    } catch (error) {
      console.error('Error fetching student performance:', error);
      return [];
    }
  },

  // Get student documents (certificates)
  async getStudentDocuments(studentId: number): Promise<StudentDocument[]> {
    try {
      const response = await api.get(`/certificates/student/${studentId}`);
      // Transform certificate response to document format
      return response.data.map((cert: any) => ({
        id: cert.id,
        name: cert.certificateName,
        type: cert.certificateType,
        url: cert.filePath,
        status: cert.status,
        uploadedAt: cert.submittedAt,
        approvedAt: cert.reviewedAt
      }));
    } catch (error) {
      console.error('Error fetching student documents:', error);
      return [];
    }
  },

  // Get student parents/guardians (not implemented in backend)
  async getStudentParents(studentId: number): Promise<StudentParent[]> {
    try {
      // This endpoint doesn't exist in the backend, return empty array
      console.warn('Student parents endpoint not implemented in backend');
      return [];
    } catch (error) {
      console.error('Error fetching student parents:', error);
      return [];
    }
  },

  // Get student feedback (not implemented in backend)
  async getStudentFeedback(studentId: number): Promise<StudentFeedback[]> {
    try {
      // This endpoint doesn't exist in the backend, return empty array
      console.warn('Student feedback endpoint not implemented in backend');
      return [];
    } catch (error) {
      console.error('Error fetching student feedback:', error);
      return [];
    }
  },

  // Update student profile (not implemented in backend)
  async updateStudentProfile(studentId: number, profileData: Partial<StudentProfile>): Promise<StudentProfile> {
    try {
      // This endpoint doesn't exist in the backend
      console.warn('Student profile update endpoint not implemented in backend');
      throw new Error('Student profile update not implemented');
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  },

  // Upload document (certificate)
  async uploadDocument(studentId: number, file: File, type: string): Promise<StudentDocument> {
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await api.post('/upload/certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Then create the certificate record
      const certificateData = {
        studentId: studentId,
        certificateName: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        certificateType: type,
        fileName: file.name,
        filePath: uploadResponse.data.fileUrl,
        fileSize: file.size,
        fileType: file.type
      };

      const response = await api.post('/certificates/upload', certificateData);
      
      // Transform certificate response to document format
      return {
        id: response.data.id,
        name: response.data.certificateName,
        type: response.data.certificateType,
        url: response.data.filePath,
        status: response.data.status,
        uploadedAt: response.data.submittedAt,
        approvedAt: response.data.reviewedAt
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Add parent/guardian (not implemented in backend)
  async addParent(studentId: number, parentData: Omit<StudentParent, 'id'>): Promise<StudentParent> {
    try {
      console.warn('Add parent endpoint not implemented in backend');
      throw new Error('Add parent not implemented');
    } catch (error) {
      console.error('Error adding parent:', error);
      throw error;
    }
  },

  // Update parent/guardian (not implemented in backend)
  async updateParent(studentId: number, parentId: number, parentData: Partial<StudentParent>): Promise<StudentParent> {
    try {
      console.warn('Update parent endpoint not implemented in backend');
      throw new Error('Update parent not implemented');
    } catch (error) {
      console.error('Error updating parent:', error);
      throw error;
    }
  },

  // Delete parent/guardian (not implemented in backend)
  async deleteParent(studentId: number, parentId: number): Promise<void> {
    try {
      console.warn('Delete parent endpoint not implemented in backend');
      throw new Error('Delete parent not implemented');
    } catch (error) {
      console.error('Error deleting parent:', error);
      throw error;
    }
  },

  // Get student attendance (using attendance endpoint)
  async getStudentAttendance(studentId: number, startDate?: string, endDate?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/attendance/student/${studentId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      return [];
    }
  },

  // Get student grades (not implemented in backend)
  async getStudentGrades(studentId: number, semester?: string, year?: number): Promise<any[]> {
    try {
      console.warn('Student grades endpoint not implemented in backend');
      return [];
    } catch (error) {
      console.error('Error fetching student grades:', error);
      return [];
    }
  },

  // Generate student report (not implemented in backend)
  async generateStudentReport(studentId: number, reportType: 'academic' | 'activities' | 'attendance', format: 'pdf' | 'excel'): Promise<Blob> {
    try {
      console.warn('Student report generation endpoint not implemented in backend');
      throw new Error('Student report generation not implemented');
    } catch (error) {
      console.error('Error generating student report:', error);
      throw error;
    }
  }
};

export default studentService;


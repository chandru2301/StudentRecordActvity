import api from './authService';

// Service for fetching profile-related data
export const profileService = {
  // Fetch student-specific data
  async getStudentData(studentId: number) {
    try {
      // These would be actual API calls in a real application
      const [feedbacks, performance, parents, documents] = await Promise.all([
        this.getStudentFeedbacks(studentId),
        this.getStudentPerformance(studentId),
        this.getStudentParents(studentId),
        this.getStudentDocuments(studentId)
      ]);

      return {
        feedbacks,
        performance,
        parents,
        documents
      };
    } catch (error) {
      console.error('Error fetching student data:', error);
      throw error;
    }
  },

  // Fetch faculty-specific data
  async getFacultyData(facultyId: number) {
    try {
      const [submissions, attendance, feedbackLogs, documents, schedule] = await Promise.all([
        this.getStudentSubmissions(facultyId),
        this.getAttendanceData(facultyId),
        this.getFacultyFeedbackLogs(facultyId),
        this.getFacultyDocuments(facultyId),
        this.getFacultySchedule(facultyId)
      ]);

      return {
        submissions,
        attendance,
        feedbackLogs,
        documents,
        schedule
      };
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      throw error;
    }
  },

  // Individual API methods (these would be real API endpoints)
  async getStudentFeedbacks(studentId: number) {
    // return api.get(`/students/${studentId}/feedbacks`);
    return Promise.resolve([]); // Mock for now
  },

  async getStudentPerformance(studentId: number) {
    // return api.get(`/students/${studentId}/performance`);
    return Promise.resolve([]); // Mock for now
  },

  async getStudentParents(studentId: number) {
    // return api.get(`/students/${studentId}/parents`);
    return Promise.resolve([]); // Mock for now
  },

  async getStudentDocuments(studentId: number) {
    // return api.get(`/students/${studentId}/documents`);
    return Promise.resolve([]); // Mock for now
  },

  async getStudentSubmissions(facultyId: number) {
    // return api.get(`/faculty/${facultyId}/submissions`);
    return Promise.resolve([]); // Mock for now
  },

  async getAttendanceData(facultyId: number) {
    // return api.get(`/faculty/${facultyId}/attendance`);
    return Promise.resolve([]); // Mock for now
  },

  async getFacultyFeedbackLogs(facultyId: number) {
    // return api.get(`/faculty/${facultyId}/feedback-logs`);
    return Promise.resolve([]); // Mock for now
  },

  async getFacultyDocuments(facultyId: number) {
    // return api.get(`/faculty/${facultyId}/documents`);
    return Promise.resolve([]); // Mock for now
  },

  async getFacultySchedule(facultyId: number) {
    // return api.get(`/faculty/${facultyId}/schedule`);
    return Promise.resolve([]); // Mock for now
  },

  // Update profile methods
  async updateStudentProfile(studentId: number, profileData: any) {
    return api.put(`/students/${studentId}/profile`, profileData);
  },

  async updateFacultyProfile(facultyId: number, profileData: any) {
    return api.put(`/faculty/${facultyId}/profile`, profileData);
  },

  // Document management
  async uploadDocument(userId: number, file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return api.post(`/users/${userId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async approveDocument(documentId: number) {
    return api.put(`/documents/${documentId}/approve`);
  },

  async rejectDocument(documentId: number, reason: string) {
    return api.put(`/documents/${documentId}/reject`, { reason });
  },

  // Feedback management
  async submitFeedback(facultyId: number, studentId: number, feedbackData: any) {
    return api.post(`/faculty/${facultyId}/feedback`, {
      studentId,
      ...feedbackData
    });
  },

  // Report generation
  async generateReport(userId: number, reportType: string, format: 'pdf' | 'excel') {
    return api.get(`/users/${userId}/reports/${reportType}`, {
      params: { format },
      responseType: 'blob'
    });
  }
};

export default profileService;

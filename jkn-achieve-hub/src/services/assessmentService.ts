import { 
  AssessmentRequest, 
  AssessmentResponse, 
  StudentAnswerRequest, 
  StudentAnswerResponse, 
  GradeAnswerRequest,
  AssessmentType,
  QuestionType
} from '../types/assessment';

const API_BASE_URL = 'http://localhost:8081/api';

class AssessmentService {
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
      console.log('API response data length:', Array.isArray(data) ? data.length : 'not an array');
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
   * Create a new assessment
   */
  async createAssessment(data: AssessmentRequest): Promise<AssessmentResponse> {
    return this.request<AssessmentResponse>('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update an assessment
   */
  async updateAssessment(id: number, data: AssessmentRequest): Promise<AssessmentResponse> {
    return this.request<AssessmentResponse>(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Publish an assessment
   */
  async publishAssessment(id: number): Promise<AssessmentResponse> {
    return this.request<AssessmentResponse>(`/assessments/${id}/publish`, {
      method: 'PUT',
    });
  }

  /**
   * Get assessment by ID
   */
  async getAssessmentById(id: number): Promise<AssessmentResponse> {
    return this.request<AssessmentResponse>(`/assessments/${id}`);
  }

  /**
   * Get assessment with questions
   */
  async getAssessmentWithQuestions(id: number): Promise<AssessmentResponse> {
    return this.request<AssessmentResponse>(`/assessments/${id}/questions`);
  }

  /**
   * Get assessments by faculty
   */
  async getAssessmentsByFaculty(facultyId: number): Promise<AssessmentResponse[]> {
    return this.request<AssessmentResponse[]>(`/assessments/faculty/${facultyId}`);
  }

  /**
   * Get all active assessments
   */
  async getAllActiveAssessments(): Promise<AssessmentResponse[]> {
    console.log('Calling getAllActiveAssessments endpoint...');
    const result = await this.request<AssessmentResponse[]>('/assessments/active');
    console.log('getAllActiveAssessments result:', result);
    return result;
  }

  /**
   * Get available assessments for student
   */
  async getAvailableAssessmentsForStudent(studentId: number): Promise<AssessmentResponse[]> {
    console.log(`Calling getAvailableAssessmentsForStudent endpoint for student ${studentId}...`);
    const result = await this.request<AssessmentResponse[]>(`/assessments/student/${studentId}/available`);
    console.log(`getAvailableAssessmentsForStudent result for student ${studentId}:`, result);
    return result;
  }

  /**
   * Submit student answer
   */
  async submitAnswer(data: StudentAnswerRequest): Promise<StudentAnswerResponse> {
    return this.request<StudentAnswerResponse>('/assessments/answers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Grade a student answer
   */
  async gradeAnswer(data: GradeAnswerRequest): Promise<StudentAnswerResponse> {
    return this.request<StudentAnswerResponse>('/assessments/answers/grade', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get student answers for an assessment
   */
  async getStudentAnswersForAssessment(assessmentId: number): Promise<StudentAnswerResponse[]> {
    return this.request<StudentAnswerResponse[]>(`/assessments/${assessmentId}/answers`);
  }

  /**
   * Get answers that need grading
   */
  async getAnswersNeedingGrading(facultyId: number): Promise<StudentAnswerResponse[]> {
    return this.request<StudentAnswerResponse[]>(`/assessments/faculty/${facultyId}/grading`);
  }

  /**
   * Delete an assessment
   */
  async deleteAssessment(id: number): Promise<void> {
    return this.request<void>(`/assessments/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get available assessment types
   */
  async getAvailableAssessmentTypes(): Promise<string[]> {
    return this.request<string[]>('/assessments/types');
  }

  /**
   * Get available question types
   */
  async getAvailableQuestionTypes(): Promise<string[]> {
    return this.request<string[]>('/assessments/question-types');
  }

  /**
   * Get assessment statistics for faculty
   */
  async getAssessmentStats(facultyId: number): Promise<{
    totalAssessments: number;
    activeAssessments: number;
    completedAssessments: number;
    totalSubmissions: number;
    pendingGrading: number;
  }> {
    try {
      const assessments = await this.getAssessmentsByFaculty(facultyId);
      const answersNeedingGrading = await this.getAnswersNeedingGrading(facultyId);
      
      const totalAssessments = assessments.length;
      const activeAssessments = assessments.filter(a => a.status === 'ACTIVE').length;
      const completedAssessments = assessments.filter(a => a.status === 'COMPLETED').length;
      const pendingGrading = answersNeedingGrading.length;
      
      // Calculate total submissions (this would need a separate endpoint in a real implementation)
      const totalSubmissions = assessments.reduce((sum, assessment) => {
        return sum + (assessment.totalSubmissions || 0);
      }, 0);

      return {
        totalAssessments,
        activeAssessments,
        completedAssessments,
        totalSubmissions,
        pendingGrading
      };
    } catch (error) {
      console.error('Error getting assessment stats:', error);
      return {
        totalAssessments: 0,
        activeAssessments: 0,
        completedAssessments: 0,
        totalSubmissions: 0,
        pendingGrading: 0
      };
    }
  }

  /**
   * Get student assessment progress
   */
  async getStudentAssessmentProgress(studentId: number): Promise<{
    availableAssessments: AssessmentResponse[];
    completedAssessments: AssessmentResponse[];
    inProgressAssessments: AssessmentResponse[];
  }> {
    try {
      // Get all active assessments first
      const allActiveAssessments = await this.getAllActiveAssessments();
      
      // Get assessments the student has attempted
      const attemptedAssessments = await this.getAvailableAssessmentsForStudent(studentId);
      
      // Filter out attempted assessments from available ones
      const availableAssessments = allActiveAssessments.filter(
        assessment => !attemptedAssessments.some(attempted => attempted.id === assessment.id)
      );

      // In a real implementation, you would have separate endpoints for completed and in-progress assessments
      // For now, we'll simulate this data
      const completedAssessments: AssessmentResponse[] = [];
      const inProgressAssessments: AssessmentResponse[] = [];

      return {
        availableAssessments,
        completedAssessments,
        inProgressAssessments
      };
    } catch (error) {
      console.error('Error getting student assessment progress:', error);
      return {
        availableAssessments: [],
        completedAssessments: [],
        inProgressAssessments: []
      };
    }
  }
}

export const assessmentService = new AssessmentService();

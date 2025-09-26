import { CertificateUploadRequest, CertificateResponse, CertificateSummaryResponse, CertificateReviewRequest } from '../types/certificate';

const API_BASE_URL = 'http://localhost:8081/api';

class CertificateService {
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
   * Upload a certificate
   */
  async uploadCertificate(data: CertificateUploadRequest): Promise<CertificateResponse> {
    return this.request<CertificateResponse>('/certificates/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Review a certificate (approve/reject)
   */
  async reviewCertificate(data: CertificateReviewRequest): Promise<CertificateResponse> {
    return this.request<CertificateResponse>('/certificates/review', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get certificate by ID
   */
  async getCertificateById(id: number): Promise<CertificateResponse> {
    return this.request<CertificateResponse>(`/certificates/${id}`);
  }

  /**
   * Get all certificates for a student
   */
  async getCertificatesByStudent(studentId: number): Promise<CertificateResponse[]> {
    return this.request<CertificateResponse[]>(`/certificates/student/${studentId}`);
  }

  /**
   * Get certificates for a student with pagination
   */
  async getCertificatesByStudentWithPagination(
    studentId: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'submittedAt',
    sortDir: string = 'desc'
  ): Promise<{ content: CertificateResponse[]; totalElements: number; totalPages: number; size: number; number: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });
    return this.request(`/certificates/student/${studentId}/paginated?${params}`);
  }

  /**
   * Get certificate summary for a student
   */
  async getCertificateSummary(studentId: number): Promise<CertificateSummaryResponse> {
    return this.request<CertificateSummaryResponse>(`/certificates/student/${studentId}/summary`);
  }

  /**
   * Get certificates by status (for faculty review)
   */
  async getCertificatesByStatus(status: string): Promise<CertificateResponse[]> {
    return this.request<CertificateResponse[]>(`/certificates/status/${status}`);
  }

  /**
   * Get certificates by status with pagination
   */
  async getCertificatesByStatusWithPagination(
    status: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'submittedAt',
    sortDir: string = 'asc'
  ): Promise<{ content: CertificateResponse[]; totalElements: number; totalPages: number; size: number; number: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    });
    return this.request(`/certificates/status/${status}/paginated?${params}`);
  }

  /**
   * Get certificates reviewed by specific faculty
   */
  async getCertificatesReviewedBy(reviewedBy: string): Promise<CertificateResponse[]> {
    return this.request<CertificateResponse[]>(`/certificates/reviewed-by/${encodeURIComponent(reviewedBy)}`);
  }

  /**
   * Delete a certificate
   */
  async deleteCertificate(id: number): Promise<void> {
    return this.request<void>(`/certificates/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get available certificate types
   */
  async getAvailableCertificateTypes(): Promise<string[]> {
    return this.request<string[]>('/certificates/types');
  }

  /**
   * Get available certificate statuses
   */
  async getAvailableCertificateStatuses(): Promise<string[]> {
    return this.request<string[]>('/certificates/statuses');
  }
}

export const certificateService = new CertificateService();

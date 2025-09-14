import api from './authService';

export interface FileUploadResponse {
  fileUrl: string;
  message: string;
}

export interface FileExistsResponse {
  exists: boolean;
  fileUrl: string;
}

export const fileUploadService = {
  async uploadCertificate(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/certificate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  async deleteFile(fileUrl: string): Promise<void> {
    await api.delete(`/upload/file?fileUrl=${encodeURIComponent(fileUrl)}`);
  },

  async checkFileExists(fileUrl: string): Promise<FileExistsResponse> {
    const response = await api.get(`/upload/file/exists?fileUrl=${encodeURIComponent(fileUrl)}`);
    return response.data;
  },

  getFileUrl(fileUrl: string): string {
    if (!fileUrl) return '';
    
    // If it's already a full URL, return as is
    if (fileUrl.startsWith('http')) {
      return fileUrl;
    }
    
    // If it's a relative path, prepend the API base URL
    const baseUrl = api.defaults.baseURL || 'http://localhost:8081/api';
    return `${baseUrl.replace('/api', '')}${fileUrl}`;
  }
};

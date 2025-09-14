import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  role: 'STUDENT' | 'FACULTY';
  profile?: StudentProfile | FacultyProfile;
}

export interface StudentProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  degree: string;
  dob: string;
  rollNumber: string;
  type: 'HOSTELLER' | 'DAY_SCHOLAR';
}

export interface FacultyProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  captcha: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'STUDENT' | 'FACULTY';
  name?: string;
  degree?: string;
  dob?: string;
  rollNumber?: string;
  type?: 'HOSTELLER' | 'DAY_SCHOLAR';
  department?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  profile: StudentProfile | FacultyProfile;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};

export default api;

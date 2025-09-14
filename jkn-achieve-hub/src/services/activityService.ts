import api from './authService';

export interface Activity {
  id: number;
  activityType: 'HACKATHON' | 'INTER_COLLEGE' | 'OUTER_COLLEGE' | 'GOVERNMENT_EVENT';
  fromDate: string;
  toDate: string;
  certificateUrl?: string;
  feedback?: string;
  studentId: number;
  studentName?: string;
  studentEmail?: string;
  studentClassName?: string;
  studentDepartment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRequest {
  activityType: 'HACKATHON' | 'INTER_COLLEGE' | 'OUTER_COLLEGE' | 'GOVERNMENT_EVENT';
  fromDate: string;
  toDate: string;
  certificateUrl?: string;
  feedback?: string;
  studentId: number;
}

export interface ActivityType {
  value: 'HACKATHON' | 'INTER_COLLEGE' | 'OUTER_COLLEGE' | 'GOVERNMENT_EVENT';
  label: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { value: 'HACKATHON', label: 'Hackathon' },
  { value: 'INTER_COLLEGE', label: 'Inter College' },
  { value: 'OUTER_COLLEGE', label: 'Outer College' },
  { value: 'GOVERNMENT_EVENT', label: 'Government Event' }
];

export const activityService = {
  async createActivity(activityData: ActivityRequest): Promise<Activity> {
    const response = await api.post('/activities', activityData);
    return response.data;
  },

  async getActivitiesByStudent(studentId: number): Promise<Activity[]> {
    const response = await api.get(`/activities/student/${studentId}`);
    return response.data;
  },

  async getAllActivities(): Promise<Activity[]> {
    const response = await api.get('/activities');
    return response.data;
  },

  async getActivityById(id: number): Promise<Activity> {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  async updateActivity(id: number, activityData: ActivityRequest): Promise<Activity> {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },

  async deleteActivity(id: number): Promise<void> {
    await api.delete(`/activities/${id}`);
  },

  async getActivitiesByType(activityType: string): Promise<Activity[]> {
    const response = await api.get(`/activities/type/${activityType}`);
    return response.data;
  },

  async getActivitiesByDateRange(startDate: string, endDate: string): Promise<Activity[]> {
    const response = await api.get(`/activities/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  async countActivitiesByStudent(studentId: number): Promise<number> {
    const response = await api.get(`/activities/student/${studentId}/count`);
    return response.data;
  }
};

import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  },
};

// Types mirroring backend DTOs for Profile page
export interface UserPreferences {
  notifications: boolean;
  theme: string;
  language: string;
}

export interface ProfileKnowledgeArea {
  id: number;
  name: string;
  level: number;
  lastUpdated?: string | null;
}

export interface ProfileCareerMilestone {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  date?: string | null;
  plannedDate?: string | null;
}

export interface UserProfile {
  id: number;
  name:string;
  email: string;
  role: string;
  isActive: boolean;
  lastActivityAt?: string | null;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  knowledgeAreas: ProfileKnowledgeArea[];
  careerMilestones: ProfileCareerMilestone[];
}

// Types mirroring backend DTOs for Admin Dashboard page
export interface KnowledgeHeatMapItem {
  id: number;
  area: string;
  level: number;
  ownerName: string;
  ownerEmail: string;
  ownerId: number;
  vulnerabilityScore?: number | null;
}

export interface DashboardStats {
  keyKnowledgeAreas: number;
  vulnerabilityAlerts: number;
  technicalDocuments: number;
}

export interface AdminDashboardData {
  heatMapData: KnowledgeHeatMapItem[];
  stats: DashboardStats;
}

// API function for Admin Dashboard
export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const response = await api.get<AdminDashboardData>('/dashboard/admin-data');
  return response.data;
};

export default api; 
import { AuthResponse, User } from '@/types/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const request = async <T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  
  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'API request failed');
    return data;
  } catch (error) {
    console.log('❌ Network Error:', error);
    throw error;
  }
};

export const AuthApi = {
  signup: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
    request<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: (token: string) =>
    request<{ success: boolean; data: { user: User } }>('/auth/me', {}, token),
  logout: (token: string) =>
    request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }, token),
  verifyEmail: (token: string) =>
    request<AuthResponse>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  resendVerificationEmail: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  forgotPassword: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  validateResetToken: (token: string) =>
    request<{ success: boolean; message: string }>('/auth/validate-reset-token', { method: 'POST', body: JSON.stringify({ token }) }),
  resetPassword: (token: string, password: string) =>
    request<{ success: boolean; message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};
import {
  BankAccountCreateRequest,
  BankAccountDeleteResponse,
  BankAccountResponse,
  BankAccountsResponse,
  BankAccountUpdateRequest,
  RateUserRequest,
  RateUserResponse,
  User,
  UserRating,
} from '@/types/api';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const request = async <T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API request failed');
  return data;
};

const requestMultipart = async <T>(endpoint: string, formData: FormData, token?: string): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { method: 'POST', headers, body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'API request failed');
  return data;
};

export const UsersApi = {
  getProfile: (token: string) =>
    request<{ success: boolean; data: { user: User } }>('/user/profile', {}, token),

  updateProfile: (token: string, data: { firstName?: string; lastName?: string }) =>
    request<{ success: boolean; data: { user: User } }>('/user/profile', { method: 'PATCH', body: JSON.stringify(data) }, token),

  uploadAvatar: (token: string, formData: FormData) =>
    requestMultipart<{ success: boolean; data: { avatarUrl: string } }>('/user/avatar', formData, token),

  deleteAvatar: (token: string) =>
    request<{ success: boolean; message: string }>('/user/avatar', { method: 'DELETE' }, token),

  getBankAccounts: (token: string) =>
    request<BankAccountsResponse>('/user/bank-accounts', {}, token),

  getBankAccount: (token: string, id: string) =>
    request<BankAccountResponse>(`/user/bank-accounts/${id}`, {}, token),

  addBankAccount: (token: string, data: BankAccountCreateRequest) =>
    request<BankAccountResponse>('/user/bank-accounts', { method: 'POST', body: JSON.stringify(data) }, token),

  updateBankAccount: (token: string, id: string, data: BankAccountUpdateRequest) =>
    request<BankAccountResponse>(`/user/bank-accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token),

  setDefaultBankAccount: (token: string, id: string) =>
    request<BankAccountResponse>(`/user/bank-accounts/${id}/default`, { method: 'PATCH' }, token),

  deleteBankAccount: (token: string, id: string) =>
    request<BankAccountDeleteResponse>(`/user/bank-accounts/${id}`, { method: 'DELETE' }, token),

  rateUser: (token: string, userId: string, data: RateUserRequest) =>
    request<RateUserResponse>(
      `/user/rate/${userId}`,
      { method: 'POST', body: JSON.stringify(data) },
      token
    ),

  getUserRating: (token: string, userId: string) =>
    request<{ success: boolean; data: { averageRating: number; totalRatings: number } }>(
      `/user/rating/${userId}`, {}, token
    ),

  getMyRating: (token: string) =>
    request<{ success: boolean; data: { averageRating: number; totalRatings: number } }>(
      '/user/my-rating', {}, token
    ),

  getRatingsGiven: (token: string) =>
    request<{ success: boolean; data: { ratings: UserRating[] } }>(
      '/user/ratings-given', {}, token
    ),
}; 
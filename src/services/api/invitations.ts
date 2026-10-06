import { InvitationsResponse, RemindInvitationsResponse } from '@/types/api';
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

export const InvitationsApi = {
  getPendingInvitations: (token: string) =>
    request<InvitationsResponse>('/invitations/pending', {}, token),
  acceptInvitation: (token: string, invitationId: string) =>
    request(`/invitations/${invitationId}/accept`, { method: 'POST' }, token),
  declineInvitation: (token: string, invitationId: string) =>
    request(`/invitations/${invitationId}/decline`, { method: 'POST' }, token),
  inviteByEmail: (token: string, circleId: string, emails: string[]) =>
    request(`/invitations/send`, { method: 'POST', body: JSON.stringify({ circleId, invitedEmails: emails }) }, token),
  remindInvitees: (token: string, circleId: string, emails: string[]) =>
    request<RemindInvitationsResponse>(`/invitations/remind`, { method: 'POST', body: JSON.stringify({ circleId, emails }) }, token),
  getByEmail: (token: string, email: string) =>
    request<InvitationsResponse>(`/invitations/by-email/${encodeURIComponent(email)}`, {}, token),
  claimInvitation: (token: string, invitationId: string) =>
    request(`/invitations/${invitationId}/claim`, { method: 'POST' }, token),
}; 
import {
  CircleResponse,
  CirclesResponse,
  CreateCircleRequest,
  CreateCircleResponse,
  DrawResponse,
  InviteUsersResponse,
} from "@/types/api";

export interface RoundDeposit {
  memberId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  confirmedAt: string;
}

export interface RoundDepositsResponse {
  roundNumber: number;
  status: string;
  dueDate: string;
  confirmed: number;
  total: number;
  allConfirmed: boolean;
  deposits: RoundDeposit[];
}
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "API request failed");
  return data;
};

export const CirclesApi = {
  getCircles: (token: string, params?: { status?: string; type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.type) searchParams.append("type", params.type);
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/circles?${queryString}` : "/circles";
    return request<CirclesResponse>(endpoint, {}, token);
  },
  getCircle: (token: string, id: string) =>
    request<CircleResponse>(`/circles/${id}`, {}, token),
  createCircle: (token: string, circleData: CreateCircleRequest) =>
    request<CreateCircleResponse>(
      "/circles",
      { method: "POST", body: JSON.stringify(circleData) },
      token,
    ),
  inviteUsers: (token: string, circleId: string, userIds: string[]) =>
    request<InviteUsersResponse>(
      `/circles/${circleId}/invite`,
      { method: "POST", body: JSON.stringify({ userIds }) },
      token,
    ),
  performDraw: (token: string, circleId: string) =>
    request<DrawResponse>(
      `/circles/${circleId}/draw`,
      { method: "POST" },
      token,
    ),
  verifyPayment: (
    token: string,
    circleId: string,
    data: { paymentAmount: number },
  ) =>
    request<{ message: string; payment: any }>(
      `/circles/${circleId}/payments/verify`,
      { method: "PUT", body: JSON.stringify(data) },
      token,
    ),
  cancelCircle: (token: string, circleId: string) =>
    request<{ message: string; circle: any }>(
      `/circles/${circleId}/cancel`,
      { method: "PUT" },
      token,
    ),
  markOverdue: (token: string, circleId: string, roundNumber: number) =>
    request<{ message: string }>(
      `/circles/${circleId}/payments/${roundNumber}/overdue`,
      { method: "PUT" },
      token,
    ),
  getRoundDeposits: (token: string, circleId: string, roundNumber: number) =>
    request<RoundDepositsResponse>(
      `/circles/${circleId}/payments/${roundNumber}/deposits`,
      {},
      token,
    ),
  confirmMemberPayment: (
    token: string,
    circleId: string,
    roundNumber: number,
    memberId: string,
  ) =>
    request<{ message: string }>(
      `/circles/${circleId}/payments/${roundNumber}/members/${memberId}/confirm`,
      { method: "POST" },
      token,
    ),
};

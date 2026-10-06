import { FeedResponse } from "@/types/api";

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

export const FeedApi = {
  getFeed: (token: string, cursor?: string) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    const qs = params.toString();
    const endpoint = qs ? `/feed?${qs}` : "/feed";
    return request<FeedResponse>(endpoint, {}, token);
  },
};

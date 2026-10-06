import { CirclesApi, RoundDepositsResponse } from '@/services/api/circles';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/services/AuthContext';

export const circlesKeys = {
  all: ['circles'] as const,
  detail: (id: string) => ['circles', id] as const,
  deposits: (id: string, roundNumber: number) => ['circles', id, 'deposits', roundNumber] as const,
};

export const useCircles = (params?: { status?: string; type?: string }) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: [...circlesKeys.all, params],
    queryFn: () => CirclesApi.getCircles(token!, params),
    enabled: !!token,
  });
};

export const useCircle = (id: string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: circlesKeys.detail(id),
    queryFn: () => CirclesApi.getCircle(token!, id),
    enabled: !!token && !!id,
  });
};

export const useRoundDeposits = (circleId: string, roundNumber: number | undefined) => {
  const { token } = useAuth();

  return useQuery<RoundDepositsResponse>({
    queryKey: circlesKeys.deposits(circleId, roundNumber!),
    queryFn: () => CirclesApi.getRoundDeposits(token!, circleId, roundNumber!),
    enabled: !!token && !!circleId && roundNumber !== undefined,
  });
};

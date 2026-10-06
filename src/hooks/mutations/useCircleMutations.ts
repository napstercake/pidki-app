import { CirclesApi } from '@/services/api/circles';
import { CreateCircleRequest } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/services/AuthContext';
import { circlesKeys } from '@/hooks/queries/useCircles';

export const useCreateCircle = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (circleData: CreateCircleRequest) =>
      CirclesApi.createCircle(token!, circleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circlesKeys.all });
    },
  });
};

export const useInviteUsers = (circleId: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) =>
      CirclesApi.inviteUsers(token!, circleId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circlesKeys.detail(circleId) });
    },
  });
};

export const usePerformDraw = (circleId: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CirclesApi.performDraw(token!, circleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circlesKeys.all });
      queryClient.invalidateQueries({ queryKey: circlesKeys.detail(circleId) });
    },
  });
};

export const useVerifyPayment = (circleId: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { paymentAmount: number }) =>
      CirclesApi.verifyPayment(token!, circleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circlesKeys.detail(circleId) });
    },
  });
};

export const useCancelCircle = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (circleId: string) =>
      CirclesApi.cancelCircle(token!, circleId),
    onSuccess: (_, circleId) => {
      queryClient.invalidateQueries({ queryKey: circlesKeys.all });
      queryClient.invalidateQueries({ queryKey: circlesKeys.detail(circleId) });
    },
  });
};

export const useConfirmMemberPayment = (circleId: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roundNumber, memberId }: { roundNumber: number; memberId: string }) =>
      CirclesApi.confirmMemberPayment(token!, circleId, roundNumber, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circlesKeys.detail(circleId) });
    },
  });
};

export const useMarkOverdue = (circleId: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roundNumber: number) =>
      CirclesApi.markOverdue(token!, circleId, roundNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circlesKeys.detail(circleId) });
    },
  });
};

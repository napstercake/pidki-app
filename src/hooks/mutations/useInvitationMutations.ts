import { useAuth } from '@/services/AuthContext';
import { InvitationsApi } from '@/services/api/invitations';
import { invitationsKeys } from '@/hooks/queries/useInvitations';
import { circlesKeys } from '@/hooks/queries/useCircles';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAcceptInvitation = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      InvitationsApi.acceptInvitation(token!, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationsKeys.pending });
      queryClient.invalidateQueries({ queryKey: circlesKeys.all });
    },
  });
};

export const useDeclineInvitation = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      InvitationsApi.declineInvitation(token!, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationsKeys.pending });
    },
  });
};

export const useInviteByEmail = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ circleId, emails }: { circleId: string; emails: string[] }) =>
      InvitationsApi.inviteByEmail(token!, circleId, emails),
  });
};

export const useClaimInvitation = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      InvitationsApi.claimInvitation(token!, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationsKeys.pending });
      queryClient.invalidateQueries({ queryKey: circlesKeys.all });
    },
  });
};

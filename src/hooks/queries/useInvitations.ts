import { useAuth } from '@/services/AuthContext';
import { InvitationsApi } from '@/services/api/invitations';
import { useQuery } from '@tanstack/react-query';

export const invitationsKeys = {
  pending: ['invitations', 'pending'] as const,
  byEmail: (email: string) => ['invitations', 'by-email', email] as const,
};

export const usePendingInvitations = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: invitationsKeys.pending,
    queryFn: () => InvitationsApi.getPendingInvitations(token!),
    enabled: !!token,
  });
};

export const useInvitationsByEmail = (email: string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: invitationsKeys.byEmail(email),
    queryFn: () => InvitationsApi.getByEmail(token!, email),
    enabled: !!token && !!email,
  });
};

import { useAuth } from '@/services/AuthContext';
import { UsersApi } from '@/services/api/users';
import { useQuery } from '@tanstack/react-query';

export const userKeys = {
  bankAccounts: ['user', 'bank-accounts'] as const,
  bankAccount: (id: string) => ['user', 'bank-accounts', id] as const,
  rating: (userId: string) => ['user', 'rating', userId] as const,
  myRating: ['user', 'my-rating'] as const,
  ratingsGiven: ['user', 'ratings-given'] as const,
};

export const useBankAccounts = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: userKeys.bankAccounts,
    queryFn: () => UsersApi.getBankAccounts(token!),
    enabled: !!token,
  });
};

export const useBankAccount = (id: string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: userKeys.bankAccount(id),
    queryFn: () => UsersApi.getBankAccount(token!, id),
    enabled: !!token && !!id,
  });
};

export const useUserRating = (userId: string) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: userKeys.rating(userId),
    queryFn: () => UsersApi.getUserRating(token!, userId),
    enabled: !!token && !!userId,
  });
};

export const useMyRating = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: userKeys.myRating,
    queryFn: () => UsersApi.getMyRating(token!),
    enabled: !!token,
  });
};

export const useRatingsGiven = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: userKeys.ratingsGiven,
    queryFn: () => UsersApi.getRatingsGiven(token!),
    enabled: !!token,
  });
};

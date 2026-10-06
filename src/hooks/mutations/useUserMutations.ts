import { useAuth } from '@/services/AuthContext';
import { UsersApi } from '@/services/api/users';
import { userKeys } from '@/hooks/queries/useUser';
import { BankAccountCreateRequest, BankAccountUpdateRequest, RateUserRequest } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const { token, refreshUser } = useAuth();

  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string }) =>
      UsersApi.updateProfile(token!, data),
    onSuccess: () => {
      refreshUser();
    },
  });
};

export const useUploadAvatar = () => {
  const { token, refreshUser } = useAuth();

  return useMutation({
    mutationFn: (formData: FormData) =>
      UsersApi.uploadAvatar(token!, formData),
    onSuccess: () => {
      refreshUser();
    },
  });
};

export const useDeleteAvatar = () => {
  const { token, refreshUser } = useAuth();

  return useMutation({
    mutationFn: () => UsersApi.deleteAvatar(token!),
    onSuccess: () => {
      refreshUser();
    },
  });
};

export const useAddBankAccount = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BankAccountCreateRequest) =>
      UsersApi.addBankAccount(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.bankAccounts });
    },
  });
};

export const useUpdateBankAccount = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BankAccountUpdateRequest }) =>
      UsersApi.updateBankAccount(token!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.bankAccounts });
    },
  });
};

export const useSetDefaultBankAccount = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsersApi.setDefaultBankAccount(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.bankAccounts });
    },
  });
};

export const useDeleteBankAccount = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UsersApi.deleteBankAccount(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.bankAccounts });
    },
  });
};

export const useRateUser = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: RateUserRequest }) =>
      UsersApi.rateUser(token!, userId, data),
  });
};

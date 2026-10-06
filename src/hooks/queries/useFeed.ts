import { FeedApi } from '@/services/api/feed';
import { useAuth } from '@/services/AuthContext';
import { useQuery } from '@tanstack/react-query';

export const feedKeys = {
  all: ['feed'] as const,
};

export const useFeed = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: feedKeys.all,
    queryFn: () => FeedApi.getFeed(token!),
    enabled: !!token,
  });
};

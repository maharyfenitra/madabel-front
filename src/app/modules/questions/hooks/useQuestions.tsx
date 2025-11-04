import { useFetch } from '@/app/lib/api/useFetch';
import { useQuery } from '@tanstack/react-query';
import { URL_CONFIG } from '@/app/lib/api/configServer';
import { useAccessToken } from '@/app/lib/api/useAccessToken';

export const useQuestions = (quizId?: number) => {
  const sendRequest = useFetch();
  const { getAccessToken } = useAccessToken();

  return useQuery({
    enabled: !!quizId,
    queryKey: ['list-of-questions', quizId],
    queryFn: async () => {
      const token = getAccessToken();
      const res = await sendRequest('GET', `${URL_CONFIG.uri}/quizzes/${quizId}/questions`, {}, { ...(token ? { Authorization: `Token ${token}` } : {}) });
      return res?.data?.data || [];
    },
  });
};

export default useQuestions;

import { useMutation } from '@tanstack/react-query';
import { useFetch } from '@/app/lib/api/useFetch';
import { URL_CONFIG } from '@/app/lib/api/configServer';

export const useSubmitAnswers = (participantId?: number) => {
  const sendRequest = useFetch();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await sendRequest('POST', `${URL_CONFIG.uri}/candidate-evaluations/participant/${participantId}/submit`, payload);
      return res?.data;
    }
  });
};

export default useSubmitAnswers;

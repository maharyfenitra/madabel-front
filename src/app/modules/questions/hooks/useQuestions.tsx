import { useFetch } from '@/app/lib/api/useFetch';
import { useGenericQuery } from '@/app/lib/api';
import { formatDataFromQuery } from '@/app/lib/api';
import { useAccessToken } from '@/app/lib/api/useAccessToken';

export const useQuestions = (quizId?: number) => {
  const { data , isLoading} = useGenericQuery((data) => {
    return formatDataFromQuery(data);
  }, `/quizzes/${quizId}/questions`, "list-of-questions")
  
  return { questions: data?.questions || [], isLoading}
};

export default useQuestions;

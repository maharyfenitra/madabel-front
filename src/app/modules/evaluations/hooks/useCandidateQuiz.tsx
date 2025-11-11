import { useGenericQuery } from '@/app/lib/api';
import { formatDataFromQuery } from '@/app/lib/api';

export const useCandidateQuiz = (quizId?: number, page: number = 1, limit: number = 5) => {
  // do not call the API if no quizId
  if (!quizId) {
    return { data: null, isLoading: false, error: null } as any;
  }

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  const {data, isLoading, error} =  useGenericQuery((raw: any) => {
    const axiosResponse = raw?.data;
    const body = axiosResponse?.data ?? axiosResponse ?? {};
    return {
      data: body.quiz ?? null,
      isLoading: raw.isLoading,
      error: raw.error,
    } as any;
  }, `/candidate-evaluations/quiz/${quizId}?${queryParams}`, `candidate-quiz-${quizId}-page-${page}-limit-${limit}`);

  console.log("Candidate Quiz Data:", data);

  return { data, isLoading, error };
};

export default useCandidateQuiz;

import { useGenericQuery } from '@/app/lib/api';
import { formatDataFromQuery } from '@/app/lib/api';

export const useCandidateQuiz = (quizId?: number) => {
  // do not call the API if no quizId
  if (!quizId) {
    return { data: null, isLoading: false, error: null } as any;
  }

  const {data, isLoading, error} =  useGenericQuery((raw: any) => {
    const axiosResponse = raw?.data;
    const body = axiosResponse?.data ?? axiosResponse ?? {};
    return {
      data: body.quiz ?? null,
      isLoading: raw.isLoading,
      error: raw.error,
    } as any;
  }, `/candidate-evaluations/quiz/${quizId}`, `candidate-quiz-${quizId}`);

  console.log("Candidate Quiz Data:", data);

  return { data, isLoading, error };
};

export default useCandidateQuiz;

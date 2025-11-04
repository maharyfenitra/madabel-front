import { useGetOneQuery } from '@/app/lib/api/queries/useGetOneQuery';

export const useQuiz = (id?: number) => {
  return useGetOneQuery('quizzes', id);
};

export default useQuiz;

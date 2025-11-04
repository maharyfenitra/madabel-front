import { useGenericMutation } from '@/app/lib/api';
import { toast } from 'sonner';

export const useNewQuestion = (quizId: number) => {
  const { mutateAsync } = useGenericMutation<any>(`/quizzes/${quizId}/questions`, 'POST');

  const createQuestion = async (payload: any) => {
    try {
      const data = await mutateAsync(payload);
      toast.success('Question ajoutée');
      return data;
    } catch (err: any) {
      toast.error('Impossible d\'ajouter la question');
      throw err;
    }
  };

  return { createQuestion };
};

export default useNewQuestion;

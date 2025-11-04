import { useGenericMutation } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useNewQuiz = () => {
  const { mutateAsync } = useGenericMutation<any>('/quizzes/');
  const router = useRouter();

  const createQuiz = async (payload: any) => {
    try {
      const data = await mutateAsync(payload);
      toast.success('Quiz créé');
      router.push('/modules/quizzes');
      return data;
    } catch (err: any) {
      toast.error('Impossible de créer le quiz');
      throw err;
    }
  };

  return { createQuiz };
};

export default useNewQuiz;

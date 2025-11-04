"use client";
import useQuiz from '../hooks/useQuiz';
import useQuestions from '../../questions/hooks/useQuestions';
import QuestionForm from '../../questions/details/components/QuestionForm';
import { useNewQuestion } from '../../questions/details/hooks/useNewQuestion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = { id: number };

const QuizDetail = ({ id }: Props) => {
  const res: any = useQuiz(id);
  const quiz = res?.data;
  const { data: questions = [], isLoading } = useQuestions(id);
  const { createQuestion } = useNewQuestion(id as number) as any;
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleAddQuestion = async (q: any) => {
    await createQuestion(q);
    // simple refresh: navigate to same page
    router.refresh();
  };

  if (res.isLoading) return <div>Chargement quiz...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{quiz?.title}</h1>
      <p className="text-sm text-muted-foreground">{quiz?.description}</p>

      <div className="mt-6">
        <h2 className="text-lg font-medium">Questions</h2>
        {isLoading ? <div>Chargement...</div> : (
          <ul className="mt-2 list-decimal pl-5">
            {(questions || []).map((q: any) => (
              <li key={q.id} className="mb-2">
                <div className="font-medium">{q.text}</div>
                <div className="text-sm text-muted-foreground">Type: {q.type}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-medium">Ajouter une question</h3>
        <QuestionForm onCreate={handleAddQuestion} />
      </div>
    </div>
  );
};

export default QuizDetail;

"use client";
import QuestionRenderer from '../components/QuestionRenderer';
import useCandidateQuiz from '../hooks/useCandidateQuiz';
import useSubmitAnswers from '../hooks/useSubmitAnswers';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Page() {
  const params = useParams() as { quizId?: string };
  const quizId = parseInt(String(params?.quizId || ''), 10);
  const { data: quiz, isLoading } = useCandidateQuiz(quizId);
  // NOTE: participantId must be known; for now assume participantId passed in query or use a fake id
  // We'll read participantId from search params if present
  const router = useRouter();
  const [answersMap, setAnswersMap] = useState<Record<number, any>>({});

  const submit = useSubmitAnswers(Number(/* placeholder participant id */ 0));

  if (isLoading) return <div>Chargement...</div>;
  if (!quiz) return <div>Quiz introuvable</div>;
  
  const handleChange = (questionId: number, value: any) => {
    setAnswersMap((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      // build answers array
      const answers = (quiz.questions || []).map((q: any) => {
        const val = answersMap[q.id];
        if (q.type === 'TEXT') return { questionId: q.id, textAnswer: val ?? '' };
        if (q.type === 'SCALE') return { questionId: q.id, numericAnswer: typeof val === 'number' ? val : null };
        if (q.type === 'MULTIPLE_CHOICE') return { questionId: q.id, selectedOptionIds: Array.isArray(val) ? val : [] };
        // SINGLE_CHOICE
        return { questionId: q.id, selectedOptionId: typeof val === 'number' ? val : null };
      });

      // get participantId from localStorage or query param — here we try query string
      const sp = new URLSearchParams(window.location.search);
      const participantId = Number(sp.get('participantId') || sp.get('p') || 0);
      if (!participantId) {
        toast.error('Participant non identifié (participantId manquant dans l\'URL)');
        return;
      }

      await submit.mutateAsync({ answers }, {
        onSuccess: () => {
          toast.success("Réponses envoyées");
          router.push('/');
        }
      });
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur lors de l\'envoi des réponses');
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{quiz.description}</p>

      <div className="space-y-6">
        {quiz.questions?.map((q: any) => (
          <QuestionRenderer key={q.id} question={q} value={answersMap[q.id]} onChange={handleChange} />
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600 text-black">Soumettre</Button>
      </div>
    </div>
  );
}

"use client";
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import useNewQuiz from '../hooks/useNewQuiz';
import QuestionForm from '../../../questions/details/components/QuestionForm';

const QuizForm = () => {
  const router = useRouter();
  const { createQuiz } = useNewQuiz();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);

  const handleAddQuestion = (q: any) => {
    setQuestions((prev) => [...prev, q]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      questions,
    };
    try {
      await createQuiz(payload);
    } catch (err) {
      // createQuiz already shows toast; keep user on form
      return;
    }
  };

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Créer un quiz</CardTitle>
      </CardHeader>

      <Separator />

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="title" className="mb-2">Titre</Label>
              <Input id="title" name="title" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="Titre du quiz" required />
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">Description</Label>
              <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" placeholder="Description du quiz" />
            </div>

            <div>
              <h3 className="font-medium mb-2">Ajouter une question</h3>
              <QuestionForm onCreate={handleAddQuestion} />

              {questions.length > 0 && (
                <div className="mt-4">
                  <Label className="mb-2">Questions ajoutées</Label>
                  <ul className="list-decimal pl-5">
                    {questions.map((q, idx) => (
                      <li key={idx} className="mb-1">
                        <div className="font-medium">{q.text}</div>
                        <div className="text-sm text-muted-foreground">Type: {q.type} — Options: {q.options?.length ?? 0}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-3 mt-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Annuler</Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" type="submit">Créer le quiz</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuizForm;

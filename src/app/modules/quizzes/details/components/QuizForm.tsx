"use client";
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MadaButton, MadaInput, MadaLabel } from '@/app/lib/components';
import { FileQuestion, Plus, X, Save, HelpCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
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
    <div className="space-y-6">
      <Link href="/modules/quizzes">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux questionnaires
        </Button>
      </Link>

      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileQuestion className="w-6 h-6 text-yellow-500" />
            Créer un nouveau questionnaire
          </CardTitle>
          <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            Remplissez les informations et ajoutez des questions pour créer votre questionnaire
          </CardDescription>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <MadaLabel htmlFor="title" className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4" />
                  Titre du questionnaire
                </MadaLabel>
                <MadaInput
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="Ex: Évaluation des compétences"
                  required
                />
              </div>

              <div className="space-y-2">
                <MadaLabel htmlFor="description" className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4" />
                  Description
                </MadaLabel>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-24 rounded-lg border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-500 bg-white dark:bg-gray-800 transition-all duration-200 px-3 py-2 resize-none"
                  placeholder="Décrivez le contenu et l'objectif de ce questionnaire..."
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-yellow-500" />
                    Ajouter des questions
                  </h3>
                  {questions.length > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {questions.length} question{questions.length > 1 ? "s" : ""} ajoutée{questions.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <CardContent className="p-6">
                    <QuestionForm onCreate={handleAddQuestion} />
                  </CardContent>
                </Card>

                {questions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Questions ajoutées ({questions.length})
                    </h4>
                    <div className="space-y-3">
                      {questions.map((q, idx) => (
                        <Card
                          key={`question-${idx}-${q.text?.slice(0, 10)}`}
                          className="border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                      {q.text}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant="outline" className="text-xs">
                                        {q.type}
                                      </Badge>
                                      {q.options && q.options.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                          {q.options.length} option{q.options.length > 1 ? "s" : ""}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => handleRemoveQuestion(idx)}
                                type="button"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </Button>
            <MadaButton
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              disabled={questions.length === 0}
            >
              <Save className="w-4 h-4" />
              Créer le questionnaire
            </MadaButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default QuizForm;

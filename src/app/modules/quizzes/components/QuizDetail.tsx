"use client";
import useQuiz from '../hooks/useQuiz';
import useQuestions from '../../questions/hooks/useQuestions';
import QuestionForm from '../../questions/details/components/QuestionForm';
import { useNewQuestion } from '../../questions/details/hooks/useNewQuestion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileQuestion, Plus, Loader2, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Props = { id: number };

const QuizDetail = ({ id }: Props) => {
  const res: any = useQuiz(id);
  const quiz = res?.data;
  const { questions = [], isLoading } = useQuestions(id);
  console.log('Questions:', questions);
  const { createQuestion } = useNewQuestion(id as number) as any;
  const router = useRouter();

  const handleAddQuestion = async (q: any) => {
    await createQuestion(q);
    router.refresh();
  };

  if (res.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Chargement du questionnaire...</p>
      </div>
    );
  }

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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3 mb-2">
                <FileQuestion className="w-8 h-8 text-yellow-500" />
                {quiz?.title || "Questionnaire"}
              </CardTitle>
              {quiz?.description && (
                <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                  {quiz.description}
                </CardDescription>
              )}
            </div>
            <Badge variant={quiz?.isActive ? "default" : "secondary"} className="ml-4">
              {quiz?.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-yellow-500" />
                Questions ({questions?.length || 0})
              </h2>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Chargement des questions...</p>
              </div>
            ) : !questions || questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <HelpCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Aucune question
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ajoutez votre première question ci-dessous
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {questions.map((q: any, index: number) => (
                  <Card
                    key={q.id}
                    className="border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                            {q.text}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge variant="outline" className="text-xs">
                              {q.type}
                            </Badge>
                            {q.language && (
                              <Badge variant="secondary" className="text-xs">
                                {q.language.toUpperCase()}
                              </Badge>
                            )}
                            {q.weight && (
                              <Badge variant="secondary" className="text-xs">
                                Poids: {q.weight}
                              </Badge>
                            )}
                            {q.order !== undefined && (
                              <Badge variant="secondary" className="text-xs">
                                Ordre: {q.order}
                              </Badge>
                            )}
                          </div>
                          {q.options && q.options.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Options ({q.options.length}):
                              </p>
                              <ul className="space-y-1">
                                {q.options.map((opt: any, optIdx: number) => (
                                  <li key={optIdx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                    <span>{opt.text}</span>
                                    {opt.value !== undefined && (
                                      <Badge variant="outline" className="text-xs ml-auto">
                                        Valeur: {opt.value}
                                      </Badge>
                                    )}
                                    {opt.isKey && (
                                      <Badge className="text-xs bg-green-500 text-white">
                                        Correcte
                                      </Badge>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-yellow-500" />
              Ajouter une nouvelle question
            </h3>
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
              <CardContent className="p-6">
                <QuestionForm onCreate={handleAddQuestion} />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizDetail;

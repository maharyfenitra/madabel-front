"use client";
import useQuiz from "../hooks/useQuiz";
import useQuestions from "../../questions/hooks/useQuestions";
import QuestionForm from "../../questions/details/components/QuestionForm";
import { useNewQuestion } from "../../questions/details/hooks/useNewQuestion";
import { useUpdateQuiz } from "../hooks/useUpdateQuiz";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileQuestion,
  Plus,
  Loader2,
  ArrowLeft,
  Edit,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { QuestionList } from "./QuestionList";
import { useState } from "react";

type Props = { id: number };

const QuizDetail = ({ id }: Props) => {

  const res: any = useQuiz(id);
  
  const quiz = res?.data?.quiz;

  const { questions = [], isLoading } = useQuestions(id);
 
  const { createQuestion } = useNewQuestion(id as number) as any;

  const router = useRouter();

  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const {
    handleSave: handleSaveQuiz,
    title,
    setTitle,
  } = useUpdateQuiz(quiz, () => setIsEditingTitle(false));

  const handleAddQuestion = async (q: any) => {
    await createQuestion(q);
    router.refresh();
  };

  if (res.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Chargement du questionnaire...
        </p>
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
              <div className="flex items-center gap-3 mb-2">
                <FileQuestion className="w-8 h-8 text-yellow-500" />
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-3xl font-bold border-2 border-yellow-500 focus:ring-yellow-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveQuiz();
                        } else if (e.key === 'Escape') {
                          setIsEditingTitle(false);
                          setTitle(quiz?.title || "");
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveQuiz}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingTitle(false);
                        setTitle(quiz?.title || "");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {quiz?.title || "Questionnaire"}
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingTitle(true)}
                      className="hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                    >
                      <Edit className="w-4 h-4 text-yellow-500" />
                    </Button>
                  </div>
                )}
              </div>
              {quiz?.description && (
                <CardDescription className="text-base text-gray-600 dark:text-gray-400 mt-2">
                  {quiz?.description}
                </CardDescription>
              )}
            </div>
            <Badge
              variant={quiz?.isActive ? "default" : "secondary"}
              className="ml-4"
            >
              {quiz?.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6 space-y-6">
          <QuestionList questions={questions} isLoading={isLoading} />

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

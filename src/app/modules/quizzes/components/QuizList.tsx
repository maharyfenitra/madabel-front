"use client";

import useQuizzes from "../hooks/useQuizzes";
import Link from "next/link";
import { MadaButton } from "@/app/lib/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Plus, ArrowRight, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const QuizList = () => {
  const { quizzes, isLoading } = useQuizzes();

  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileQuestion className="w-6 h-6 text-yellow-500" />
                Gestion des questionnaires
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                Créez et gérez vos questionnaires d'évaluation
              </CardDescription>
            </div>
            <Link href="/modules/quizzes/details">
              <MadaButton className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Créer un quiz
              </MadaButton>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Chargement des questionnaires...</p>
            </div>
          ) : !quizzes || quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucun questionnaire
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Commencez par créer votre premier questionnaire
              </p>
              <Link href="/modules/quizzes/details">
                <MadaButton className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un questionnaire
                </MadaButton>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((q: any) => (
                <Card
                  key={q.id}
                  className="hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-yellow-500" />
                          {q.title}
                        </CardTitle>
                        {q.description && (
                          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {q.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant={q.isActive ? "default" : "secondary"} className="text-xs">
                        {q.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/modules/quizzes/details/${q.id}`}>
                      <Button
                        variant="outline"
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400"
                      >
                        Voir les détails
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizList;

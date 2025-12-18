"use client";
import QuestionRenderer from "../components/QuestionRenderer";
import IntroductionPages from "../components/IntroductionPages";
import useSubmitAnswers from "../hooks/useSubmitAnswers";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import { ArrowLeft, FileText, Save, CheckCircle, Eye, Loader2 } from 'lucide-react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const evaluationId = searchParams.get("evaluationId") || searchParams.get("e");
  
  const {
    handleSubmit,
    handleChange,
    totalPages,
    isLoading,
    quiz,
    answersMap,
    currentPage,
    setCurrentPage,
    hasNextPage,
    hasPreviousPage,
    totalQuestions,
    questionsPerPage,
    handleClickNext,
    handleClickPrevious,
    isSaving,
    isSubmitting,
    goToPage,
    completedAt,
    isCompleted,
  } = useSubmitAnswers();

  // Rediriger vers la page de résultats si l'évaluation est complétée
  useEffect(() => {
    if (isCompleted && evaluationId) {
      router.replace(`/modules/evaluations/${quiz?.id}/results?evaluationId=${evaluationId}`);
    }
  }, [isCompleted, evaluationId, quiz?.id, router]);

  // Ne pas afficher l'introduction si l'évaluation est déjà commencée (completedAt existe ou answersMap non vide)
  useEffect(() => {
    if (completedAt || Object.keys(answersMap).length > 0) {
      setShowIntroduction(false);
    }
  }, [completedAt, answersMap]);

  const onConfirmSubmit = async () => {
    setConfirmDialogOpen(false); // Fermer le dialog immédiatement
    await handleSubmit();
    // isSubmitting est géré dans le hook
  };

  if (isLoading) return <div>Chargement...</div>;
  if (!quiz) return <div>Quiz introuvable</div>;
  
  // Ne rien afficher pendant la redirection
  if (isCompleted) return <div>Redirection...</div>;

  // Afficher les pages d'introduction si nécessaire
  if (showIntroduction) {
    return (
      <div className="py-6">
        <Link href="/modules/evaluations">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux évaluations
          </Button>
        </Link>
        <IntroductionPages
          candidateName={quiz.candidateName || quiz.title || "le candidat"}
          onComplete={() => setShowIntroduction(false)}
        />
      </div>
    );
  }

  return (
    <div className="py-6">
      <Link href="/modules/evaluations">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux évaluations
        </Button>
      </Link>

      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-yellow-500" />
                {quiz.title}
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                {quiz.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          <div className="space-y-6">
            {quiz.questions?.map((q: any, index: number) => (
              <div key={q.id}>
                <QuestionRenderer
                  question={q}
                  value={answersMap[q.id]}
                  onChange={handleChange}
                />
                {index === (quiz.questions?.length || 0) - 1 &&
                  currentPage === totalPages && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        onClick={() => setConfirmDialogOpen(true)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Soumission en cours...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Soumettre le questionnaire
                          </>
                        )}
                      </Button>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} sur {totalPages} • {totalQuestions} question
                  {totalQuestions > 1 ? "s" : ""} au total
                </div>
                {isSaving && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <Save className="w-3 h-3 animate-pulse" />
                    Sauvegarde...
                  </div>
                )}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handleClickPrevious}
                      href="#"
                      className={cn(
                        "cursor-pointer",
                        !hasPreviousPage && "pointer-events-none opacity-50"
                      )}
                      aria-disabled={!hasPreviousPage}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={handleClickNext}
                      href="#"
                      className={cn(
                        "cursor-pointer",
                        !hasNextPage && "pointer-events-none opacity-50"
                      )}
                      aria-disabled={!hasNextPage}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmation */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la soumission</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir soumettre cette évaluation ? 
              <br /><br />
              <strong>Une fois soumise, vous ne pourrez plus modifier vos réponses.</strong>
              <br /><br />
              Vous pourrez toujours consulter vos réponses ultérieurement en mode lecture seule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmSubmit}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Soumission en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer et soumettre
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";
import QuestionRenderer from "../components/QuestionRenderer";
import useSubmitAnswers from "../hooks/useSubmitAnswers";
import { Button } from "@/components/ui/button";

import { ArrowLeft, FileText, Save } from 'lucide-react';
import Link from "next/link";

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
    goToPage,
  } = useSubmitAnswers();

  if (isLoading) return <div>Chargement...</div>;
  if (!quiz) return <div>Quiz introuvable</div>;

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
            <div>
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
                        onClick={handleSubmit}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        Soumettre le questionnaire
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

                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, idx) => {
                      let pageNumber: number;
                      if (totalPages <= 5) {
                        pageNumber = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + idx;
                      } else {
                        pageNumber = currentPage - 2 + idx;
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={async (e) => {
                            e.preventDefault();
                            await goToPage(pageNumber);
                          }}
                          isActive={pageNumber === currentPage}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

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
    </div>
  );
}

"use client";
import QuestionRenderer from '../components/QuestionRenderer';
import useCandidateQuiz from '../hooks/useCandidateQuiz';
import useSubmitAnswers from '../hooks/useSubmitAnswers';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { useCurrentUser } from '@/app/lib/api';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  const params = useParams() as { quizId?: string };
  const quizId = parseInt(String(params?.quizId || ''), 10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 5;

  const { data: quizData, isLoading } = useCandidateQuiz(quizId, currentPage, questionsPerPage);
  const quiz = quizData;
  // NOTE: participantId must be known; for now assume participantId passed in query or use a fake id
  // We'll read participantId from search params if present
  const router = useRouter();
  const [answersMap, setAnswersMap] = useState<Record<number, any>>({});

  const { getUser } = useCurrentUser();
  const user = getUser();

  const submit = useSubmitAnswers(Number(user.id));

  // Logique de pagination
  const pagination = quiz?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalQuestions = pagination?.totalQuestions || 0;
  const hasNextPage = pagination?.hasNextPage || false;
  const hasPreviousPage = pagination?.hasPreviousPage || false;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          //router.push('/');
        }
      });
    } catch (err: any) {
      console.error(err);
      toast.error('Erreur lors de l\'envoi des réponses');
    }
  };

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
                <QuestionRenderer question={q} value={answersMap[q.id]} onChange={handleChange} />
                {index === (quiz.questions?.length || 0) - 1 && currentPage === totalPages && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600 text-black">
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
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} sur {totalPages} • {totalQuestions} question{totalQuestions > 1 ? "s" : ""} au total
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }}
                      href="#"
                      className={cn(
                        "cursor-pointer",
                        !hasPreviousPage && "pointer-events-none opacity-50"
                      )}
                      aria-disabled={!hasPreviousPage}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    let pageNumber: number
                    if (totalPages <= 5) {
                      pageNumber = idx + 1
                    } else if (currentPage <= 3) {
                      pageNumber = idx + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + idx
                    } else {
                      pageNumber = currentPage - 2 + idx
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(pageNumber)
                          }}
                          isActive={pageNumber === currentPage}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }}
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

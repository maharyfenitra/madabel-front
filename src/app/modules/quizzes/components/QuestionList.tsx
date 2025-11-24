"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccessToken } from "@/app/lib/api";
import { useFetch } from "@/app/lib/api/useFetch";
import { useServerConfig } from "@/app/lib/api/configServer";
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

import {
  Loader2,
  HelpCircle,
} from "lucide-react";
import { Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import QuestionUpdate from "@/app/modules/questions/details/components/QuestionUpdate";

// Removed QuestionDeleteButton component

export const QuestionList = ({
  questions,
  isLoading,
}: {
  questions: any[];
  isLoading: boolean;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { getAccessToken } = useAccessToken();
  const sendRequest = useFetch();
  const router = useRouter();
  const { uri } = useServerConfig();

  const handleDelete = (id: number) => {
    setQuestionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      const accessToken = getAccessToken();
      await sendRequest(
        "DELETE",
        `${uri}/questions/${questionToDelete}`,
        {},
        {
          ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
        }
      );
      toast.success("Question supprimée");
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de la suppression", {
        description: error?.message || "Une erreur est survenue",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
          <p className="text-gray-600 dark:text-gray-400">
            Chargement des questions...
          </p>
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
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                        {q.text}
                      </p>
                      <details className="mt-2">
                        <summary className="text-sm text-gray-500 cursor-pointer">Modifier la question</summary>
                        <div className="mt-3">
                          <QuestionUpdate question={q} onSaved={() => { /* nothing: parent will refresh */ }} />
                        </div>
                      </details>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant="outline" className="text-xs">
                          {q.type}
                        </Badge>
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
                              <li
                                key={optIdx}
                                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                              >
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                <span>{opt.text}</span>
                                {opt.value !== undefined && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs ml-auto"
                                  >
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
                  <div className="ml-4 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Supprimer la question"
                      onClick={() => handleDelete(q.id)}
                      aria-label={`Supprimer la question ${q.id}`}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

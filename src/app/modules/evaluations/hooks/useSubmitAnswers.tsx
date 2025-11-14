import { useCurrentUser, useGenericMutation } from "@/app/lib/api";
import { useParams } from "next/navigation";
import { useState } from "react";
import useCandidateQuiz from "./useCandidateQuiz";
import { toast } from "sonner";
import { useSubmitAnswersTools } from "./useSubmitAnswersTools";

export const useSubmitAnswers = () => {
  const params = useParams() as { quizId?: string };
  const quizId = parseInt(String(params?.quizId || ""), 10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const questionsPerPage = 5;

  const { data: quizData, isLoading } = useCandidateQuiz(
    quizId,
    currentPage,
    questionsPerPage
  );
  const quiz = quizData;

  const [answersMap, setAnswersMap] = useState<Record<number, any>>({});

  const { buildAnswersPayload, validateAnswers} = useSubmitAnswersTools(quiz, answersMap)

  const { getUser } = useCurrentUser();

  const user = getUser();

  // Get participantId and evaluationId from URL params
  const sp = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const participantId = Number(sp.get("participantId") || sp.get("p") || 0);

  const evaluationId = Number(sp.get("evaluationId") || sp.get("e") || 0);

  const { mutateAsync } = useGenericMutation(
    `/candidate-evaluations/participant/${participantId}/`
  );

  // Logique de pagination
  const pagination = quiz?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalQuestions = pagination?.totalQuestions || 0;
  const hasNextPage = pagination?.hasNextPage || false;
  const hasPreviousPage = pagination?.hasPreviousPage || false;

  // Fonction générale pour changer de page avec sauvegarde automatique
  const goToPage = async (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      //await saveCurrentPageAnswers();
      setCurrentPage(page);
    }
  };

  const saveCurrentPageAnswers = async () => {
    try {
    
      // build answers array
      const answers = buildAnswersPayload();

      if (!participantId) {
        toast.error(
          "Participant non identifié (participantId manquant dans l'URL)"
        );
        return;
      }

      if (!evaluationId) {
        toast.error(
          "Évaluation non identifiée (evaluationId manquant dans l'URL)"
        );
        return;
      }

      const onSaveSuccess = () => {
        toast.success("Réponses envoyées");
        //router.push('/');
      };

      await mutateAsync(
        {
          answers,
          evaluationId,
        },
        { onSuccess: onSaveSuccess }
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de l'envoi des réponses");
    }
  };

  const handleSubmit = async () => {

     // Valider que toutes les questions ont été répondues
      const validation = validateAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 6000, // Afficher plus longtemps pour les longs messages
          description: `${validation.unansweredCount} question(s) non répondu(s)`,
        });
        return;
      }

    await saveCurrentPageAnswers();
  };

  const handleChange = (questionId: number, value: any) => {
    setAnswersMap((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleClickPrevious = async () => {

     // Valider que toutes les questions ont été répondues
      const validation = validateAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 6000, // Afficher plus longtemps pour les longs messages
          description: `${validation.unansweredCount} question(s) non répondu(s)`,
        });
        return;
      }

    await saveCurrentPageAnswers()
    await goToPage(currentPage - 1);
  };

  const handleClickNext = async () => {
     // Valider que toutes les questions ont été répondues
      const validation = validateAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 6000, // Afficher plus longtemps pour les longs messages
          description: `${validation.unansweredCount} question(s) non répondu(s)`,
        });
        return;
      }

    await saveCurrentPageAnswers()
    await goToPage(currentPage + 1);
  };

  return {
    mutateAsync,
    isLoading,
    handleSubmit,
    handleChange,
    totalPages,
    currentPage,
    setCurrentPage,
    hasNextPage,
    hasPreviousPage,
    totalQuestions,
    questionsPerPage,
    quiz,
    answersMap,
    handleClickNext,
    handleClickPrevious,
    isSaving,
    goToPage,
    validateAnswers,
  };
};

export default useSubmitAnswers;

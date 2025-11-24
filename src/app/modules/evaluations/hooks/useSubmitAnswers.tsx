import { useCurrentUser, useGenericMutation } from "@/app/lib/api";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useCandidateQuiz from "./useCandidateQuiz";
import { toast } from "sonner";
import { useSubmitAnswersTools } from "./useSubmitAnswersTools";
import { useCandidatePreviousAnswers } from "./useCandidatePreviousAnswers";

export const useSubmitAnswers = () => {
  const params = useParams() as { quizId?: string };
  const searchParams = useSearchParams();
  
  const quizId = parseInt(String(params?.quizId || ""), 10);
  const participantId = parseInt(searchParams.get("participantId") || searchParams.get("p") || "0", 10);
  const evaluationId = parseInt(searchParams.get("evaluationId") || searchParams.get("e") || "0", 10);
  
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

  const { buildAnswersPayload, validateAnswers, validateCurrentPageAnswers} = useSubmitAnswersTools(quiz, answersMap, currentPage, questionsPerPage)

  const { getUser } = useCurrentUser();

  const user = getUser();

  // Charger les réponses précédentes
  const { previousAnswers, isLoading: isLoadingPreviousAnswers } = useCandidatePreviousAnswers();

  // Initialiser answersMap avec les réponses précédentes quand elles sont chargées
  useEffect(() => {
    if (Object.keys(previousAnswers).length > 0 && Object.keys(answersMap).length === 0) {
      setAnswersMap(previousAnswers);
    }
  }, [previousAnswers, answersMap]);

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
      console.log(participantId)

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

     // Valider seulement les questions de la page actuelle avant de permettre la navigation
      const validation = validateCurrentPageAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 6000, // Afficher plus longtemps pour les longs messages
          description: `${validation.unansweredCount} question(s) non répondu(s) sur cette page`,
        });
        return;
      }

    await saveCurrentPageAnswers()
    await goToPage(currentPage - 1);
  };

  const handleClickNext = async () => {
     // Valider seulement les questions de la page actuelle avant de permettre la navigation
      const validation = validateCurrentPageAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 6000, // Afficher plus longtemps pour les longs messages
          description: `${validation.unansweredCount} question(s) non répondu(s) sur cette page`,
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
    validateCurrentPageAnswers,
  };
};

export default useSubmitAnswers;

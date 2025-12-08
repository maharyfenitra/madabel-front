import { useCurrentUser, useGenericMutation } from "@/app/lib/api";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useCandidateQuiz from "./useCandidateQuiz";
import { toast } from "sonner";
import { useSubmitAnswersTools } from "./useSubmitAnswersTools";
import { useCandidatePreviousAnswers } from "./useCandidatePreviousAnswers";

export const useSubmitAnswers = () => {
  const params = useParams() as { quizId?: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const quizId = parseInt(String(params?.quizId || ""), 10);
  const participantId = parseInt(searchParams.get("participantId") || searchParams.get("p") || "0", 10);
  const evaluationId = parseInt(searchParams.get("evaluationId") || searchParams.get("e") || "0", 10);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const { previousAnswers, completedAt, isLoading: isLoadingPreviousAnswers } = useCandidatePreviousAnswers();

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
      // Si l'évaluation est complétée, permettre la navigation directe
      if (completedAt) {
        setCurrentPage(page);
        return;
      }

      // Sinon, valider et sauvegarder avant de changer de page
      const validation = validateCurrentPageAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 8000,
          description: validation.description,
        });
        return;
      }

      // Sauvegarder en mode brouillon
      setIsSaving(true);
      await saveCurrentPageAnswers(false);
      setIsSaving(false);
      
      setCurrentPage(page);
    }
  };

  const saveCurrentPageAnswers = async (isFinalSubmit: boolean = false) => {
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
        if (isFinalSubmit) {
          toast.success("Évaluation complétée avec succès!");
          router.push("/modules/evaluations/");
        } else {
          // Ne pas afficher de toast pour les sauvegardes en brouillon
          // toast.success("Réponses enregistrées");
        }
      };

      await mutateAsync(
        {
          answers,
          evaluationId,
          isDraft: !isFinalSubmit, // Envoyer isDraft=true pour les brouillons
          isFinalSubmit,
        },
        { onSuccess: onSaveSuccess }
      );

      return true;
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de l'envoi des réponses");
      return false;
    }
  };

  const handleSubmit = async () => {
     // Valider que toutes les questions ont été répondues
      const validation = validateAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 8000,
          description: `${validation.unansweredCount} question(s) non répondue(s) au total. Veuillez vérifier toutes les pages.`,
        });
        return false;
      }

    // Sauvegarder avec soumission finale
    setIsSubmitting(true);
    const result = await saveCurrentPageAnswers(true);
    if (!result) {
      setIsSubmitting(false);
    }
    // Si succès, laisser isSubmitting à true pendant la redirection
    return result;
  };

  const handleChange = (questionId: number, value: any) => {
    setAnswersMap((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleClickPrevious = async () => {
    // Si l'évaluation est complétée, permettre la navigation sans validation ni sauvegarde
    if (completedAt) {
      await goToPage(currentPage - 1);
      return;
    }

     // Valider seulement les questions de la page actuelle avant de permettre la navigation
      const validation = validateCurrentPageAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 8000,
          description: validation.description,
        });
        return;
      }

    // Sauvegarder en mode brouillon (sans soumission finale)
    setIsSaving(true);
    await saveCurrentPageAnswers(false);
    setIsSaving(false);
    
    await goToPage(currentPage - 1);
  };

  const handleClickNext = async () => {
    // Si l'évaluation est complétée, permettre la navigation sans validation ni sauvegarde
    if (completedAt) {
      await goToPage(currentPage + 1);
      return;
    }

     // Valider seulement les questions de la page actuelle avant de permettre la navigation
      const validation = validateCurrentPageAnswers();
      if (!validation.isValid) {
        toast.error(validation.message, {
          duration: 8000,
          description: validation.description,
        });
        return;
      }

    // Sauvegarder en mode brouillon (sans soumission finale)
    setIsSaving(true);
    await saveCurrentPageAnswers(false);
    setIsSaving(false);
    
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
    isSubmitting,
    goToPage,
    validateAnswers,
    validateCurrentPageAnswers,
    completedAt,
    isCompleted: !!completedAt,
  };
};

export default useSubmitAnswers;

import { useGenericQuery } from "@/app/lib/api";
import { useParams } from "next/navigation";
import { formatDataFromQuery } from "@/app/lib/api";

export const useCandidatePreviousAnswers = () => {
    
  const params = useParams() as { quizId?: string };

  // Get evaluationId from URL params
  const sp = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const evaluationId = Number(sp.get("evaluationId") || sp.get("e") || 0);

  const { data, isLoading, error } = useGenericQuery((data) =>formatDataFromQuery(data),
    `/candidate-evaluations/${evaluationId}/answers`,
    `candidate-evaluations-${evaluationId}-answers`
  );

  console.log("Previous Answers Data:", data);
  // Transform the data to match the answersMap format
  const previousAnswers = data?.answers?.reduce((acc: Record<number, any>, answer: any) => {
    const questionId = answer.questionId;

    switch (answer.questionType) {
      case "TEXT":
        acc[questionId] = answer.answer || "";
        break;

      case "SCALE":
        acc[questionId] = answer.answer !== null ? answer.answer : undefined;
        break;

      case "SINGLE_CHOICE":
        acc[questionId] = answer.answer?.id || null;
        break;

      case "MULTIPLE_CHOICE":
        acc[questionId] = answer.answer?.map((option: any) => option.id) || [];
        break;

      default:
        break;
    }

    return acc;
  }, {}) || {};

  return {
    previousAnswers,
    isLoading,
    error,
    hasPreviousAnswers: Object.keys(previousAnswers).length > 0,
  };
};
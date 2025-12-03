// app/hooks/useUpdateEvaluation.ts
import { formatDataFromQuery, useGenericMutation, useGenericQuery } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export const useUpdateEvaluation = () => {
  const router = useRouter();
  const params = useParams();

  const { mutateAsync } = useGenericMutation(`/evaluations/${params?.id}`, "PUT");

  //  État initial du formulaire
  const [formData, setFormData] = useState<EvaluationParams>({
    ref: "",
    createdAt: "",
    deadline: "",
  });

  //  Récupération de l'évaluation depuis l'API
  const { data: evaluation } = useGenericQuery(
    (data) => formatDataFromQuery(data),
    `/evaluations/${params?.id}`,
    `evaluations-${params?.id}`
  );

  //  Récupération de l'évaluation depuis l'API
  const { data: quizzes } = useGenericQuery(
    (data) => formatDataFromQuery(data),
   "/quizzes/", "quizzes"
  );

  console.log("Loaded quizzes for evaluation update:", quizzes);

  //  Met à jour formData dès que evaluation change
  useEffect(() => {
    if (evaluation) {
      setFormData({
        ref: evaluation?.ref ?? "",
        quizId: evaluation?.quizId ?? evaluation?.quiz?.id ?? null,
        // ⚠️ On convertit les dates en format "YYYY-MM-DD" pour les inputs type="date"
        createdAt: evaluation.createdAt
          ? new Date(evaluation.createdAt).toISOString().split("T")[0]
          : "",
        deadline: evaluation.deadline
          ? new Date(evaluation.deadline).toISOString().split("T")[0]
          : "",
      });
    }
  }, [evaluation]);

  // 🖊 Gère le changement d’un champ
  const handleChange = <K extends keyof EvaluationParams>(
    key: K,
    value: EvaluationParams[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ Soumet la création ou la mise à jour
  const handleUpdateEvaluation = async () => {
    try {
      const data = await mutateAsync({ ...formData });
     
      toast.success("Évaluation enregistrée avec succès 🎉", {
        description: `Réf: ${formData?.ref || "non renseignée"}`,
      });
    } catch (error: any) {
      console.error("Erreur lors de la création :", error);
      toast.error("Impossible d'enregistrer l'évaluation ❌", {
        description: error?.message ?? "Une erreur est survenue",
      });
    }
  };

  // 🧾 Gère la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateEvaluation();
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    handleUpdateEvaluation,
    setFormData,
    quizzes: quizzes?.quizzes || [],
  };
};

// 🔹 Type pour le formulaire
export type EvaluationParams = {
  ref: string;
  quizId?: number | null;
  createdAt: string;
  deadline: string;
};

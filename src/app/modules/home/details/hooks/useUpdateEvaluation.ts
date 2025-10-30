// app/hooks/useUpdateEvaluation.ts
import { formatDataFromQuery, useGenericMutation, useGenericQuery } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export const useUpdateEvaluation = () => {
  const router = useRouter();
  const params = useParams();
  const { mutateAsync } = useGenericMutation("/evaluations/");

  // 1️⃣ État initial du formulaire
  const [formData, setFormData] = useState<EvaluationParams>({
    ref: "",
    createdAt: "",
    deadline: "",
    completedAt: "",
  });

  // 2️⃣ Récupération de l'évaluation depuis l'API
  const { data: evaluation } = useGenericQuery(
    (data) => formatDataFromQuery(data),
    `/evaluations/${params?.id}`,
    `evaluations-${params?.id}`
  );

  // 3️⃣ Met à jour formData dès que evaluation change
  useEffect(() => {
    if (evaluation) {
      setFormData({
        ref: evaluation?.ref ?? "",
        // ⚠️ On convertit les dates en format "YYYY-MM-DD" pour les inputs type="date"
        createdAt: evaluation.createdAt
          ? new Date(evaluation.createdAt).toISOString().split("T")[0]
          : "",
        deadline: evaluation.deadline
          ? new Date(evaluation.deadline).toISOString().split("T")[0]
          : "",
        completedAt: evaluation.completedAt
          ? new Date(evaluation.completedAt).toISOString().split("T")[0]
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
  const handleCreateEvaluation = async () => {
    try {
      const data = await mutateAsync({ ...formData });
      router.push(`/modules/home/details/${data?.id}`);

      toast.success("Évaluation enregistrée avec succès 🎉", {
        description: `Réf: ${data.ref || "non renseignée"}`,
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
    handleCreateEvaluation();
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    handleCreateEvaluation,
    setFormData,
  };
};

// 🔹 Type pour le formulaire
export type EvaluationParams = {
  ref: string;
  createdAt: string;
  deadline: string;
  completedAt: string;
};

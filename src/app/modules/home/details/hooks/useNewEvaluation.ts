// app/hooks/useNewEvaluation.ts
import { useGenericMutation, useGenericQuery, formatDataFromQuery } from "@/app/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useNewEvaluation = () => {
  const router = useRouter();
  const { mutateAsync } = useGenericMutation("/evaluations/");
  const { data: quizzes, isLoading: quizzesLoading } = useGenericQuery(
    (data: any) => formatDataFromQuery(data),
    "/quizzes/",
    "quizzes"
  );

  console.log("Loaded quizzes for new evaluation:", quizzes);

  const [formData, setFormData] = useState<EvaluationParams>({
    ref: "",
    deadline: "",
    quizId: "",
  });

  // 🖊 Met à jour un champ du formulaire
  const handleChange = <K extends keyof EvaluationParams>(
    key: K,
    value: EvaluationParams[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ Soumet la création d'une évaluation
  const handleCreateEvaluation = async () => {
    try {
      // Valider que le quiz est sélectionné
      if (!formData.quizId) {
        toast.error("Veuillez sélectionner un quiz");
        return;
      }

      const data = await mutateAsync({ ...formData });

      console.log(data)

      toast.success("Évaluation créée avec succès 🎉", {
        description: `Réf: ${data.ref || "non renseignée"}`,
      });

      router.push(`/modules/home/details/${data?.id}`);
      
    } catch (error: any) {
      console.error("Erreur lors de la création :", error);
         toast("Impossible de créer l'évaluation", {
          description: error.message,
          action: {
            label: "ok",
            onClick: () => console.log("Undo"),
          },
        })
      //toast.error("Impossible de créer l'évaluation ❌");
    }
  };

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
    quizzes: quizzes?.quizzes || [],
    quizzesLoading,
  };
};

// 🔹 Type pour le formulaire
export type EvaluationParams = {
  ref: string;
  deadline: string;
  quizId: number | string;
};

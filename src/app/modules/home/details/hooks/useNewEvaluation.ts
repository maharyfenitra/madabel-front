// app/hooks/useNewEvaluation.ts
import { useGenericMutation } from "@/app/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useNewEvaluation = () => {
  const router = useRouter();
  const { mutateAsync } = useGenericMutation("/evaluations/");

  const [formData, setFormData] = useState<EvaluationParams>({
    ref: "",
    deadline: "",
    completedAt: "",
    
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
  };
};

// 🔹 Type pour le formulaire
export type EvaluationParams = {
  ref: string;
  deadline: string;
  completedAt: string;

};

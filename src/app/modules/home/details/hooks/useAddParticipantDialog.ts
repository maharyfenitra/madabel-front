import { useState } from "react";
import { useGenericMutation } from "@/app/lib/api";
import { toast } from "sonner";
export const useAddParticipantDialog = (evaluationId: number) => {
  const { mutateAsync } = useGenericMutation("/evaluations/new/participant/");
  const [newUser, setNewUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    role: "EVALUATOR",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log("Utilisateur ajouté :", newUser);
      // Ici tu peux ajouter la logique pour ajouter l'utilisateur à ta liste
      const data = await mutateAsync({ ...newUser, evaluationId });

      toast.success("Évaluation créée avec succès 🎉", {
        description: `Réf: ${data.ref || "non renseignée"}`,
      });
    } catch (error: any) {
      toast("Impossible d'ajouter le participant", {
        description: error.message,
        action: {
          label: "ok",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return { handleSubmit, handleChange, newUser };
};

type Role = "CANDIDAT" | "ADMIN" | "EVALUATOR";
type EvaluatorType =
  | "Manager Direct"
  | "Collaborateur Direct"
  | "Pair/Associé"
  | "Autres";

interface User {
  name: string;
  email: string;
  phone: string;
  post?: string;
  role: Role;
  evaluatorType?: EvaluatorType;
}

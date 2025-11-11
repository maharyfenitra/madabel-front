import { useState } from "react";
import { useGenericMutation } from "@/app/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useUpdateQuiz = (quiz: any, onSaved?: () => void) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>(quiz?.title || "");
  const [description, setDescription] = useState<string>(quiz?.description || "");
  const [isActive, setIsActive] = useState<boolean>(quiz?.isActive || false);

  const { mutateAsync: updateAsync } = useGenericMutation<any>(`/quizzes/${quiz?.id}`, "PUT");

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const payload: any = {
        title,
        description,
        isActive,
      };

      await updateAsync(payload);
      toast.success("Questionnaire mis à jour");
      router.refresh();
      onSaved?.();
    } catch (err: any) {
      console.error(err);
      toast.error("Impossible de mettre à jour le questionnaire");
    }
  };

  return {
    handleSave,
    title,
    description,
    isActive,
    setTitle,
    setDescription,
    setIsActive,
  };
};
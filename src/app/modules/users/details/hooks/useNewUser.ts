import { useGenericMutation } from "@/app/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useNewUser = () => {
  const router = useRouter();
  const { mutateAsync } = useGenericMutation("/users/");

  const [formData, setFormData] = useState<UserParams>({
    name: "",
    email: "",
    phone: "",
    post: "",
    password: "",
    role: "CANDIDAT",
    avatar: null,
  });

  const handleChange = <K extends keyof UserParams>(key: K, value: UserParams[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (key: keyof UserParams, file: File | null) => {
    setFormData((prev) => ({ ...prev, [key]: file }));
  };

  const handleCreateUser = async () => {
    try {
      // If avatar provided, send FormData
      let payload: any = formData;

      if (formData.avatar instanceof File) {
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("email", formData.email ?? "");
        fd.append("phone", formData.phone ?? "");
        fd.append("post", formData.post ?? "");
        fd.append("password", formData.password ?? "");
        fd.append("role", formData.role ?? "CANDIDAT");
        fd.append("avatar", formData.avatar);
        payload = fd;
      }

      const data = await mutateAsync(payload);

      toast.success("Utilisateur créé avec succès 🎉", {
        description: `${data?.name ?? data?.email ?? "Utilisateur"}`,
      });

      router.push(`/modules/users`);
    } catch (error: any) {
      console.error("Erreur création utilisateur:", error);
      toast("Impossible de créer l'utilisateur", {
        description: error?.message || String(error),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateUser();
  };

  return {
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};

export type UserParams = {
  name: string;
  email?: string | null;
  phone: string;
  post?: string | null;
  password: string;
  role: "ADMIN" | "EVALUATOR" | "CANDIDAT" | string;
  avatar: File | null;
};

export default useNewUser;

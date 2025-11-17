import {
  useGenericMutation,
  useCurrentUser,
} from "@/app/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type ProfileParams = {
  name: string;
  email: string;
  phone: string;
  post: string;
  password: string;
  role: "ADMIN" | "EVALUATOR" | "CANDIDAT" | string;
  avatar: File | null;
};

export const useUpdateProfile = () => {
  const router = useRouter();
  const { getUser } = useCurrentUser();
  const { mutateAsync } = useGenericMutation("/profile", "PUT");

  // Get current user data from localStorage
  const currentUser = getUser();

  const [formData, setFormData] = useState<ProfileParams>(() => ({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    post: currentUser?.post || "",
    password: "",
    role: currentUser?.role || "CANDIDAT",
    avatar: null,
  }));

  const handleChange = <K extends keyof ProfileParams>(
    key: K,
    value: ProfileParams[K]
  ) => {
    // Ensure string values are never null or undefined
    const safeValue = (typeof value === 'string' && value === null) ? "" : value;
    setFormData((prev) => ({ ...prev, [key]: safeValue }));

    console.log(`Updated formData.${key}:`, safeValue);
  };

  const handleFileChange = (key: keyof ProfileParams, file: File | null) => {
    setFormData((prev) => ({ ...prev, [key]: file }));
  };

  const handleUpdateProfile = async () => {
    try {
      // Build payload: if avatar provided, use FormData
      let payload: any = {};

      if (formData.avatar instanceof File) {
        const fd = new FormData();
        fd.append("name", formData.name);
        if (formData.email) fd.append("email", formData.email);
        if (formData.phone) fd.append("phone", formData.phone);
        if (formData.post) fd.append("post", formData.post);
        if (formData.password) fd.append("password", formData.password);
        fd.append("role", formData.role ?? "CANDIDAT");
        fd.append("avatar", formData.avatar);
        payload = fd;
      } else {
        // JSON payload: include only fields present (don't send empty password)
        payload = {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          post: formData.post || null,
          ...(formData.password ? { password: formData.password } : {}),
          role: formData.role,
        };
      }

      console.log("Updating profile with payload:", payload);

      const result = await mutateAsync(payload);

      toast.success("Profil mis à jour avec succès 🎉", {
        description: result?.name ?? result?.email ?? "Votre profil",
      });

      // Optionally refresh the page or redirect
      // router.refresh();
    } catch (error: any) {
      console.error("Erreur mise à jour profil:", error);
      toast("Impossible de mettre à jour votre profil", {
        description: error?.message || String(error),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile();
  };

  return {
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
    setFormData,
  };
};

export default useUpdateProfile;
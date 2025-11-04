import {
  formatDataFromQuery,
  useGenericMutation,
  useGenericQuery,
} from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import type { UserParams } from "./useNewUser";

export const useUpdateUser = () => {
  const router = useRouter();
  const params = useParams();
  const { mutateAsync } = useGenericMutation(`/users/${params?.id}`, "PUT");

  const [formData, setFormData] = useState<UserParams>({
    name: "",
    email: "",
    phone: "",
    post: "",
    password: "",
    role: "CANDIDAT",
    avatar: null,
  });

  // fetch user
  const { data: user, isLoading } = useGenericQuery(
    (data) => formatDataFromQuery(data),
    `/users/${params?.id}`,
    `users-${params?.id}`
  );

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        post: user?.post ?? "",
        role: user?.role ?? "CANDIDAT",
        // password intentionally left empty
      }));
      console.log(user);
      console.log("Loaded user for update:", formData);
    }
  }, [user]);

  const handleChange = <K extends keyof UserParams>(
    key: K,
    value: UserParams[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: keyof UserParams, file: File | null) => {
    setFormData((prev) => ({ ...prev, [key]: file }));
  };

  const handleUpdateUser = async () => {
    try {
      // build payload: if avatar provided, use FormData
      let payload: any = {};

      if (formData.avatar instanceof File) {
        const fd = new FormData();
        fd.append("id", String(params?.id ?? ""));
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
          id: params?.id,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          post: formData.post || null,
          ...(formData.password ? { password: formData.password } : {}),
          role: formData.role,
        };
      }

      console.log("Updating user with payload:", payload);

      const data = await mutateAsync(payload);

      toast.success("Utilisateur mis à jour 🎉", {
        description: data?.name ?? data?.email ?? "",
      });
      router.push(`/modules/users`);
    } catch (error: any) {
      console.error("Erreur mise à jour utilisateur:", error);
      toast("Impossible de mettre à jour l'utilisateur", {
        description: error?.message || String(error),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateUser();
  };

  return {
    formData,
    handleChange,
    handleFileChange,
    handleSubmit,
    user,
    setFormData,
    isLoading,
  };
};

export default useUpdateUser;

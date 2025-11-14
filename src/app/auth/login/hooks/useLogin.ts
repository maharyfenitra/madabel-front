import { useGenericMutation } from "@/app/lib/api";
import { useState } from "react";
import { useAccessToken, useRefreshToken, useCurrentUser } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const { mutateAsync } = useGenericMutation("/auth/login/");
  const { setAccessToken } = useAccessToken();
  const { setRefreshToken } = useRefreshToken();
  const { setUser } = useCurrentUser();
  const { push } = useRouter();

  const [loginParams, setLoginParams] = useState<LoginParams>({
    email: "",
    password: "",
  });

  const handleChange = <K extends keyof LoginParams>(
    key: K,
    value: LoginParams[K]
  ) => {
    setLoginParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = await mutateAsync({ ...loginParams });

      console.log(data);

      setAccessToken(data?.accessToken);
      setRefreshToken(data?.refreshToken);
      setUser(data?.user);
      // Redirect candidate users to their evaluations, others to home
      const role = data?.user?.role;
      if (role === "EVALUATOR") {
        push("/modules/evaluations");
      } else {
        push("/modules/home");
      }
    } catch (error) {
      toast.error("Échec de la connexion. Veuillez vérifier vos identifiants.");
      return;
    }
  };
  return { handleChange, loginParams, handleSubmit };
};

type LoginParams = {
  email: string;
  password: string;
};

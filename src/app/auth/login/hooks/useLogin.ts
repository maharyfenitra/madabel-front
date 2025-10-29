import { useGenericMutation } from "@/app/lib/api";
import { useState } from "react";
import { useAccessToken, useRefreshToken } from "@/app/lib/api";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { mutateAsync } = useGenericMutation("/auth/login/");
  const { setAccessToken } = useAccessToken()
  const { setRefreshToken } = useRefreshToken()
  const { push } = useRouter()

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
    const data = await mutateAsync({ ...loginParams });
    
    setAccessToken(data?.accessToken)
    setRefreshToken(data?.refreshToken)
    push("/modules/home")
  }
  return { handleChange, loginParams, handleSubmit};
};

type LoginParams = {
  email: string;
  password: string;
};

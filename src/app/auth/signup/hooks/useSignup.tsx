"use client";
import { useState } from "react";
import { useGenericMutation } from "@/app/lib/api";

export type SignupParams = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export const useSignup = () => {
  const { mutateAsync } = useGenericMutation("/auth/signup/");

  const [signupParams, setSignupParams] = useState<SignupParams>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = <K extends keyof SignupParams>(key: K, value: SignupParams[K]) => {
    setSignupParams({ ...signupParams, [key]: value });
  };

  const handleSubmit = async () => {
    if (signupParams.password !== signupParams.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await mutateAsync(signupParams);
      alert("Signup successful");
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  return { signupParams, handleChange, handleSubmit };
};

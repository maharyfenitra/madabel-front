"use client";
import { MadaButton, MadaInput, MadaLabel } from "@/app/lib/components";
import { useLogin } from "./hooks/useLogin";

export default function LoginPage() {
  const { handleChange, loginParams, handleSubmit } = useLogin();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div>
          <MadaLabel htmlFor="email">Email</MadaLabel>
          <MadaInput
            id="email"
            type="email"
            placeholder="your@email.com"
            value={loginParams?.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <MadaLabel htmlFor="password">Password</MadaLabel>
          <MadaInput
            id="password"
            type="password"
            placeholder="********"
            value={loginParams?.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <MadaButton className="w-full" onClick={handleSubmit}>Login</MadaButton>
      </div>
    </div>
  );
}

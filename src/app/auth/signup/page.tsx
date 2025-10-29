"use client";
import Link from "next/link";
import { MadaButton, MadaInput, MadaLabel } from "@/app/lib/components";
import { useSignup } from "./hooks/useSignup";

export default function SignupPage() {
  const { signupParams, handleChange, handleSubmit } = useSignup();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <div>
          <MadaLabel htmlFor="name">Full Name</MadaLabel>
          <MadaInput
            id="name"
            type="text"
            placeholder="John Doe"
            value={signupParams.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <MadaLabel htmlFor="email">Email</MadaLabel>
          <MadaInput
            id="email"
            type="email"
            placeholder="your@email.com"
            value={signupParams.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <MadaLabel htmlFor="phone">Phone Number</MadaLabel>
          <MadaInput
            id="phone"
            type="tel"
            placeholder="+261 34 12 345 67"
            value={signupParams.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div>
          <MadaLabel htmlFor="password">Password</MadaLabel>
          <MadaInput
            id="password"
            type="password"
            placeholder="********"
            value={signupParams.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <div>
          <MadaLabel htmlFor="confirmPassword">Confirm Password</MadaLabel>
          <MadaInput
            id="confirmPassword"
            type="password"
            placeholder="********"
            value={signupParams.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
        </div>

        <MadaButton className="w-full" onClick={handleSubmit}>
          Sign Up
        </MadaButton>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

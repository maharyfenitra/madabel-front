"use client";
import Link from "next/link";
import Image from "next/image";
import { MadaButton, MadaInput, MadaLabel } from "@/app/lib/components";
import { useLogin } from "./hooks/useLogin";
import { Mail, Lock, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const { handleChange, loginParams, handleSubmit } = useLogin();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/Logo-couleurs-Madabel.webp"
                alt="Madabel Logo"
                width={150}
                height={50}
                priority
                className="h-12 w-auto object-contain"
              />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
              Connexion
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Connectez-vous à votre compte pour continuer
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <MadaLabel htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </MadaLabel>
              <MadaInput
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={loginParams?.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <MadaLabel htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Mot de passe
              </MadaLabel>
              <MadaInput
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginParams?.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="h-11"
              />
            </div>

            <MadaButton 
              className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200" 
              onClick={handleSubmit}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </MadaButton>

            <Separator />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Vous n'avez pas encore de compte ?{" "}
              <Link 
                href="/auth/signup" 
                className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-semibold hover:underline transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

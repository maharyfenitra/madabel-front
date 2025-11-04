"use client";
import Link from "next/link";
import Image from "next/image";
import { MadaButton, MadaInput, MadaLabel } from "@/app/lib/components";
import { useSignup } from "./hooks/useSignup";
import { User, Mail, Phone, Lock, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SignupPage() {
  const { signupParams, handleChange, handleSubmit } = useSignup();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-8">
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
              Créer un compte
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Rejoignez-nous pour commencer votre parcours
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <MadaLabel htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom complet
              </MadaLabel>
              <MadaInput
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={signupParams.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <MadaLabel htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </MadaLabel>
              <MadaInput
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={signupParams.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <MadaLabel htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Numéro de téléphone
              </MadaLabel>
              <MadaInput
                id="phone"
                type="tel"
                placeholder="+261 34 12 345 67"
                value={signupParams.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
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
                value={signupParams.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <MadaLabel htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Confirmer le mot de passe
              </MadaLabel>
              <MadaInput
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={signupParams.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="h-11"
              />
            </div>

            <MadaButton 
              className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 mt-2" 
              onClick={handleSubmit}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Créer mon compte
            </MadaButton>

            <Separator />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte ?{" "}
              <Link 
                href="/auth/login" 
                className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-semibold hover:underline transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

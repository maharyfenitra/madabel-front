"use client"

import { ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MadaButton, MadaInput, MadaLabel } from "@/app/lib/components"
import { useNewUser } from "../hooks/useNewUser"
import { User, Mail, Phone, Briefcase, Lock, UserCircle, Upload, X, Save, UserPlus } from "lucide-react"
import Link from "next/link"

export default function NewUser() {
  const router = useRouter()
  const { formData, handleChange, handleFileChange, handleSubmit } = useNewUser()

  return (
    <div className="space-y-6">
      <Link href="/modules/users">
        <Button variant="ghost" className="mb-4">
          <X className="w-4 h-4 mr-2" />
          Retour aux utilisateurs
        </Button>
      </Link>

      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-yellow-500" />
            Créer un nouvel utilisateur
          </CardTitle>
          <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            Remplissez les informations pour créer un nouvel utilisateur
          </CardDescription>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <MadaLabel htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom complet
                </MadaLabel>
                <MadaInput
                  id="name"
                  name="name"
                  placeholder="Ex: Jean Dupont"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <MadaLabel htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </MadaLabel>
                <MadaInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean@example.com"
                  value={formData.email ?? ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <MadaLabel htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </MadaLabel>
                <MadaInput
                  id="phone"
                  name="phone"
                  placeholder="+261 34 12 345 67"
                  value={formData.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <MadaLabel htmlFor="post" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Poste
                </MadaLabel>
                <MadaInput
                  id="post"
                  name="post"
                  placeholder="Ex: Développeur"
                  value={formData.post ?? ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("post", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <MadaLabel htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </MadaLabel>
                <MadaInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <MadaLabel htmlFor="role" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Rôle
                </MadaLabel>
                <select
                  id="role"
                  name="role"
                  className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-500 bg-white dark:bg-gray-800 transition-all duration-200 px-3 py-2"
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                >
                  <option value="CANDIDAT">CANDIDAT</option>
                  <option value="EVALUATOR">ÉVALUATEUR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <MadaLabel htmlFor="avatar" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Avatar (optionnel)
                </MadaLabel>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-500 bg-white dark:bg-gray-800 transition-all duration-200 px-3 py-2 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] ?? null
                    handleFileChange("avatar", file)
                  }}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </Button>
            <MadaButton
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Créer l'utilisateur
            </MadaButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

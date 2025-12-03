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
import { useNewEvaluation } from "../hooks/useNewEvaluation"
import { FileText, Calendar, X, Save } from "lucide-react"

export function NewEvaluation() {
  const router = useRouter()
  const { handleSubmit, handleChange, formData } = useNewEvaluation()
  
  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-yellow-500" />
          Créer une nouvelle évaluation
        </CardTitle>
        <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
          Remplissez les informations pour créer une nouvelle évaluation
        </CardDescription>
      </CardHeader>

      <Separator />

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <MadaLabel htmlFor="ref" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Référence
              </MadaLabel>
              <MadaInput
                id="ref"
                name="ref"
                placeholder="Ex: EVA-2025-01"
                value={formData.ref}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("ref", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <MadaLabel htmlFor="deadline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date limite de réalisation
              </MadaLabel>
              <MadaInput
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("deadline", e.target.value)}
                required
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
            Créer l'évaluation
          </MadaButton>
        </CardFooter>
      </form>
    </Card>
  )
}

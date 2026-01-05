"use client"

import { ChangeEvent } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { useUpdateEvaluation } from "../hooks/useUpdateEvaluation"
import { useParticipantList } from "../hooks/useParticipantList"
import { ParticipantList } from "./ParticipantList"
import { FileText, Calendar, X, Save, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function UpdateEvaluation() {
  const router = useRouter()
  const params = useParams()
  const { handleSubmit, handleChange, formData, quizzes } = useUpdateEvaluation()
  const { participants } = useParticipantList(Number(params?.id))

  // Calculer la date du dernier participant ayant complété
  const getLastCompletedDate = () => {
    if (!participants || participants.length === 0) return null;
    
    const completedDates = participants
      .filter((p: any) => p.completedAt)
      .map((p: any) => new Date(p.completedAt).getTime())
      .sort((a: number, b: number) => b - a);
    
    return completedDates.length > 0 ? new Date(completedDates[0]) : null;
  };

  const lastCompletedDate = getLastCompletedDate();
  
  // Vérifier si au moins un participant a commencé ou complété l'évaluation
  const hasStartedEvaluations = participants && participants.some((p: any) => 
    p.completedAt || (p.answers && p.answers.length > 0)
  );

  return (
    <div className="space-y-6">
      <Link href="/modules/home">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux évaluations
        </Button>
      </Link>

      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-yellow-500" />
            Modifier l'évaluation
          </CardTitle>
          <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            Mettez à jour les informations de l'évaluation
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
                <MadaLabel htmlFor="createdAt" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date de création
                </MadaLabel>
                <MadaInput
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  value={formData.createdAt}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("createdAt", e.target.value)}
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

              {lastCompletedDate && (
                <div className="space-y-2">
                  <MadaLabel className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Date du dernier participant complété
                  </MadaLabel>
                  <div className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-sm text-green-700 dark:text-green-400">
                    {lastCompletedDate.toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
              )}

              
              <div className="space-y-2">
                <MadaLabel htmlFor="quizId" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Quiz associé
                </MadaLabel>
                {hasStartedEvaluations ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300">
                      {quizzes?.find((q: any) => q.id === formData.quizId)?.title || "Quiz non sélectionné"}
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <span className="font-semibold">⚠️</span>
                      Le quiz ne peut plus être modifié car des participants ont déjà commencé l'évaluation
                    </p>
                  </div>
                ) : (
                  <select
                    id="quizId"
                    name="quizId"
                    value={formData.quizId ?? ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const val = e.target.value === "" ? null : Number(e.target.value)
                      handleChange("quizId", val)
                    }}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  >
                    <option value="">— Aucun —</option>
                    {quizzes?.map?.((q: any) => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                )}
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
              Enregistrer
            </MadaButton>
          </CardFooter>
        </form>
      </Card>

      <ParticipantList />
    </div>
  )
}

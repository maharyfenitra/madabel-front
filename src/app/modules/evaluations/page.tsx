"use client"
import useCandidateEvaluations from './hooks/useCandidateEvaluations'
import Link from 'next/link'
import { MadaButton } from '@/app/lib/components'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Clock, AlertCircle } from "lucide-react"

export default function Page(){
  const { data } = useCandidateEvaluations(1, 50)
  const evaluations = data?.evaluations ?? []

  // only pending evaluations are returned by the backend for the candidate
  const pending = evaluations.filter((e: any) => !e.isCompleted)

  return (
    <div className="py-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-yellow-500" />
                Évaluations à réaliser
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                Répondez aux questionnaires qui vous ont été assignés
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucune évaluation en attente
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vous n'avez actuellement aucune évaluation à réaliser.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pending.map((ev: any) => (
                <div key={ev.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{ev.ref}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Date limite: {new Date(ev.deadline).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      {ev.quizId ? (
                        <Link href={`/modules/evaluations/${ev.quizId}?participantId=${ev.currentParticipantId}&evaluationId=${ev.id}`}>
                          <MadaButton>Remplir</MadaButton>
                        </Link>
                      ) : (
                        <MadaButton disabled>Quiz non lié</MadaButton>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

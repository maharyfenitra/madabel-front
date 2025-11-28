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
import { FileText, Clock, AlertCircle, CheckCircle, Eye, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCurrentUser } from "@/app/lib/api"

export default function Page(){
  const { data } = useCandidateEvaluations(1, 50)
  const { getUser } = useCurrentUser()
  const user = getUser()
  const evaluations = data?.evaluations ?? []

  // Séparer les évaluations où l'utilisateur est évaluateur vs candidat
  const asEvaluator = evaluations.filter((e: any) => {
    const currentParticipant = e.participants?.find((p: any) => p.user.id === user?.id)
    return currentParticipant?.participantRole === "EVALUATOR" && !e.isCompleted
  })

  const asCandidate = evaluations.filter((e: any) => {
    const currentParticipant = e.participants?.find((p: any) => p.user.id === user?.id)
    return currentParticipant?.participantRole === "CANDIDAT" && !e.isCompleted
  })

  const completed = evaluations.filter((e: any) => e.isCompleted)

  return (
    <div className="py-6 space-y-6">
      {/* Évaluations d'autres personnes (en tant qu'évaluateur) */}
      {asEvaluator.length > 0 && (
        <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-yellow-500" />
                  Évaluations à compléter
                </CardTitle>
                <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                  Évaluez les personnes assignées
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {asEvaluator.length} à compléter
              </Badge>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {asEvaluator.map((ev: any) => {
                const candidat = ev.participants?.find((p: any) => p.participantRole === "CANDIDAT")
                return (
                  <div key={ev.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{ev.ref}</div>
                        {candidat && (
                          <div className="flex items-center gap-2 mt-1">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Candidat: {candidat.user.name}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Date limite: {new Date(ev.deadline).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div>
                        {ev.quizId ? (
                          <Link href={`/modules/evaluations/${ev.quizId}?participantId=${ev.currentParticipantId}&evaluationId=${ev.id}`}>
                            <MadaButton>Évaluer</MadaButton>
                          </Link>
                        ) : (
                          <MadaButton disabled>Quiz non lié</MadaButton>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auto-évaluations (en tant que candidat) */}
      {asCandidate.length > 0 && (
        <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <User className="w-6 h-6 text-yellow-500" />
                  Auto-évaluations
                </CardTitle>
                <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                  Complétez votre propre évaluation
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {asCandidate.length} en attente
              </Badge>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {asCandidate.map((ev: any) => (
                <div key={ev.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{ev.ref}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Date limite: {new Date(ev.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div>
                      {ev.quizId ? (
                        <Link href={`/modules/evaluations/${ev.quizId}?participantId=${ev.currentParticipantId}&evaluationId=${ev.id}`}>
                          <MadaButton>M'auto-évaluer</MadaButton>
                        </Link>
                      ) : (
                        <MadaButton disabled>Quiz non lié</MadaButton>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si aucune évaluation en attente */}
      {asEvaluator.length === 0 && asCandidate.length === 0 && completed.length === 0 && (
        <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucune évaluation en attente
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vous n'avez actuellement aucune évaluation à réaliser.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Évaluations complétées */}
      {completed.length > 0 && (
        <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  Évaluations complétées
                </CardTitle>
                <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                  Consultez vos évaluations soumises
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {completed.length} complétée(s)
              </Badge>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {completed.map((ev: any) => (
                <div key={ev.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{ev.ref}</div>
                        <Badge className="bg-green-500 text-white">Complétée</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Soumise le: {new Date(ev.completedAt).toLocaleDateString('fr-FR')} à {new Date(ev.completedAt).toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div>
                      {ev.quizId ? (
                        <Link href={`/modules/evaluations/${ev.quizId}/results?evaluationId=${ev.id}`}>
                          <MadaButton variant="outline" className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Consulter
                          </MadaButton>
                        </Link>
                      ) : (
                        <MadaButton disabled>Quiz non lié</MadaButton>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"
import useCandidateEvaluations from './hooks/useCandidateEvaluations'
import Link from 'next/link'
import { MadaButton } from '@/app/lib/components'

export default function Page(){
  const { data } = useCandidateEvaluations(1, 50)
  const evaluations = data?.evaluations ?? []

  // only pending evaluations are returned by the backend for the candidate
  const pending = evaluations.filter((e: any) => !e.isCompleted)

  return (
    <div className="py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Évaluations à réaliser</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pending.map((ev: any) => (
          <div key={ev.id} className="p-4 border rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium">{ev.ref}</div>
                <div className="text-sm text-muted-foreground">Date limite: {new Date(ev.deadline).toLocaleString()}</div>
              </div>
              <div>
                {/* The evaluation should reference a quizId; pass quizId and participantId to the candidate page */}
                {ev.quizId ? (
                  <Link href={`/modules/evaluations/${ev.quizId}?participantId=${ev.currentParticipantId}`}>
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
    </div>
  )
}

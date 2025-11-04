import { useGenericQuery, formatDataFromQuery } from "@/app/lib/api"
import { useEffect } from "react"

// Types matching the backend response
export type ParticipantUser = {
    name?: string | null
    email?: string | null
    phone?: string | null
    role?: string | null
}

export type EvaluationParticipant = {
    participantRole: string
    user: ParticipantUser
}

export type Evaluation = {
    id: number
    ref: string
    createdAt: string
    deadline: string
    completedAt?: string | null
    isCompleted: boolean
    role?: string | null
    participants?: EvaluationParticipant[]
}

type UseEvaluationTableResult = {
    evaluations: Evaluation[]
    meta?: {
        total: number
        page: number
        limit: number
        totalPages: number
    } | null
}

export const useEvaluationTable = (page = 1, limit = 10) => {
    const { data, refetch } = useGenericQuery((raw) => {
        const formatted = formatDataFromQuery(raw)

        return formatted as typeof formatted & UseEvaluationTableResult
    }, "/evaluations/", "evaluations", { page, limit })

    useEffect(() => {
        // force refetch when pagination params change
        refetch()
    }, [page, limit, refetch])

    return { data: data as UseEvaluationTableResult | undefined }
}

export default useEvaluationTable
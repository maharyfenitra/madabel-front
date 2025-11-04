import { useGenericQuery } from "@/app/lib/api"
import { formatDataFromQuery } from "@/app/lib/api"
export const useParticipantList = (id: number) => {
    const { data: participantEvaluators, refetch: refetchEvaluators, isLoading } = useGenericQuery((data) => {
        const dataResponse = formatDataFromQuery(data);
        return dataResponse
    }, `/evaluations/evaluators/${id}`, `evaluations-evaluators-${id}`)

    return { participantEvaluators, refetchEvaluators, isLoading }
}
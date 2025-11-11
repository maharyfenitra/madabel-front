import { useGenericQuery } from "@/app/lib/api"
import { formatDataFromQuery } from "@/app/lib/api"
export const useParticipantList = (id: number) => {
    const { data: participants, refetch: refetchParticipants, isLoading } = useGenericQuery((data) => {
        const dataResponse = formatDataFromQuery(data);
        return dataResponse
    }, `/evaluations/participants/${id}`, `evaluations-participants-${id}`)

    return { participants, refetchParticipants, isLoading }
}
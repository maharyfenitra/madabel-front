import { useGenericQuery, formatDataFromQuery } from '@/app/lib/api'

export const useCandidateEvaluations = (page = 1, limit = 10) => {
  const { data, refetch, isLoading } = useGenericQuery((raw) => {
    const formatted = formatDataFromQuery(raw)
    return formatted as typeof formatted & { evaluations: any[] }
  }, "/candidate-evaluations/", "candidate-evaluations", { page, limit })

  return {
    data: data as { evaluations: any[] } | undefined,
    refetch,
    isLoading,
  }
}

export default useCandidateEvaluations

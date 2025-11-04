import { useGenericQuery, useGenericMutation } from "@/app/lib/api"
import { formatDataFromQuery } from "@/app/lib/api"
import { useEffect } from "react"

type UseUserTableResult = {
  users: any[]
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  } | null
}

export const useUserTable = (page = 1, limit = 10) => {
  const { data, refetch, isLoading } = useGenericQuery((data) => {
    
    const formatData = formatDataFromQuery(data)

    return formatData as typeof formatData & UseUserTableResult
  }, "/users/", "users", { page, limit })

  useEffect(() => {
  refetch()
}, [page, limit, refetch])

  // delete mutation using the project's generic mutation helper
  // We pass method="DELETE" and send the id in the variables (body).
  const { mutateAsync: deleteMutate } = useGenericMutation< { id: number } >(
    "/users/",
    "DELETE"
  )

  const deleteUser = async (id: number | string) => {
    const nid = typeof id === "string" ? Number(id) : id
    return deleteMutate({ id: nid })
  }

  return { data: data as UseUserTableResult | undefined, deleteUser, refetch, isLoading }
}


export default useUserTable

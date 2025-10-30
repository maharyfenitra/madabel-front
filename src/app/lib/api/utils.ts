import { UseQueryResult } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
export const formatDataFromQuery = (data: any) => {
    const { data: dataResponse, ...rest} = data
    return { data: dataResponse?.data, ...rest } as UseQueryResult<any>
}
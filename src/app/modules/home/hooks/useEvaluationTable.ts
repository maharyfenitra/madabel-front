import { useGenericQuery } from "@/app/lib/api"
export const useEvaluationTable = () => {
    const { data } = useGenericQuery((data)=> {

        const {data: dataResponse, ...rest} = data
        return { data: dataResponse?.data, ...rest}
    }, "/evaluations/", "evaluations")

    console.log(data)

    return { data }
}
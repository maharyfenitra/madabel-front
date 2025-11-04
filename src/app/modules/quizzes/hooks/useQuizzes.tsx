import { useGenericQuery } from "@/app/lib/api";
import { formatDataFromQuery } from "@/app/lib/api";

export const useQuizzes = () => {
    const { data, isLoading} = useGenericQuery((data) => {
        return formatDataFromQuery(data);
    }, "/quizzes/", "quizzes");

    console.log(data);

    return {  quizzes: data?.quizzes, isLoading  };
}

export default useQuizzes;

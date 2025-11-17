import { useGenericQuery, formatDataFromQuery, useGenericMutation } from "@/app/lib/api";

export const useQuizzes = () => {
    const { data, isLoading, refetch } = useGenericQuery((data) => {
        return formatDataFromQuery(data);
    }, "/quizzes/", "quizzes");

    const { mutateAsync } = useGenericMutation(`/quizzes/`, "DELETE");

    const deleteQuiz = async (id: number) => {
        await mutateAsync({ id });
        refetch();
    };

    console.log(data);

    return { quizzes: data?.quizzes, isLoading, deleteQuiz };
};

export default useQuizzes;

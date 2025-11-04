import useQuizzes from "../hooks/useQuizzes";
import Link from "next/link";
import { MadaButton } from "@/app/lib/components/button";

const QuizList = () => {
  const { quizzes, isLoading } = useQuizzes();

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        <Link href="/modules/quizzes/details">
          <MadaButton>Créer un quiz</MadaButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quizzes?.map?.((q: any) => (
          <div key={q.id} className="p-4 border rounded">
            <h3 className="text-lg font-medium">{q.title}</h3>
            <p className="text-sm text-muted-foreground">{q.description}</p>
            <div className="mt-2">
              <Link href={`/modules/quizzes/${q.id}`} className="text-blue-600">
                Voir
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;

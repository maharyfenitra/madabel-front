"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGenericQuery } from "@/app/lib/api";
import { formatDataFromQuery } from "@/app/lib/api";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const evaluationId = searchParams.get("evaluationId") || searchParams.get("e");

  const { data, isLoading } = useGenericQuery(
    (data) => formatDataFromQuery(data),
    `/candidate-evaluations/${evaluationId}/answers`,
    `candidate-evaluations-${evaluationId}-answers`
  );

  if (isLoading) {
    return (
      <div className="py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de vos réponses...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-6">
        <div className="text-center text-red-500">
          Erreur lors du chargement des réponses
        </div>
      </div>
    );
  }

  const answers = data.answers || [];
  const completedAt = data.completedAt;

  const renderAnswerValue = (answer: any) => {
    switch (answer.questionType) {
      case "TEXT":
        return (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-2">
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {answer.answer || <span className="text-gray-400 italic">Pas de réponse</span>}
            </p>
          </div>
        );

      case "SCALE":
        return (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-2">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 text-white text-2xl font-bold rounded-full">
                {answer.answer !== null ? answer.answer : "N/A"}
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(answer.answer / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Note: {answer.answer !== null ? `${answer.answer} / 10` : "Non répondu"}
                </p>
              </div>
            </div>
          </div>
        );

      case "SINGLE_CHOICE":
        return (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-2">
            {answer.answer ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {answer.answer.text}
                </span>
              </div>
            ) : (
              <span className="text-gray-400 italic">Pas de réponse</span>
            )}
          </div>
        );

      case "MULTIPLE_CHOICE":
        return (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mt-2">
            {answer.answer && answer.answer.length > 0 ? (
              <ul className="space-y-2">
                {answer.answer.map((opt: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {opt.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400 italic">Pas de réponse</span>
            )}
          </div>
        );

      default:
        return <span className="text-gray-400 italic">Type de question non supporté</span>;
    }
  };

  return (
    <div className="py-6">
      <Link href="/modules/evaluations">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux évaluations
        </Button>
      </Link>

      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-green-500" />
                Évaluation complétée
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                Consultation de vos réponses en lecture seule
              </CardDescription>
            </div>
            {completedAt && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Soumise le {new Date(completedAt).toLocaleDateString('fr-FR')} à {new Date(completedAt).toLocaleTimeString('fr-FR')}
              </Badge>
            )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Cette évaluation a été complétée et soumise. Les réponses ci-dessous sont en lecture seule et ne peuvent plus être modifiées.
            </p>
          </div>

          {answers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucune réponse trouvée pour cette évaluation.
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer: any, index: number) => (
                <Card key={answer.questionId} className="border-l-4 border-l-green-500 shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed flex-1">
                          <span className="text-green-600 dark:text-green-400 mr-2">Q{index + 1}.</span>
                          {answer.questionText}
                        </h3>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {answer.questionType === "TEXT" && "Texte libre"}
                          {answer.questionType === "SCALE" && "Échelle"}
                          {answer.questionType === "SINGLE_CHOICE" && "Choix unique"}
                          {answer.questionType === "MULTIPLE_CHOICE" && "Choix multiples"}
                        </Badge>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Votre réponse :
                        </p>
                        {renderAnswerValue(answer)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

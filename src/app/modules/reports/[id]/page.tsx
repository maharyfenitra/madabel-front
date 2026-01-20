"use client";

import { useParams } from "next/navigation";
import { formatDataFromQuery, useGenericQuery } from "@/app/lib/api";
import { useCurrentUser } from "@/app/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, FileText, BarChart3, TrendingUp, Download, Mail, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { generateReportPDF } from "@/app/lib/utils/pdf";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type QuestionReport = {
  questionId: number;
  questionText: string;
  questionType: string;
  overallAverage: number | null;
  averagesByEvaluatorType: Record<string, number>;
  totalEvaluators: number;
  answeredEvaluators: number;
};

type CategoryReport = {
  category: string;
  questions: QuestionReport[];
};

type EvaluationReport = {
  evaluationId: number;
  evaluationRef: string;
  report: CategoryReport[];
};

type Evaluation = {
  id: number;
  ref: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  participants: Array<{
    id: number;
    participantRole: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
};

export default function ReportDetailPage() {
  const params = useParams();
  const evaluationId = params.id as string;
  const { getUser } = useCurrentUser();
  const user = getUser();

  // Récupérer le rapport détaillé (qui contient aussi les infos de l'évaluation)
  const { data: reportData, isLoading, error } = useGenericQuery(
    (data) => formatDataFromQuery(data) ,
    `/reports/${evaluationId}`,
    `evaluation-report-${evaluationId}`
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du rapport...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            {error.message || "Erreur lors du chargement du rapport"}
          </div>
          <Link href="/modules/reports">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux rapports
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const evaluation = reportData?.evaluation;

  if (!evaluation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">Évaluation introuvable</div>
          <Link href="/modules/reports">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux rapports
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Vérifier les droits d'accès
  // ADMIN : accès à tous les rapports
  // EVALUATOR : accès aux rapports où il a participé
  // CANDIDAT : accès à ses propres rapports
  const hasAccess = user?.role === "ADMIN" || 
    evaluation.participants.some(
      (participant: Evaluation['participants'][0]) =>
        participant.user.id === user?.id
    );

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">Accès non autorisé à ce rapport</div>
          <Link href="/modules/reports">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux rapports
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Trouver les évaluateurs
  const evaluators = evaluation.participants.filter(
    (participant: Evaluation['participants'][0]) => participant.participantRole === "EVALUATOR"
  );

  const report = reportData?.report || [];

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = async () => {
    try {
      toast.info("Génération du PDF en cours...");
      await generateReportPDF({
        evaluationRef: evaluation.ref,
        candidatName: reportData?.candidateName || "Candidat",
        deadline: evaluation.deadline,
        report: report,
      });
      toast.success("PDF téléchargé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/modules/reports">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux rapports
          </Button>
        </Link>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rapport d'Évaluation 360°
            </h1>
            <p className="text-gray-600">Référence: {evaluation.ref}</p>
            {reportData?.candidateName && (
              <p className="text-lg font-semibold text-blue-600 mt-1">
                Candidat: {reportData.candidateName}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Badge variant={evaluation.isCompleted ? "default" : "secondary"} className="h-fit">
              {evaluation.isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Terminée
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1" />
                  En cours
                </>
              )}
            </Badge>
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger le PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Catégories</p>
                <p className="text-2xl font-bold text-gray-900">{report.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {report.reduce((sum: number, cat: CategoryReport) => sum + cat.questions.length, 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Évaluateurs</p>
                <p className="text-2xl font-bold text-gray-900">{evaluators.length}</p>
              </div>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moyenne globale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {report.length > 0 ? (
                    (
                      report.reduce((sum: number, cat: CategoryReport) => 
                        sum + cat.questions.reduce((qSum: number, q: QuestionReport) => qSum + (q.overallAverage || 0), 0) / cat.questions.length
                      , 0) / report.length
                    ).toFixed(1)
                  ) : "N/A"}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations générales */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Informations de l'évaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                Date limite
              </div>
              <p className="font-medium">
                {new Date(evaluation.deadline).toLocaleDateString("fr-FR", {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                Date de création
              </div>
              <p className="font-medium">
                {new Date(evaluation.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <User className="w-4 h-4 mr-1" />
                Évaluateurs ({evaluators.length})
              </div>
              <div className="space-y-2">
                {evaluators.map((evaluator: Evaluation['participants'][0]) => (
                  <div key={evaluator.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <p className="font-medium">{evaluator.user.name}</p>
                      <p className="text-xs text-gray-500">{evaluator.user.email}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {evaluator.participantRole}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rapport d'évaluation */}
      <div className="space-y-8">
        {report.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Aucun rapport disponible pour cette évaluation.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          report.map((categoryReport: CategoryReport) => (
            <Card key={categoryReport.category} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                <CardTitle className="flex items-center text-xl">
                  <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                  {getCategoryLabel(categoryReport.category)}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {categoryReport.questions.length} question{categoryReport.questions.length > 1 ? "s" : ""}
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 min-w-[300px]">
                          Question
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center min-w-[120px]">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            Moyenne générale
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center min-w-[120px]">
                          Collaborateurs
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center min-w-[120px]">
                          Manager
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center min-w-[120px]">
                          Pairs
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center min-w-[120px]">
                          Autres
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center min-w-[120px]">
                          Soi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryReport.questions.map((question: QuestionReport, questionIndex: number) => (
                        <TableRow key={question.questionId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            <div className="flex items-start gap-3">
                              <span className="text-sm text-gray-500 font-mono mt-0.5 flex-shrink-0">
                                {questionIndex + 1}.
                              </span>
                              <div>
                                <p className="text-sm leading-relaxed">{question.questionText}</p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Moyenne générale */}
                          <TableCell className="text-center">
                            {question.overallAverage !== null ? (
                              <div className="space-y-1">
                                <div className="text-lg font-bold text-blue-600">
                                  {question.overallAverage.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {question.answeredEvaluators}/{question.totalEvaluators}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </TableCell>

                          {/* Collaborateurs Directs */}
                          <TableCell className="text-center">
                            <EvaluatorScore
                              score={question.averagesByEvaluatorType.COLLABORATEUR_DIRECT}
                            />
                          </TableCell>

                          {/* Manager Direct */}
                          <TableCell className="text-center">
                            <EvaluatorScore
                              score={question.averagesByEvaluatorType.MANAGER_DIRECT}
                            />
                          </TableCell>

                          {/* Pairs */}
                          <TableCell className="text-center">
                            <EvaluatorScore
                              score={question.averagesByEvaluatorType.COLLEGUE}
                            />
                          </TableCell>

                          {/* Autres */}
                          <TableCell className="text-center">
                            <EvaluatorScore
                              score={question.averagesByEvaluatorType.RH}
                            />
                          </TableCell>

                          {/* Soi - Non applicable dans ce contexte */}
                          <TableCell className="text-center">
                            <span className="text-gray-400 text-sm">-</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    POSITION: "Position",
    PERMISSION: "Permission",
    PRODUCTION: "Production",
    DEVELOPMENT_OF_OTHERS: "Développement des autres",
    SUMMIT: "Sommet",
  };
  return labels[category] || category;
}

function getEvaluatorTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    MANAGER_DIRECT: "Manager Direct",
    COLLABORATEUR_DIRECT: "Collaborateur Direct",
    COLLEGUE: "Pair/Collègue",
    RH: "Autres",
    CANDIDAT: "Candidat",
  };
  return labels[type] || type;
}

// Composant pour afficher un score d'évaluateur
function EvaluatorScore({ score }: { score: number | undefined }) {
  if (score === undefined || score === null) {
    return <span className="text-gray-400 text-sm">-</span>;
  }

  return (
    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
      {score.toFixed(1)}
    </div>
  );
}

// Fonction pour calculer le score combiné des évaluateurs directs
function getCombinedDirectScore(averagesByType: Record<string, number>): number | undefined {
  const managerDirect = averagesByType.MANAGER_DIRECT;
  const collaborateurDirect = averagesByType.COLLABORATEUR_DIRECT;

  const scores = [managerDirect, collaborateurDirect].filter(score => score !== undefined && score !== null);

  if (scores.length === 0) return undefined;

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}
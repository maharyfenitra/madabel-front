"use client";

import { useState } from "react";
import { formatDataFromQuery, useGenericQuery } from "@/app/lib/api";
import { useCurrentUser } from "@/app/lib/api";
import { useAccessToken } from "@/app/lib/api/useAccessToken";
import { URL_CONFIG } from "@/app/lib/api/configServer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Eye, Loader2, AlertCircle, Download } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateReportPDF } from "@/app/lib/utils/pdf";
import { toast } from "sonner";

type Evaluation = {
  id: number;
  ref: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  candidat: {
    id: number;
    name: string;
    email: string;
  } | null;
  evaluatorsCount: number;
  completedEvaluators: number;
  quiz: {
    id: number;
    title: string;
  } | null;
  participants: Array<{
    id: number;
    participantRole: string;
    completedAt: string | null;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }>;
};

type EvaluationsResponse = {
  evaluations: Evaluation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default function ReportsPage() {
  const { getUser } = useCurrentUser();
  const user = getUser();
  const { getAccessToken } = useAccessToken();

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGenericQuery(
    (data) => formatDataFromQuery(data),
    `/reports?page=${page}&limit=${limit}`,
    `reports-${page}`,
    {}
  );

  const handleDownloadPDF = async (evaluationId: number, ref: string) => {
    try {
      toast.info("Génération du PDF en cours...");
      
      const token = getAccessToken();
      
      if (!token) {
        toast.error("Non authentifié. Veuillez vous reconnecter.");
        return;
      }
      
      // Récupérer les données du rapport avec authentification
      const response = await fetch(`${URL_CONFIG.uri}/reports/${evaluationId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non autorisé. Veuillez vous reconnecter.');
        }
        throw new Error('Erreur lors de la récupération du rapport');
      }
      
      const reportData = await response.json();
      
      // Générer le PDF
      await generateReportPDF({
        evaluationRef: ref,
        candidatName: reportData.candidat?.name,
        deadline: reportData.evaluation?.deadline || reportData.deadline,
        report: reportData.report,
      });
      
      toast.success("PDF téléchargé avec succès!");
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération du PDF");
    }
  };

  return (
    <div className="py-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-yellow-500" />
                {user?.role === "ADMIN" ? "Tous les Rapports d'Évaluation" : 
                 user?.role === "EVALUATOR" ? "Rapports auxquels j'ai participé" :
                 "Mes Rapports d'Évaluation"}
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                {user?.role === "ADMIN" ? "Gérez et consultez tous les rapports d'évaluation" :
                 user?.role === "EVALUATOR" ? "Consultez les rapports des évaluations que vous avez complétées" :
                 "Consultez les évaluations réalisées par vos évaluateurs"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Chargement des rapports...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {error.message || "Une erreur est survenue lors du chargement des rapports"}
              </p>
            </div>
          ) : (() => {
            const evaluations = data?.evaluations || [];

            return evaluations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Aucun rapport disponible
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.role === "ADMIN" 
                    ? "Aucune évaluation n'a été créée pour le moment."
                    : user?.role === "EVALUATOR"
                    ? "Vous n'avez pas encore participé à des évaluations."
                    : "Vous n'avez pas encore d'évaluations complétées par vos évaluateurs."}
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-yellow-500" />
                            Référence
                          </div>
                        </TableHead>
                        {(user?.role === "ADMIN" || user?.role === "EVALUATOR") && (
                          <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                            Candidat
                          </TableHead>
                        )}
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            Date limite
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            Progression
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Statut
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluations.map((evaluation: Evaluation) => {

                        return (
                          <TableRow
                            key={evaluation.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                                {evaluation.ref}
                              </div>
                            </TableCell>
                            {(user?.role === "ADMIN" || user?.role === "EVALUATOR") && (
                              <TableCell className="text-gray-700 dark:text-gray-300">
                                <div className="flex flex-col">
                                  <span className="font-medium">{evaluation.candidat?.name || "N/A"}</span>
                                  <span className="text-xs text-gray-500">{evaluation.candidat?.email}</span>
                                </div>
                              </TableCell>
                            )}
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              {new Date(evaluation.deadline).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">
                                      {evaluation.completedEvaluators} / {evaluation.evaluatorsCount}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full transition-all" 
                                      style={{ 
                                        width: `${evaluation.evaluatorsCount > 0 ? (evaluation.completedEvaluators / evaluation.evaluatorsCount) * 100 : 0}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={evaluation.completedEvaluators === evaluation.evaluatorsCount && evaluation.evaluatorsCount > 0 ? "default" : "secondary"}
                                className={
                                  evaluation.completedEvaluators === evaluation.evaluatorsCount && evaluation.evaluatorsCount > 0
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }
                              >
                                {evaluation.completedEvaluators === evaluation.evaluatorsCount && evaluation.evaluatorsCount > 0 ? "Terminée" : "En cours"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/modules/reports/${evaluation.id}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir le rapport
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadPDF(evaluation.id, evaluation.ref)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 dark:text-green-400"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Télécharger PDF
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {data?.meta && data.meta.totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                      >
                        Précédent
                      </Button>

                      <span className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        Page {page} sur {data.meta.totalPages}
                      </span>

                      <Button
                        variant="outline"
                        onClick={() => setPage(Math.min(data.meta.totalPages, page + 1))}
                        disabled={page === data.meta.totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}

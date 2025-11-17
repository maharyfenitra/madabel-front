"use client";

import { useState } from "react";
import { formatDataFromQuery, useGenericQuery } from "@/app/lib/api";
import { useCurrentUser } from "@/app/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, FileText, Eye, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Evaluation = {
  id: number;
  ref: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: string;
  currentParticipantId: number | null;
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

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGenericQuery(
    (data) => formatDataFromQuery(data),
    `/candidate-evaluations/?page=${page}&limit=${limit}`,
    `candidate-evaluations-${page}`,
    {}
  );

  return (
    <div className="py-6">
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-yellow-500" />
                Mes Rapports d'Évaluation
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                Consultez les évaluations réalisées par vos évaluateurs
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

            // Filtrer seulement les évaluations où l'utilisateur est candidat
            const candidateEvaluations = evaluations.filter((evaluation: Evaluation) =>
              evaluation.participants.some(
                (participant: Evaluation['participants'][0]) =>
                  participant.user.id === user?.id &&
                  participant.participantRole === "CANDIDAT"
              )
            );

            return candidateEvaluations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Aucun rapport disponible
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Vous n'avez pas encore d'évaluations complétées par vos évaluateurs.
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
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            Date limite
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            Évaluateurs
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
                      {candidateEvaluations.map((evaluation: Evaluation) => {
                        // Trouver les évaluateurs (participants qui ne sont pas le candidat actuel)
                        const evaluators = evaluation.participants.filter(
                          (participant: Evaluation['participants'][0]) =>
                            participant.participantRole === "EVALUATOR" ||
                            participant.user.id !== user?.id
                        );

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
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              {new Date(evaluation.deadline).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{evaluators.length}</span>
                                <span className="text-sm text-gray-500">
                                  évaluateur{evaluators.length > 1 ? 's' : ''}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={evaluation.isCompleted ? "default" : "secondary"}
                                className={
                                  evaluation.isCompleted
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }
                              >
                                {evaluation.isCompleted ? "Terminée" : "En cours"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
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

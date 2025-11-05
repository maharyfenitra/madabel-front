"use client";

import { AddParticipantDialog } from "./AddParticipantDialog";
import { useParams } from "next/navigation";
import { useParticipantList } from "../hooks/useParticipantList";
import { useAccessToken } from "@/app/lib/api";
import { useFetch } from "@/app/lib/api/useFetch";
import { URL_CONFIG } from "@/app/lib/api/configServer";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, Trash2, Loader2, AlertCircle, User as UserIcon, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const ParticipantList = () => {
  const params = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { participantEvaluators, refetchEvaluators, isLoading } = useParticipantList(
    Number(params?.id!)
  );
  
  const { getAccessToken } = useAccessToken();
  const sendRequest = useFetch();

  const handleDelete = async (id: number) => {
    setParticipantToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!participantToDelete) return;

    setIsDeleting(true);
    try {
      const accessToken = getAccessToken();
      await sendRequest(
        "DELETE",
        `${URL_CONFIG.uri}/evaluations/delete/participant/${participantToDelete}`,
        {},
        {
          ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
        }
      );
      refetchEvaluators();
      toast.success("Participant supprimé", {
        description: "Le participant a été retiré de l'évaluation",
      });
      setDeleteDialogOpen(false);
      setParticipantToDelete(null);
    } catch (error: any) {
      toast.error("Erreur de suppression", {
        description: error?.message || "Une erreur est survenue lors de la suppression",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, { bg: string; text: string }> = {
      ADMIN: { bg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", text: "ADMIN" },
      EVALUATOR: { bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", text: "ÉVALUATEUR" },
      CANDIDAT: { bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", text: "CANDIDAT" },
    };
    const colors = roleColors[role] || { bg: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", text: role };
    return (
      <Badge className={cn("text-xs", colors.bg)}>
        {colors.text}
      </Badge>
    );
  };

  return (
    <>
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="w-6 h-6 text-yellow-500" />
                Participants de l'évaluation
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                Gérez les participants (candidats et évaluateurs) de cette évaluation
              </CardDescription>
            </div>
            <AddParticipantDialog evaluationId={Number(params?.id!)} callBack={refetchEvaluators} />
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Chargement des participants...</p>
            </div>
          ) : !participantEvaluators || participantEvaluators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucun participant
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ajoutez des participants à cette évaluation
              </p>
              <AddParticipantDialog evaluationId={Number(params?.id!)} callBack={refetchEvaluators} />
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableCaption className="text-gray-600 dark:text-gray-400">
                  {participantEvaluators.length} participant{participantEvaluators.length > 1 ? "s" : ""} au total
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Nom
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Téléphone
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      Rôle
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      Send mail
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participantEvaluators.map((participant: any, index: number) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          {participant.user.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {participant.user.email || "—"}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {participant.user.phone}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(participant.user.role)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          size="sm"
                          
                          onClick={() => null}
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Envoyer mail
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDelete(participant.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer ce participant de l'évaluation ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

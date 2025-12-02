"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { MadaButton } from "@/app/lib/components"
import { formatDate } from "@/app/lib/utils"
import { useEvaluationTable, type Evaluation } from "../hooks/useEvaluationTable"
import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react"

export const EvaluationTable = () => {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data, isLoading , deleteEvaluation} = useEvaluationTable(page, limit)
  const evaluations = data?.evaluations ?? []
  const meta = data?.meta

  const handleCreate = () => {
    router.push("/modules/home/details")
  }

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  const getStatusBadge = (evaluation: any) => {
    // Calculer le statut basé sur la progression comme dans les rapports
    const isCompleted = evaluation.completedEvaluators === evaluation.evaluatorsCount && evaluation.evaluatorsCount > 0
    
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Terminée
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        <Clock className="w-3.5 h-3.5" />
        En cours
      </span>
    )
  }

  const handleDelete = (evaluation: any) => {
    setEvaluationToDelete(evaluation)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!evaluationToDelete) return

    setIsDeleting(true)
    try {
      await deleteEvaluation(evaluationToDelete.id)
      setDeleteDialogOpen(false)
      setEvaluationToDelete(null)
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-yellow-500" />
              Configuration des évaluations
            </CardTitle>
            <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
              Gérez et suivez toutes vos évaluations en cours
            </CardDescription>
          </div>
          <MadaButton
            className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200"
            onClick={handleCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une évaluation
          </MadaButton>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Chargement des évaluations...</p>
          </div>
        ) : evaluations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Aucune évaluation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Commencez par créer votre première évaluation
            </p>
            <MadaButton
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une évaluation
            </MadaButton>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableCaption className="text-gray-600 dark:text-gray-400">
                  {meta?.total ? `${meta.total} évaluation${meta.total > 1 ? "s" : ""} au total` : "Liste des évaluations"}
                </TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      Référence
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date de création
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Date limite
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      Statut
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Évaluateurs
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evalItem: any) => (
                    <TableRow
                      key={evalItem.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/modules/home/details/${evalItem.id}`)}
                    >
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          {evalItem.ref}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span className="text-sm">{formatDate(evalItem.createdAt)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(evalItem.createdAt).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isDeadlinePassed(evalItem.deadline) && !evalItem.isCompleted
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-900 dark:text-gray-100"
                            )}
                          >
                            {formatDate(evalItem.deadline)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(evalItem.deadline).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(evalItem)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/modules/home/details/${evalItem.id}`)
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Configurer
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/modules/home/details/${evalItem.id}`)
                            }}
                          >
                            Voir
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(evalItem)
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {meta.page} sur {meta.totalPages} • {meta.total} résultat{meta.total > 1 ? "s" : ""}
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.max(1, p - 1))
                        }}
                        href="#"
                        className={cn(
                          "cursor-pointer",
                          page <= 1 && "pointer-events-none opacity-50"
                        )}
                        aria-disabled={page <= 1}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(meta.totalPages, 5) }).map((_, idx) => {
                      let pageNumber: number
                      if (meta.totalPages <= 5) {
                        pageNumber = idx + 1
                      } else if (page <= 3) {
                        pageNumber = idx + 1
                      } else if (page >= meta.totalPages - 2) {
                        pageNumber = meta.totalPages - 4 + idx
                      } else {
                        pageNumber = page - 2 + idx
                      }

                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              setPage(pageNumber)
                            }}
                            isActive={pageNumber === page}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault()
                          setPage((p) => Math.min(meta.totalPages, p + 1))
                        }}
                        href="#"
                        className={cn(
                          "cursor-pointer",
                          page >= meta.totalPages && "pointer-events-none opacity-50"
                        )}
                        aria-disabled={page >= meta.totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'évaluation "{evaluationToDelete?.ref}" ?
              Cette action est irréversible et supprimera également tous les participants et leurs réponses associées.
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
    </Card>
  )
}

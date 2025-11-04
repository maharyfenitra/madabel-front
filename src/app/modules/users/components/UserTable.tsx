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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { formatDate } from "@/app/lib/utils"
import { useUserTable } from "../hooks/useUserTable"
import { toast } from "sonner"
import { useState } from "react"
import { Users, Plus, Edit, Trash2, Mail, User as UserIcon, Calendar, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export const UserTable = () => {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data, deleteUser, refetch, isLoading } = useUserTable(page, limit)
  const users = data?.users ?? []
  const meta = data?.meta

  const handleDelete = async (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    
    setIsDeleting(true)
    try {
      await deleteUser(userToDelete)
      toast.success("Utilisateur supprimé avec succès")
      refetch()
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error: any) {
      console.error("Erreur suppression utilisateur:", error)
      toast.error("Impossible de supprimer l'utilisateur", {
        description: error?.message || String(error),
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreate = () => {
    router.push("/modules/users/details/")
  }

  const handleEdit = (id: string) => {
    router.push(`/modules/users/details/${id}`)
  }

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, { bg: string; text: string }> = {
      ADMIN: { bg: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", text: "ADMIN" },
      EVALUATOR: { bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", text: "ÉVALUATEUR" },
      CANDIDAT: { bg: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", text: "CANDIDAT" },
    }
    const colors = roleColors[role] || { bg: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", text: role }
    return (
      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", colors.bg)}>
        {colors.text}
      </span>
    )
  }

  return (
    <>
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="w-6 h-6 text-yellow-500" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                Gérez tous les utilisateurs de la plateforme
              </CardDescription>
            </div>
            <MadaButton 
              className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200" 
              onClick={handleCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un utilisateur
            </MadaButton>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Chargement des utilisateurs...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Aucun utilisateur
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Commencez par créer votre premier utilisateur
              </p>
              <MadaButton
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={handleCreate}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un utilisateur
              </MadaButton>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableCaption className="text-gray-600 dark:text-gray-400">
                    {meta?.total ? `${meta.total} utilisateur${meta.total > 1 ? "s" : ""} au total` : "Liste des utilisateurs"}
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
                        Rôle
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date de création
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            {user.fullName ?? user.name ?? "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {user.email || "—"}
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role || "—")}
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400"
                              onClick={() => handleEdit(user.id)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Supprimer
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
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
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
  )
}

export default UserTable

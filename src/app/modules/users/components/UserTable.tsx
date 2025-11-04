"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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

export const UserTable = () => {
  const router = useRouter()
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)

  const { data, deleteUser, refetch } = useUserTable(page, limit)
  const users = data?.users ?? []
  const meta = data?.meta

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")
    if (!ok) return

    try {
      await deleteUser(id)
      toast.success("Utilisateur supprimé")
      refetch()
    } catch (error: any) {
      console.error("Erreur suppression utilisateur:", error)
      toast("Impossible de supprimer l'utilisateur", {
        description: error?.message || String(error),
      })
    }
  }

  const handleCreate = () => {
    router.push("/modules/users/details/")
  }

  const handleEdit = (id: string) => {
    router.push(`/modules/users/details/${id}`)
  }

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Utilisateurs
        </CardTitle>
        <MadaButton className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleCreate}>+ Ajouter</MadaButton>
      </CardHeader>

      <Separator />

      <CardContent>
        <Table>
          <TableCaption>Liste des utilisateurs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName ?? user.name ?? "—"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role ?? "—"}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="link" onClick={() => handleEdit(user.id)}>Modifier</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm" onClick={() => handleDelete(user.id)}>Supprimer</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} href="#" aria-disabled={page <= 1} />
                </PaginationItem>

                {Array.from({ length: meta.totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPage(pageNumber)
                        }}
                        isActive={pageNumber === page}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} href="#" aria-disabled={page >= meta.totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UserTable

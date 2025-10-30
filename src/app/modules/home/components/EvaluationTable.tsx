// app/components/EvaluatorsTable.tsx
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

type Evaluation = {
  id: string
  createdAt: string
  deadline: string
  completedAt?: string
  isCompleted: boolean
}

import { useEvaluationTable } from "../hooks/useEvaluationTable"

export const EvaluationTable = () => {
  const router = useRouter()
  const { data: evaluations } = useEvaluationTable()

  const handleCancel = (id: string) => {
    console.log("Évaluation annulée:", id)
  }

  const handleCreate = () => {
    router.push("/modules/home/details")
  }

  return (
    <Card className="shadow-lg rounded-2xl border border-gray-200">
      {/* ✅ En-tête uniforme */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Configuration des évaluations
        </CardTitle>
        <Button onClick={handleCreate}>+ Créer une évaluation</Button>
      </CardHeader>

      {/* ✅ Séparateur pour cohérence visuelle */}
      <Separator />

      <CardContent>
        <Table>
          <TableCaption>Liste des évaluations en cours</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Réf</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Date limite de réalisation</TableHead>
              <TableHead>Date d’achèvement</TableHead>
              <TableHead>Test achevé</TableHead>
              <TableHead>Rôles</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations?.map((evalItem: any) => (
              <TableRow key={evalItem.id}>
                <TableCell className="font-medium">{evalItem.ref}</TableCell>
                <TableCell>{evalItem.createdAt}</TableCell>
                <TableCell>{evalItem.deadline}</TableCell>
                <TableCell>{evalItem.completedAt || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      evalItem.isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {evalItem.isCompleted ? "Oui" : "Non"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    
                    onClick={() =>
                      router.push(`/modules/home/details/${evalItem.id}`)
                    }
                  >
                    DÉFINIR ÉVALUATEURS
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancel(evalItem.id)}
                  >
                    Annuler
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

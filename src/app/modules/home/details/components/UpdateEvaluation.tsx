// app/evaluations/nouvelle/page.tsx
"use client"

import { ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUpdateEvaluation } from "../hooks/useUpdateEvaluation"
import { ParticipantList } from "./ParticipantList"

export function UpdateEvaluation() {
  const router = useRouter()
const { handleSubmit, handleChange, formData } = useUpdateEvaluation()
  return (
    <div>
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Créer une nouvelle évaluation
          </CardTitle>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            {/* ✅ Grille à 2 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ref" className="mb-2">
                  Référence
                </Label>
                <Input
                  id="ref"
                  name="ref"
                  placeholder="Ex: EVA-2025-01"
                  value={formData.ref}
                  onChange={(e: ChangeEvent<HTMLInputElement>  ) => handleChange("ref", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="createdAt" className="mb-2">
                  Date de création
                </Label>
                <Input
                  id="createdAt"
                  name="createdAt"
                  type="date"
                  value={formData.createdAt}
                  onChange={(e: ChangeEvent<HTMLInputElement>  ) => handleChange("createdAt", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="deadline" className="mb-2">
                  Date limite de réalisation
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e: ChangeEvent<HTMLInputElement>  ) => handleChange("deadline", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="completedAt" className="mb-2">
                  Date d’achèvement
                </Label>
                <Input
                  id="completedAt"
                  name="completedAt"
                  type="date"
                  value={formData.completedAt}
                  onChange={(e: ChangeEvent<HTMLInputElement>  ) => handleChange("completedAt", e.target.value)}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button type="submit">Créer l’évaluation</Button>
          </CardFooter>
        </form>
        <ParticipantList/>
      </Card>
      
    </div>
  )
}

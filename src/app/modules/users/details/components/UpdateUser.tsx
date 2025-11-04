"use client"

import { ChangeEvent } from "react"
import { useRouter, useParams } from "next/navigation"
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
import useUpdateUser from "../hooks/useUpdateUser"

export default function UpdateUser() {
  const router = useRouter()
  
  const { formData, handleChange, handleFileChange, handleSubmit, user } = useUpdateUser()

  // If user is not yet loaded, you can show a simple loader
  if (!user) return <div>Chargement…</div>

  return (
    <div>
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Mettre à jour l'utilisateur
          </CardTitle>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="mb-2">Nom complet</Label>
                <Input id="name" name="name" placeholder="Ex: Rana Andrian" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2">Email</Label>
                <Input id="email" name="email" type="email" placeholder="ex@domain.tld" value={formData.email ?? ""} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="phone" className="mb-2">Téléphone</Label>
                <Input id="phone" name="phone" placeholder="+261 34 00 000 00" value={formData.phone} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="post" className="mb-2">Poste</Label>
                <Input id="post" name="post" placeholder="Ex: Développeur" value={formData.post ?? ""} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("post", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="password" className="mb-2">Mot de passe (laisser vide pour ne pas changer)</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("password", e.target.value)} />
              </div>

              <div>
                <Label htmlFor="role" className="mb-2">Rôle</Label>
                <select id="role" name="role" className="w-full rounded-md border px-3 py-2" value={formData.role} onChange={(e) => handleChange("role", e.target.value)}>
                  <option value="CANDIDAT">CANDIDAT</option>
                  <option value="EVALUATOR">EVALUATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <Label htmlFor="avatar" className="mb-2">Avatar (optionnel)</Label>
                <Input id="avatar" name="avatar" type="file" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] ?? null
                  handleFileChange("avatar", file)
                }} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-3 mt-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" type="submit">Enregistrer</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

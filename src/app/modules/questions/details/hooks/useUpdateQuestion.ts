
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Plus, CheckCircle2 } from "lucide-react"
import { useGenericMutation } from "@/app/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type OptionShape = {
  id?: string | number
  text: string
  value?: number | null
  isKey?: boolean
}

export const useUpdateQuestion = (question: any, onSaved?: () => void) => {
    // Implementation for updating a question will go here
    const router = useRouter()
  const [text, setText] = useState<string>(question?.text || "")
  const [type, setType] = useState<string>(question?.type || "SINGLE_CHOICE")
  const [category, setCategory] = useState<string>(question?.category || "SUMMIT")
  const [order, setOrder] = useState<number | "">(question?.order ?? "")
  const [weight, setWeight] = useState<number | "">(question?.weight ?? "")

  const [options, setOptions] = useState<OptionShape[]>(
    (question?.options || []).map((o: any) => ({ id: o.id ?? o._id ?? undefined, text: o.text || "", value: o.value ?? null, isKey: !!o.isKey }))
  )

  const [newOptText, setNewOptText] = useState("")
  const [newOptValue, setNewOptValue] = useState<string | number>("")
  const [newOptIsKey, setNewOptIsKey] = useState(false)

  // Synchroniser avec les props uniquement au montage initial ou changement d'ID
  useEffect(() => {
    setText(question?.text || "")
    setType(question?.type || "SINGLE_CHOICE")
    setCategory(question?.category || "SUMMIT")
    setOrder(question?.order ?? "")
    setWeight(question?.weight ?? "")
    setOptions(
      (question?.options || []).map((o: any) => ({ 
        id: o.id ?? o._id ?? undefined, 
        text: o.text || "", 
        value: o.value ?? null, 
        isKey: !!o.isKey 
      }))
    )
  }, [question?.id]) // Seulement quand l'ID de la question change

    const { mutateAsync: updateAsync } = useGenericMutation<any>(`/questions/${question?.id}`, "PUT")
    const { mutateAsync: deleteAsync } = useGenericMutation<any>(`/questions/${question?.id}`, "DELETE")

  const addOption = () => {
    if (!newOptText.trim()) return
    setOptions(prev => [...prev, { text: newOptText.trim(), value: newOptValue === "" ? null : Number(newOptValue), isKey: newOptIsKey }])
    setNewOptText("")
    setNewOptValue("")
    setNewOptIsKey(false)
  }

  const updateOption = (idx: number, patch: Partial<OptionShape>) => {
    setOptions(prev => prev.map((o, i) => (i === idx ? { ...o, ...patch } : o)))
  }

  const removeOption = (idx: number) => {
    setOptions(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault()
    try {
      const payload: any = {
        text,
        type,
        category,
        options: options.map((o) => ({ text: o.text, value: typeof o.value === 'number' ? o.value : undefined, isKey: typeof o.isKey === 'boolean' ? o.isKey : undefined })),
      }

      // N'envoyer order que s'il a une valeur
      if (order !== "" && order !== null) {
        payload.order = Number(order);
      }

      // N'envoyer weight que s'il a une valeur
      if (weight !== "" && weight !== null) {
        payload.weight = Number(weight);
      }

      const result = await updateAsync(payload)
      toast.success("Question mise à jour")
      onSaved?.()
      // refresh to get latest data
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error("Impossible de mettre à jour la question")
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Confirmer la suppression de cette question ? Cette action est irréversible.")
    if (!confirmed) return
    try {
      await deleteAsync({})
      toast.success("Question supprimée")
      router.refresh()
      onSaved?.()
    } catch (err: any) {
      console.error(err)
      toast.error("Impossible de supprimer la question")
    }
  }

  return {
    handleDelete,
    handleSave,
    text,   
    type,
    category,
    order,
    weight,
    options,
    newOptText,
    newOptValue,
    newOptIsKey,
    setText,
    setType,
    setCategory,
    setOrder,
    setWeight,
    setOptions,
    setNewOptText,
    setNewOptValue,
    setNewOptIsKey,
    addOption,
    updateOption,
    removeOption
  }
}
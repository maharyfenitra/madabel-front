
import { useState } from "react"
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
  const [language, setLanguage] = useState<string>(question?.language || "fr")

  const [options, setOptions] = useState<OptionShape[]>(
    (question?.options || []).map((o: any) => ({ id: o.id ?? o._id ?? undefined, text: o.text || "", value: o.value ?? null, isKey: !!o.isKey }))
  )

  const [newOptText, setNewOptText] = useState("")
  const [newOptValue, setNewOptValue] = useState<string | number>("")
  const [newOptIsKey, setNewOptIsKey] = useState(false)

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
        order: order === "" ? null : Number(order),
        weight: weight === "" ? null : Number(weight),
        language,
        options: options.map((o) => ({ text: o.text, value: typeof o.value === 'number' ? o.value : undefined, isKey: typeof o.isKey === 'boolean' ? o.isKey : undefined })),
      }

  await updateAsync(payload)
      toast.success("Question mise à jour")
      // refresh to get latest data
      router.refresh()
      onSaved?.()
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
    language,
    options,
    newOptText,
    newOptValue,
    newOptIsKey,
    setText,
    setType,
    setCategory,
    setOrder,
    setWeight,
    setLanguage,
    setOptions,
    setNewOptText,
    setNewOptValue,
    setNewOptIsKey,
    addOption,
    updateOption,
    removeOption
  }
}
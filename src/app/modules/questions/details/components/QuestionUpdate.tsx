"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus } from "lucide-react";
import { useUpdateQuestion } from "../hooks/useUpdateQuestion";

type Props = {
  question: any;
  onSaved?: () => void;
};

const QuestionUpdate = ({ question, onSaved }: Props) => {
  const {
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
    removeOption,
  } = useUpdateQuestion(question, onSaved);

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div>
        <Label htmlFor={`q-text-${question.id}`} className="text-sm">
          Texte
        </Label>
        <Input
          id={`q-text-${question.id}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-sm">Type</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md border px-2 py-1"
          >
            <option value="SINGLE_CHOICE">SINGLE_CHOICE</option>
            <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
            <option value="TEXT">TEXT</option>
            <option value="NUMERIC">NUMERIC</option>
          </select>
        </div>

        <div>
          <Label className="text-sm">Catégorie</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border px-2 py-1"
          >
            <option value="POSITION">Position</option>
            <option value="PERMISSION">Permission</option>
            <option value="PRODUCTION">Production</option>
            <option value="DEVELOPMENT_OF_OTHERS">Développement des autres</option>
            <option value="SUMMIT">Sommet</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-sm">Ordre</Label>
          <Input
            type="number"
            value={order === "" ? "" : order}
            onChange={(e) => {
              const val = e.target.value;
              setOrder(val === "" ? "" : Number(val));
            }}
          />
        </div>
        <div>
          <Label className="text-sm">Poids</Label>
          <Input
            type="number"
            value={weight === "" ? "" : weight}
            onChange={(e) => {
              const val = e.target.value;
              setWeight(val === "" ? "" : Number(val));
            }}
          />
        </div>
      </div>

      {(type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE") && (
        <div className="space-y-3">
          <Separator />
          <div className="space-y-2">
            <Label className="text-sm">Options</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder="Texte de l'option"
                value={newOptText}
                onChange={(e) => setNewOptText(e.target.value)}
              />
              <Input
                placeholder="Valeur (optionnel)"
                value={String(newOptValue)}
                onChange={(e) => setNewOptValue(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newOptIsKey}
                    onChange={(e) => setNewOptIsKey(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-yellow-500"
                  />
                  <span>Bonne réponse</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  disabled={!newOptText.trim()}
                  className="ml-auto flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Ajouter
                </Button>
              </div>
            </div>

            {options.length > 0 && (
              <div className="space-y-2">
                {options.map((o, idx) => (
                  <Card
                    key={o.id ?? idx}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    <CardContent className="p-3">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                          <Input
                            value={o.text}
                            onChange={(e) =>
                              updateOption(idx, { text: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            value={o.value ?? ""}
                            onChange={(e) =>
                              updateOption(idx, {
                                value:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="col-span-2 flex items-center">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!o.isKey}
                              onChange={(e) =>
                                updateOption(idx, { isKey: e.target.checked })
                              }
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Correcte</span>
                          </label>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={() => removeOption(idx)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 justify-end">
        <Button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={handleDelete}
        >
          Supprimer
        </Button>
        <Button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default QuestionUpdate;

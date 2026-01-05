"use client";
import { useState, ChangeEvent, useEffect } from 'react';
import { MadaInput, MadaLabel } from '@/app/lib/components';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Plus, X, CheckCircle2, Type } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MadaButton } from '@/app/lib/components';

type Props = {
  onCreate: (q: any) => void;
};

const QuestionForm = ({ onCreate }: Props) => {
  const [text, setText] = useState('');
  const [type, setType] = useState('SINGLE_CHOICE');
  const [category, setCategory] = useState('PRODUCTION');
  const [subcategory, setSubcategory] = useState<string | undefined>(undefined);
  const [developOthers, setDevelopOthers] = useState(false);
  const [options, setOptions] = useState<{ text: string; value?: number; isKey?: boolean; id?: string }[]>([]);
  const [optText, setOptText] = useState('');
  const [optValue, setOptValue] = useState('');
  const [isKey, setIsKey] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [optionCounter, setOptionCounter] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addOption = () => {
    if (!optText.trim()) return;
    const newId = `opt-${optionCounter}`;
    setOptionCounter(prev => prev + 1);
    setOptions((prev) => [...prev, { 
      text: optText, 
      value: optValue ? Number(optValue) : undefined,
      isKey: isKey,
      id: newId
    }]);
    setOptText('');
    setOptValue('');
    setIsKey(false);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!text.trim()) return;
    onCreate({ 
      text, 
      type, 
      category, 
      subcategory: category === 'PINNACLE' ? subcategory : undefined, 
      developOthers,
      options 
    });
    setText('');
    setCategory('PRODUCTION');
    setSubcategory(undefined);
    setDevelopOthers(false);
    setOptions([]);
    setOptText('');
    setOptValue('');
    setIsKey(false);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <MadaLabel htmlFor="question-text" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Texte de la question
        </MadaLabel>
        <MadaInput
          id="question-text"
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          placeholder="Ex: Quelle est votre expérience avec cette technologie ?"
          required
        />
      </div>

      <div className="space-y-2">
        <MadaLabel htmlFor="question-type" className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          Type de question
        </MadaLabel>
        {mounted ? (
          <Select value={type} onValueChange={(val) => setType(String(val))}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE_CHOICE">Choix simple</SelectItem>
              <SelectItem value="MULTIPLE_CHOICE">Choix multiple</SelectItem>
              <SelectItem value="TEXT">Texte libre</SelectItem>
              <SelectItem value="SCALE">Échelle</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 flex items-center text-sm text-gray-500">
            Choix simple
          </div>
        )}
      </div>

      <div className="space-y-2">
        <MadaLabel htmlFor="question-category" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Catégorie de question
        </MadaLabel>
        {mounted ? (
          <Select value={category} onValueChange={(val) => { setCategory(String(val)); if (val !== 'PINNACLE') setSubcategory(undefined); }}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionner la catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POSITION">Position (Compétences individuelles)</SelectItem>
              <SelectItem value="PERMISSION">Permission (Autorisations & accès)</SelectItem>
              <SelectItem value="PRODUCTION">Production (Performance & résultats)</SelectItem>
              <SelectItem value="PINNACLE">Pinnacle (Vision stratégique)</SelectItem>
              <SelectItem value="AUTRE">Autre (Hors catégories)</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 flex items-center text-sm text-gray-500">
            Production
          </div>
        )}
      </div>

      {category === 'PINNACLE' && (
        <div className="space-y-2">
          <MadaLabel htmlFor="question-subcategory" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Sous-catégorie Pinnacle
          </MadaLabel>
          {mounted ? (
            <Select value={subcategory || ''} onValueChange={(val) => setSubcategory(val)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sélectionner la sous-catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOI">Pinnacle-Soi</SelectItem>
                <SelectItem value="AUTRES">Pinnacle-Autres</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 flex items-center text-sm text-gray-500">
              Sélectionner la sous-catégorie
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={developOthers}
              onChange={(e) => setDevelopOthers(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            />
            <span>Développement des autres</span>
          </label>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cochez cette case si cette question évalue le développement des autres leaders
        </p>
      </div>

      {(type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') && (
        <div className="space-y-4">
          <div className="space-y-2">
            <MadaLabel className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Options de réponse
            </MadaLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <MadaInput
                value={optText}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOptText(e.target.value)}
                placeholder="Texte de l'option"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOption();
                  }
                }}
              />
              <MadaInput
                type="number"
                value={optValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setOptValue(e.target.value)}
                placeholder="Valeur (optionnel)"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isKey}
                  onChange={(e) => setIsKey(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                />
                <span>Marquer comme réponse correcte</span>
              </label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addOption}
                disabled={!optText.trim()}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>
          </div>

          {options.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Options ajoutées ({options.length}):
              </p>
              <div className="space-y-2">
                {options.map((o, idx) => (
                  <Card key={o.id || `option-${idx}`} className="border-gray-200 dark:border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{o.text}</span>
                          {o.value !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              Valeur: {o.value}
                            </Badge>
                          )}
                          {o.isKey && (
                            <Badge className="text-xs bg-green-500 text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Correcte
                            </Badge>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 p-0"
                          onClick={() => removeOption(idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      <div className="flex justify-end">
        <MadaButton
          type="button"
          onClick={handleCreate}
          className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          disabled={!text.trim() || (type !== 'TEXT' && type !== 'SCALE' && options.length === 0)}
        >
          <Plus className="w-4 h-4" />
          Ajouter la question
        </MadaButton>
      </div>
    </div>
  );
};

export default QuestionForm;

"use client";
import { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

type Props = {
  onCreate: (q: any) => void;
};

const QuestionForm = ({ onCreate }: Props) => {
  const [text, setText] = useState('');
  const [type, setType] = useState('SINGLE_CHOICE');
  const [options, setOptions] = useState<{ text: string; value?: number; isKey?: boolean }[]>([]);
  const [optText, setOptText] = useState('');

  const addOption = () => {
    if (!optText) return;
    setOptions((prev) => [...prev, { text: optText }]);
    setOptText('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ text, type, options });
    setText('');
    setOptions([]);
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div>
        <Label className="mb-2">Question</Label>
        <Input value={text} onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)} placeholder="Texte de la question" />
      </div>

      <div>
        <Label className="mb-2">Type</Label>
        <Select value={type} onValueChange={(val) => setType(String(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SINGLE_CHOICE">Choix simple</SelectItem>
            <SelectItem value="MULTIPLE_CHOICE">Choix multiple</SelectItem>
            <SelectItem value="TEXT">Texte</SelectItem>
            <SelectItem value="SCALE">Échelle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') && (
        <div>
          <Label className="mb-2">Options</Label>
          <div className="flex gap-2 mt-1">
            <Input value={optText} onChange={(e: ChangeEvent<HTMLInputElement>) => setOptText(e.target.value)} placeholder="Texte de l'option" />
            <Button type="button" variant="outline" onClick={addOption}>Ajouter</Button>
          </div>

          <ul className="mt-2 list-disc pl-5">
            {options.map((o, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{o.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit">Ajouter la question</Button>
      </div>
    </form>
  );
};

export default QuestionForm;

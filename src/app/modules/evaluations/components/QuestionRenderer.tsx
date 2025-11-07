"use client";
import { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Option = { id: number; text: string };

type Question = {
  id: number;
  text: string;
  type: string;
  options?: Option[];
};

type Props = {
  question: Question;
  value: any;
  onChange: (questionId: number, value: any) => void;
};

export default function QuestionRenderer({ question, value, onChange }: Props) {
  const qType = question.type;

  if (qType === 'TEXT') {
    return (
      <div>
        <Label className="mb-2">{question.text}</Label>
        <textarea className="w-full rounded-md border px-3 py-2" value={value || ''} onChange={(e) => onChange(question.id, e.target.value)} />
      </div>
    );
  }

  if (qType === 'SCALE') {
    const numeric = typeof value === 'number' ? value : 0;
    return (
      <div>
        <Label className="mb-2">{question.text}</Label>
        <div className="flex items-center gap-2">
          <input type="range" min={0} max={10} value={numeric} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(question.id, Number(e.target.value))} />
          <span>{numeric}</span>
        </div>
      </div>
    );
  }

  if (qType === 'MULTIPLE_CHOICE') {
    const selected: number[] = Array.isArray(value) ? value : [];
    const toggle = (optId: number) => {
      if (selected.includes(optId)) onChange(question.id, selected.filter((s) => s !== optId));
      else onChange(question.id, [...selected, optId]);
    };

    return (
      <div>
        <Label className="mb-2">{question.text}</Label>
        <div className="flex flex-col gap-2">
          {(question.options || []).map((opt) => (
            <label key={opt.id} className="flex items-center gap-2">
              <input type="checkbox" checked={selected.includes(opt.id)} onChange={() => toggle(opt.id)} />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // SINGLE_CHOICE default
  const selected = typeof value === 'number' ? value : null;
  return (
    <div>
      <Label className="mb-2">{question.text}</Label>
      <div className="flex flex-col gap-2">
        {(question.options || []).map((opt) => (
          <label key={opt.id} className="flex items-center gap-2">
            <input type="radio" name={`q-${question.id}`} checked={selected === opt.id} onChange={() => onChange(question.id, opt.id)} />
            <span>{opt.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

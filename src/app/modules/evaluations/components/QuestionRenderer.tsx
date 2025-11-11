"use client";
import { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

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
      <Card className="border-l-4 border-l-yellow-500 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
              {question.text}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <textarea
                className="w-full min-h-[120px] rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-vertical"
                value={value || ''}
                onChange={(e) => onChange(question.id, e.target.value)}
                placeholder="Tapez votre réponse ici..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (qType === 'SCALE') {
    const numeric = typeof value === 'number' ? value : 0;
    return (
      <Card className="border-l-4 border-l-blue-500 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
              {question.text}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4 w-full max-w-md">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">0</span>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={numeric}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(question.id, Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">10</span>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 text-white text-2xl font-bold rounded-full">
                    {numeric}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {numeric === 0 && "Pas du tout d'accord"}
                    {numeric === 1 && "Pas d'accord"}
                    {numeric === 2 && "Plutôt pas d'accord"}
                    {numeric === 3 && "Neutre"}
                    {numeric === 4 && "Plutôt d'accord"}
                    {numeric === 5 && "D'accord"}
                    {numeric === 6 && "Tout à fait d'accord"}
                    {numeric === 7 && "Fortement d'accord"}
                    {numeric === 8 && "Complètement d'accord"}
                    {numeric === 9 && "Totalement d'accord"}
                    {numeric === 10 && "Absolument d'accord"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (qType === 'MULTIPLE_CHOICE') {
    const selected: number[] = Array.isArray(value) ? value : [];
    const toggle = (optId: number) => {
      if (selected.includes(optId)) onChange(question.id, selected.filter((s) => s !== optId));
      else onChange(question.id, [...selected, optId]);
    };

    return (
      <Card className="border-l-4 border-l-green-500 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
              {question.text}
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="space-y-3">
                {(question.options || []).map((opt) => (
                  <label key={opt.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selected.includes(opt.id)}
                      onChange={() => toggle(opt.id)}
                      className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // SINGLE_CHOICE default
  const selected = typeof value === 'number' ? value : null;
  return (
    <Card className="border-l-4 border-l-yellow-500 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
            {question.text}
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="space-y-3">
              {(question.options || []).map((opt) => (
                <label key={opt.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    checked={selected === opt.id}
                    onChange={() => onChange(question.id, opt.id)}
                    className="w-5 h-5 text-yellow-600 bg-gray-100 border-gray-300 focus:ring-yellow-500 focus:ring-2"
                  />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

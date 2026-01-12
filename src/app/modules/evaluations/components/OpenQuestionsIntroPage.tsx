"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ChevronRight } from "lucide-react";

type Props = {
  candidateName?: string;
  onContinue: () => void;
};

export default function OpenQuestionsIntroPage({ candidateName, onContinue }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-3xl w-full shadow-2xl">
        <CardContent className="p-8 space-y-6">
          {/* Timer Section */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Clock className="w-12 h-12 text-yellow-500" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                30:00
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Timer de 30 minutes</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Les questions ouvertes suivantes complètent l'évaluation du leadership MADABEL.
            </p>

            <p className="text-base leading-relaxed">
              Chaque question a une limite de 2000 caractères et vous avez 30 minutes pour compléter cette
              partie de l'évaluation. Vos commentaires seront précieux pour aider{" "}
              <span className="font-semibold bg-yellow-200 dark:bg-yellow-900 px-1">
                {candidateName || "Nom du Candidat"}
              </span>{" "}
              dans son parcours de leader.
            </p>

            <p className="text-base leading-relaxed">
              Pour que vos évaluations et commentaires soient reçus par MADABEL, vous devez cliquer sur{" "}
              <span className="font-semibold">SOUMETTRE l'ÉVALUATION</span>. Si vous ne souhaitez pas inclure
              de commentaires écrits, laissez les zones de texte vides et cliquez sur{" "}
              <span className="font-semibold">SOUMETTRE l'ÉVALUATION</span>.
            </p>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={onContinue}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-6 text-lg"
              size="lg"
            >
              CONTINUER
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

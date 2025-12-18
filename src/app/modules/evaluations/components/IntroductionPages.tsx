"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface IntroductionPagesProps {
  candidateName: string;
  onComplete: () => void;
}

export default function IntroductionPages({
  candidateName,
  onComplete,
}: IntroductionPagesProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader className="text-center border-b pb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/Logo-couleurs-Madabel.webp"
              alt="Madabel Logo"
              width={200}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ÉVALUATION DU LEADERSHIP MADABEL
          </h1>
        </CardHeader>

        <CardContent className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <p className="text-base text-gray-700 dark:text-gray-300">
                Cette évaluation prendra environ 10 minutes à compléter.
              </p>
              
              <p className="text-base text-gray-700 dark:text-gray-300">
                Aujourd'hui, on vous a demandé d'évaluer{" "}
                <span className="font-semibold bg-yellow-200 dark:bg-yellow-900 px-1">
                  {candidateName}
                </span>
                .
              </p>

              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Cette enquête est conçue pour fournir une évaluation des comportements de cette personne dans
                son rôle de leader et lorsqu'elle entre en relation avec les autres. Nous vous demandons de
                répondre aux questions suivantes de la manière la plus précise possible. Vos réponses seront
                soumises de manière anonyme et seront combinées aux scores des autres évaluateurs à des fins
                de rapport.
              </p>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Merci pour votre temps.
              </p>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Veuillez cliquer sur &lt; CONTINUER &gt;
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Note :
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Si vous êtes le seul responsable direct de ce leader, vos scores seront indiqués séparément
                  ; cependant, vos commentaires ouverts seront anonymement combinés avec tous les autres.
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                (Bouton CONTINUER qui envoi vers la page suivante).
              </p>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Vous allez évaluer{" "}
                <span className="font-semibold bg-yellow-200 dark:bg-yellow-900 px-1">
                  {candidateName}
                </span>{" "}
                sur différents comportements en choisissant un chiffre de 1 à 7 pour représenter dans quelle
                mesure vous êtes d'accord que cette personne respecte chaque comportement en particulier.
              </p>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Exemple :
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-xs text-gray-700 dark:text-gray-300">
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal"></th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          Non<br />observée
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          Très<br />fortement<br />en<br />désaccord
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          Pas du<br />tout<br />d'accord
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          Pas<br />d'accord
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          Ni<br />d'accord<br />ni en<br />désaccord
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          D'accord
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          Tout à<br />fait<br />d'accord
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 font-normal">
                          Tout à<br />fait<br />d'accord
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 font-semibold">
                          Est un bon modèle
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          0
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          1
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          2
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          3
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          4
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          5
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          6
                        </td>
                        <td className="p-3 border border-gray-300 dark:border-gray-600 text-center font-bold text-lg">
                          7
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Il s'agit uniquement d'un exemple - vous n'avez pas besoin de choisir une réponse sur cette page.
              </p>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Au lieu de cela, notez simplement l'échelle de notation ci-dessus qui va de 1 au 7 :
              </p>

              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-semibold">1</span> = Très fortement en désaccord avec cette affirmation,
                  c'est-à-dire que cette personne N'EST PAS "un bon modèle".
                </p>
                <p>
                  <span className="font-semibold">7</span> = Très fortement d'accord avec cette affirmation,
                  c'est-à-dire que cette personne EST "un bon modèle".
                </p>
              </div>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Ensuite cliquez sur CONTINUER pour passer à la première page de notation.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                (Bouton CONTINUER qui envoi vers la page suivante).
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Dans l'évaluation du leadership MADABEL, selon le modèle Maxwell, vous allez considérer votre
                interaction/expérience typique avec cette personne dans son rôle de leader.
              </p>

              <p className="text-base text-gray-700 dark:text-gray-300">
                Si vous n'avez pas observé un élément particulier de l'évaluation :
              </p>

              <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 dark:text-gray-300">
                <li>
                  Tout d'abord, demandez-vous si vous pouvez prédire sa réaction probable en fonction de
                  vos interactions avec lui dans des circonstances similaires.
                </li>
                <li>
                  Essayez d'éviter d'utiliser le choix{" "}
                  <span className="font-semibold italic">"Non observé"</span>.
                </li>
              </ul>

              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Si vous avez des contacts réguliers avec ce leader nous vous invitons d'éviter, tant que possible,
                la mention{" "}
                <span className="font-semibold italic">"Non observé"</span> car le but est de pouvoir
                lui donner le meilleur retour.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                (Bouton CONTINUER qui envoi vers la page suivante).
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
            >
              CONTINUER
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

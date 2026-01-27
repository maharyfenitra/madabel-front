"use client";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const candidateName = searchParams.get("candidateName") || "le candidat";
  const isCandidate = searchParams.get("isCandidate") === "true";
  const evaluationId = searchParams.get("evaluationId");

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader className="text-center border-b pb-6">
          <div className="flex justify-center mb-4">
            <Image 
              src="/Logo-couleurs-Madabel.webp" 
              alt="Logo Madabel" 
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
          <div className="space-y-6">
            {/* Icône de succès */}
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>

            {isCandidate ? (
              /* Message pour l'auto-évaluation (avec les deux paragraphes) */
              <>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Les résultats sont compilés pour montrer les notes globales des évaluateurs dans les catégories suivantes : Collaborateurs Directs, Manager / Supérieur Hiérarchique, Pairs et Autres, ainsi que les résultats de votre auto-évaluation.
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                  Félicitations !
                </h2>
                
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Vous avez terminé l'étape 2 de l'évaluation du leadership MADABEL. Veuillez maintenant laisser 
                  à vos évaluateurs (que vous avez désignés à l'étape 1) suffisamment de temps - habituellement 
                  une semaine - pour compléter leur évaluation de votre leadership.
                </p>

                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Vous reviendrez à cette page en utilisant l'étape 3 de vos instructions reçues par courriel 
                  pour voir et imprimer votre rapport APRÈS que vos évaluateurs aient terminé votre évaluation.
                </p>
              </>
            ) : (
              /* Message standard pour les évaluateurs */
              <>
                <p className="text-base text-gray-700 dark:text-gray-300 text-center">
                  Merci d'avoir rempli l'évaluation 360 degré MADABEL pour{" "}
                  <span className="font-semibold bg-yellow-200 dark:bg-yellow-900 px-1">
                    {candidateName}
                  </span>.
                </p>

                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Les résultats sont compilés pour montrer les notes globales des évaluateurs dans les catégories suivantes : Collaborateurs Directs, Manager / Supérieur Hiérarchique, Pairs et Autres, ainsi que les résultats de l'auto-évaluation de{" "}
                  <span className="font-semibold bg-yellow-200 dark:bg-yellow-900 px-1">
                    {candidateName}
                  </span>.
                </p>
              </>
            )}

            {/* Bouton de retour */}
            <div className="flex justify-center pt-4">
              <Link href="/modules/evaluations">
                <Button 
                  variant="outline"
                  className="font-semibold"
                >
                  Retour aux évaluations
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/app/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Bell, Loader2, AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { URL_CONFIG } from "@/app/lib/api/configServer";
import { useAccessToken } from "@/app/lib/api/useAccessToken";
import { useFetch } from "@/app/lib/api/useFetch";

type SystemConfig = {
  id: number;
  reminderFrequency: string;
  reminderEnabled: boolean;
  lastReminderCheck: string | null;
  createdAt: string;
  updatedAt: string;
};

const FREQUENCY_LABELS: Record<string, string> = {
  HOURLY_1: "Toutes les heures",
  HOURLY_2: "Toutes les 2 heures",
  DAILY_1: "Tous les jours",
  DAILY_3: "Tous les 3 jours",
  WEEKLY_1: "Toutes les semaines",
};

export default function ConfigPage() {
  const { getUser } = useCurrentUser();
  const { getAccessToken } = useAccessToken();
  const sendRequest = useFetch();
  const user = getUser();

  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState("DAILY_1");

  // Vérifier si l'utilisateur est admin
  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Accès refusé
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Cette page est réservée aux administrateurs.
        </p>
      </div>
    );
  }

  // Charger la configuration
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const token = getAccessToken();
      
      if (!token) {
        toast.error("Vous devez être connecté");
        return;
      }

      const response = await sendRequest(
        "GET",
        `${URL_CONFIG.uri}/config`,
        {},
        {
          Authorization: `Token ${token}`,
        }
      );

      if (response?.data) {
        setConfig(response.data);
        setReminderEnabled(response.data.reminderEnabled);
        setReminderFrequency(response.data.reminderFrequency);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement de la configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = getAccessToken();

      if (!token) {
        toast.error("Vous devez être connecté");
        return;
      }

      const response = await sendRequest(
        "PUT",
        `${URL_CONFIG.uri}/config`,
        {
          reminderEnabled,
          reminderFrequency,
        },
        {
          Authorization: `Token ${token}`,
        }
      );

      if (response?.data?.config) {
        setConfig(response.data.config);
        toast.success("Configuration mise à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la sauvegarde de la configuration");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Settings className="w-8 h-8 text-yellow-500" />
            Configuration Système
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les paramètres de relance automatique des évaluations
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              Relances Automatiques
            </CardTitle>
            <CardDescription>
              Configurez l'envoi automatique de rappels aux évaluateurs qui n'ont pas complété leur évaluation
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Activation des relances */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <Label htmlFor="reminder-enabled" className="text-base font-medium">
                  Activer les relances automatiques
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Les participants recevront des emails de rappel automatiquement
                </p>
              </div>
              <Switch
                id="reminder-enabled"
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
            </div>

            {/* Fréquence des relances */}
            <div className="space-y-3">
              <Label htmlFor="reminder-frequency" className="text-base font-medium">
                Fréquence des relances
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choisissez à quelle fréquence les emails de rappel seront envoyés
              </p>
              <Select
                value={reminderFrequency}
                onValueChange={setReminderFrequency}
                disabled={!reminderEnabled}
              >
                <SelectTrigger id="reminder-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Info dernière vérification */}
            {config?.lastReminderCheck && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Dernière vérification :</strong>{" "}
                  {new Date(config.lastReminderCheck).toLocaleString("fr-FR")}
                </p>
              </div>
            )}

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information supplémentaire */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Comment ça fonctionne ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              • Le système vérifie périodiquement les participants qui n'ont pas complété leur évaluation
            </p>
            <p>
              • Un email de rappel est envoyé automatiquement selon la fréquence configurée
            </p>
            <p>
              • Les rappels sont envoyés uniquement pour les évaluations dont la deadline n'est pas encore passée
            </p>
            <p>
              • Seuls les évaluateurs (non les candidats) reçoivent ces rappels
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

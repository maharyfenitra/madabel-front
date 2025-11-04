"use client";

import { MadaButton, MadaInput, MadaLabel } from "@/app/lib/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAddParticipantDialog } from "../hooks/useAddParticipantDialog";
import { Users, User, Mail, Phone, Briefcase, UserCircle, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AddParticipantDialog = ({
  evaluationId,
}: {
  evaluationId: number;
}) => {
  const { newUser, handleChange, handleSubmit } =
    useAddParticipantDialog(evaluationId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MadaButton className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un participant
        </MadaButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-yellow-500" />
            Ajouter un participant
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Ajoutez un candidat ou un évaluateur à cette évaluation
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nom */}
            <div className="space-y-2">
              <MadaLabel htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom complet
              </MadaLabel>
              <MadaInput
                type="text"
                id="name"
                name="name"
                placeholder="Jean Dupont"
                value={newUser.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <MadaLabel htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </MadaLabel>
              <MadaInput
                type="email"
                id="email"
                name="email"
                placeholder="jean@example.com"
                value={newUser.email}
                onChange={handleChange}
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <MadaLabel htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </MadaLabel>
              <MadaInput
                type="text"
                id="phone"
                name="phone"
                placeholder="+261 34 12 345 67"
                value={newUser.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Post */}
            <div className="space-y-2">
              <MadaLabel htmlFor="post" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Poste
              </MadaLabel>
              <MadaInput
                type="text"
                id="post"
                name="post"
                placeholder="Ex: Développeur"
                value={newUser?.post || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Rôle */}
            <div className="space-y-2 md:col-span-2">
              <MadaLabel htmlFor="role" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Rôle
              </MadaLabel>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleChange}
                className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-500 bg-white dark:bg-gray-800 transition-all duration-200 px-3 py-2"
              >
                <option value="EVALUATOR">ÉVALUATEUR</option>
                <option value="CANDIDAT">CANDIDAT</option>
              </select>
            </div>

            {/* Champs supplémentaires si EVALUATEUR */}
            {newUser.role === "EVALUATOR" && (
              <div className="space-y-2 md:col-span-2">
                <MadaLabel htmlFor="evaluatorType" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Type d'évaluateur
                </MadaLabel>
                <select
                  id="evaluatorType"
                  name="evaluatorType"
                  value={newUser.evaluatorType || ""}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-yellow-500 dark:focus:border-yellow-500 bg-white dark:bg-gray-800 transition-all duration-200 px-3 py-2"
                  required
                >
                  <option value="">Sélectionnez le type d'évaluateur</option>
                  <option value="DIRECT_MANAGER">Manager Direct</option>
                  <option value="DIRECT_COLLEAGUE">Collaborateur Direct</option>
                  <option value="PEER">Pair/Associé</option>
                  <option value="OTHER">
                    Autres (client/fournisseur/famille/amis/etc.)
                  </option>
                </select>
              </div>
            )}
          </div>

          <Separator />

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <MadaButton 
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </MadaButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

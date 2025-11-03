import { MadaButton } from "@/app/lib/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAddParticipantDialog } from "../hooks/useAddParticipantDialog";

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
        <MadaButton className="bg-yellow-500 text-black">
          Ajouter participant
        </MadaButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un participant</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="text"
              name="phone"
              value={newUser.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Post */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Post
            </label>
            <input
              type="text"
              name="post"
              value={newUser?.post}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white"
            >
              <option value="EVALUATOR">EVALUATEUR</option>
              <option value="CANDIDAT">CANDIDAT</option>
            </select>
          </div>

          {/* Champs supplémentaires si EVALUATEUR */}
          {newUser.role === "EVALUATOR" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type d’évaluateur
              </label>
              <select
                name="evaluatorType"
                value={newUser.evaluatorType || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 bg-white"
                required
              >
                <option value="">Sélectionnez le type d’évaluateur</option>
                <option value="DIRECT_MANAGER">Manager Direct</option>
                <option value="DIRECT_COLLEAGUE">Collaborateur Direct</option>
                <option value="PEER">Pair/Associé</option>
                <option value="OTHER">
                  Autres (client/fournisseur/famille/amis/etc.)
                </option>
              </select>
            </div>
          )}

          <DialogFooter className="flex justify-end space-x-2">
            <MadaButton type="submit">Enregistrer</MadaButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

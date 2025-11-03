"use client";

import { AddParticipantDialog } from "./AddParticipantDialog";
import { useParams } from "next/navigation";
import { useParticipantList } from "../hooks/useParticipantList";
import { MoreActions } from "@/app/lib/components";
import { useGenericMutation } from "@/app/lib/api";
import { toast } from "sonner";

export const ParticipantList = () => {
  const params = useParams();

  const { participantEvaluators, refetchEvaluators } = useParticipantList(
    Number(params?.id!)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Liste des participants</h1>

        <AddParticipantDialog evaluationId={Number(params?.id!)} />
      </div>

      {/* Tableau des utilisateurs */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Nom
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Téléphone
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Rôle
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {participantEvaluators?.map((participant: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{participant.user.name}</td>
                <td className="px-4 py-2">{participant.user.email || "—"}</td>
                <td className="px-4 py-2">{participant.user.phone}</td>
                <td className="px-4 py-2">
                  <span className={`font-medium text-yellow-600`}>
                    {participant.user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <ParticipantAction
                    id={participant?.id}
                    callBack={refetchEvaluators}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ParticipantAction = ({
  id,
  callBack,
}: {
  id: number;
  callBack: () => void;
}) => {
  const { mutateAsync } = useGenericMutation(
    `/evaluations/delete/participant/${id}`, "DELETE"
  );

  const handleDelete = async () => {
    try {
      await mutateAsync({});
      callBack();
      toast.success("Participant enlevé", {
        description: `Participant effacé de la liste`,
      });
    } catch (errer) {
      toast.error("Erreur de supprission", {
        description: `Il y a erreur lors de la suppression du participant`,
      });
    }
  };
  return (
    <MoreActions
      items={[
        {
          label: "EFFACER",
          onClick: handleDelete,
        },
      ]}
    />
  );
};

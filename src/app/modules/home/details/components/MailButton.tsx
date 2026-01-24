import { Button } from "@/components/ui/button";
import { useServerConfig } from "@/app/lib/api/configServer";
import { toast } from "sonner";
import { Users, Mail, Phone, Trash2, Loader2, AlertCircle, User as UserIcon, Send } from "lucide-react";
import { useAccessToken } from "@/app/lib/api";
import { useFetch } from "@/app/lib/api/useFetch";

import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

export const MailButton = ({
  participant,
  refetchParticipants,
  sendingParticipants,
  setSendingParticipants,
  hasCandidate = true
}: {
  participant: any;
  refetchParticipants: () => any;
  sendingParticipants: Set<number>;
  setSendingParticipants: Dispatch<SetStateAction<Set<number>>>;
  hasCandidate?: boolean;
}) => {

     const { getAccessToken } = useAccessToken();
      const sendRequest = useFetch();
      const { uri } = useServerConfig();

     const isDisabled = sendingParticipants.has(participant.id) || !hasCandidate;

    return <div className="flex gap-2 justify-end">
                          {!participant.mailSentAt && (
                            <Button
                              className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                              size="sm"
                              disabled={isDisabled}
                              title={!hasCandidate ? "Ajoutez d'abord un candidat à l'évaluation" : "Envoyer l'invitation"}
                              onClick={async () => {
                                setSendingParticipants(prev => new Set(prev).add(participant.id));
                                try {
                                  const accessToken = getAccessToken();
                                  const res = await sendRequest(
                                    "POST",
                                    `${uri}/evaluations/participant/${participant.id}/send-mail`,
                                    {},
                                    {
                                      ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
                                    }
                                  );

                                  if (res?.data) {
                                    toast.success("Mail envoyé avec succès");
                                    refetchParticipants(); // Rafraîchir pour voir la date mise à jour
                                  } else {
                                    toast.success("Demande d'envoi envoyée");
                                  }
                                } catch (error: any) {
                                  console.error("Erreur envoi mail:", error);
                                  toast.error("Impossible d'envoyer le mail", { description: error?.message || String(error) });
                                } finally {
                                  setSendingParticipants(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(participant.id);
                                    return newSet;
                                  });
                                }
                              }}
                            >
                              {sendingParticipants.has(participant.id) ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4 mr-1" />
                              )}
                              Invitation
                            </Button>
                          )}
                          {participant.mailSentAt && (
                            <Button
                              className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                              size="sm"
                              disabled={isDisabled}
                              title={!hasCandidate ? "Ajoutez d'abord un candidat à l'évaluation" : "Envoyer une relance"}
                              onClick={async () => {
                                setSendingParticipants(prev => new Set(prev).add(participant.id));
                                try {
                                  const accessToken = getAccessToken();
                                  const res = await sendRequest(
                                    "POST",
                                    `${uri}/evaluations/participant/${participant.id}/send-reminder`,
                                    {},
                                    {
                                      ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
                                    }
                                  );

                                  if (res?.data) {
                                    toast.success("Relance envoyée avec succès");
                                    refetchParticipants(); // Rafraîchir pour voir la date mise à jour
                                  } else {
                                    toast.success("Demande de relance envoyée");
                                  }
                                } catch (error: any) {
                                  console.error("Erreur envoi relance:", error);
                                  toast.error("Impossible d'envoyer la relance", { description: error?.message || String(error) });
                                } finally {
                                  setSendingParticipants(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(participant.id);
                                    return newSet;
                                  });
                                }
                              }}
                            >
                              {sendingParticipants.has(participant.id) ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4 mr-1" />
                              )}
                              Relance
                            </Button>
                          )}
                        </div>
}
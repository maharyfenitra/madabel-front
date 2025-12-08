/**
 * Toast notification helpers
 */

import { toast } from "sonner";

export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show success toast
 */
export function showSuccess(message: string, options?: ToastOptions) {
  toast.success(message, options);
}

/**
 * Show error toast
 */
export function showError(message: string, options?: ToastOptions) {
  toast.error(message, options);
}

/**
 * Show info toast
 */
export function showInfo(message: string, options?: ToastOptions) {
  toast.info(message, options);
}

/**
 * Show warning toast
 */
export function showWarning(message: string, options?: ToastOptions) {
  toast.warning(message, options);
}

/**
 * Show loading toast and return dismiss function
 */
export function showLoading(message: string = "Chargement...") {
  return toast.loading(message);
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Handle API error and show appropriate toast
 */
export function handleApiError(error: any, defaultMessage: string = "Une erreur est survenue") {
  console.error("API Error:", error);
  
  const message = error?.response?.data?.error || 
                  error?.message || 
                  defaultMessage;
  
  const description = error?.response?.data?.details || 
                     error?.response?.statusText;

  showError(message, description ? { description } : undefined);
}

/**
 * Show success toast for common operations
 */
export const successToasts = {
  created: (item: string) => showSuccess(`${item} créé avec succès`),
  updated: (item: string) => showSuccess(`${item} mis à jour avec succès`),
  deleted: (item: string) => showSuccess(`${item} supprimé avec succès`),
  saved: () => showSuccess("Enregistré avec succès"),
  sent: () => showSuccess("Envoyé avec succès"),
  completed: () => showSuccess("Opération terminée avec succès"),
};

/**
 * Show error toast for common operations
 */
export const errorToasts = {
  create: (item: string) => showError(`Impossible de créer ${item}`),
  update: (item: string) => showError(`Impossible de mettre à jour ${item}`),
  delete: (item: string) => showError(`Impossible de supprimer ${item}`),
  save: () => showError("Erreur lors de l'enregistrement"),
  send: () => showError("Erreur lors de l'envoi"),
  load: () => showError("Erreur lors du chargement"),
  network: () => showError("Erreur réseau", { description: "Veuillez vérifier votre connexion" }),
};

/**
 * Reusable hook for delete operations with confirmation
 */

import { useState } from "react";
import { showSuccess, handleApiError } from "../utils";

export interface UseDeleteOptions<T> {
  onDelete: (id: number) => Promise<void>;
  onSuccess?: () => void;
  itemName?: string;
  successMessage?: string;
}

export function useDelete<T = any>({
  onDelete,
  onSuccess,
  itemName = "l'élément",
  successMessage,
}: UseDeleteOptions<T>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(itemToDelete);
      
      showSuccess(
        successMessage || `${itemName} supprimé avec succès`
      );
      
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      handleApiError(error, `Erreur lors de la suppression de ${itemName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return {
    isDeleting,
    deleteDialogOpen,
    itemToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete,
    setDeleteDialogOpen,
  };
}

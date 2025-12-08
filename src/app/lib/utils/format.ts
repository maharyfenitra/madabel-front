/**
 * Format helpers for displaying data
 */

/**
 * Format date to French locale
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "Non renseigné";
  
  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Date invalide";
  }
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "Non renseigné";
  
  try {
    return new Date(date).toLocaleString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Date invalide";
  }
}

/**
 * Format date to short format
 */
export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Format time only
 */
export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Format relative time (e.g., "il y a 2 jours")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "Non renseigné";
  
  try {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} minute${diffMin > 1 ? 's' : ''}`;
    if (diffHour < 24) return `Il y a ${diffHour} heure${diffHour > 1 ? 's' : ''}`;
    if (diffDay < 7) return `Il y a ${diffDay} jour${diffDay > 1 ? 's' : ''}`;
    if (diffDay < 30) {
      const weeks = Math.floor(diffDay / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
    if (diffDay < 365) {
      const months = Math.floor(diffDay / 30);
      return `Il y a ${months} mois`;
    }
    const years = Math.floor(diffDay / 365);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  } catch {
    return "Date invalide";
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with locale
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "Non renseigné";
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, "");
  
  // Format as French phone number (XX XX XX XX XX)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
  }
  
  return phone;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format role for display
 */
export function formatRole(role: string | null | undefined): string {
  if (!role) return "Non défini";
  
  const roleLabels: Record<string, string> = {
    ADMIN: "Administrateur",
    EVALUATOR: "Évaluateur",
    CANDIDAT: "Candidat",
  };
  
  return roleLabels[role] || role;
}

/**
 * Format evaluator type
 */
export function formatEvaluatorType(type: string | null | undefined): string {
  if (!type) return "—";

  const typeLabels: Record<string, string> = {
    DIRECT_MANAGER: "Manager Direct",
    DIRECT_COLLEAGUE: "Collaborateur Direct",
    PEER: "Pair/Associé",
    OTHER: "Autres",
  };

  return typeLabels[type] || type;
}

/**
 * Format progress for display
 */
export function formatProgress(completed: number, total: number): string {
  if (total === 0) return "0/0";
  return `${completed}/${total}`;
}

/**
 * Get initials from name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

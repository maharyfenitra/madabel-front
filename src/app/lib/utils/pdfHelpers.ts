/**
 * Formate un score numérique pour l'affichage dans le PDF
 */
export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) {
    return '0.0';
  }
  return score.toFixed(1);
}

/**
 * Charge une image et la convertit en data URL pour l'utilisation dans jsPDF
 */
export function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Obtient le libellé formaté d'une catégorie
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    PRODUCTION: 'Production',
    PERMISSION: 'Permission',
    PINNACLE: 'Pinnacle',
    POSITION: 'Position',
    DEVELOPPEMENT: 'Développement des autres',
  };
  return labels[category] || category;
}

/**
 * Obtient le libellé formaté d'un type d'évaluateur
 */
export function getEvaluatorTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    COLLABORATEUR_DIRECT: 'Collaborateurs directs',
    MANAGER_DIRECT: 'Manager direct',
    MANAGER_N_2: 'Manager N-2',
    COLLEGUE: 'Pairs',
    RH: 'Autres',
    CANDIDAT: 'Auto-évaluation',
  };
  return labels[type] || type;
}

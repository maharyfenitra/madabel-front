/**
 * Formate un score numérique pour l'affichage dans le PDF
 * @param score - Le score à formater (peut être null ou undefined)
 * @param decimals - Nombre de décimales (par défaut 1)
 * @returns Le score formaté ou '0.0' si invalide
 */
export function formatScore(score: number | null | undefined, decimals: number = 1): string {
  if (score === null || score === undefined || isNaN(score)) {
    return '0.0';
  }
  return Number(score).toFixed(decimals);
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

/**
 * Dessine du texte justifié (aligné à gauche et à droite)
 * @param pdf - Instance jsPDF
 * @param text - Texte à afficher
 * @param x - Position X de départ
 * @param y - Position Y de départ
 * @param maxWidth - Largeur maximale du texte
 * @param lineHeight - Hauteur de ligne (défaut 5)
 * @returns La position Y finale après le texte
 */
export function drawJustifiedText(
  pdf: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 5
): number {
  const lines = pdf.splitTextToSize(text, maxWidth);
  let currentY = y;

  lines.forEach((line: string, index: number) => {
    const isLastLine = index === lines.length - 1;
    
    if (isLastLine || line.trim() === '') {
      // Dernière ligne : alignement à gauche uniquement
      pdf.text(line, x, currentY);
    } else {
      // Justifier la ligne en distribuant l'espace entre les mots
      const words = line.split(' ');
      
      if (words.length === 1) {
        // Un seul mot : pas de justification
        pdf.text(line, x, currentY);
      } else {
        // Calculer la largeur totale des mots sans espaces
        const wordsWidth = words.reduce((total, word) => {
          return total + pdf.getTextWidth(word);
        }, 0);
        
        // Calculer l'espace à distribuer entre les mots
        const totalSpaceWidth = maxWidth - wordsWidth;
        const spaceWidth = totalSpaceWidth / (words.length - 1);
        
        // Dessiner chaque mot avec l'espacement calculé
        let currentX = x;
        words.forEach((word, wordIndex) => {
          pdf.text(word, currentX, currentY);
          currentX += pdf.getTextWidth(word) + spaceWidth;
        });
      }
    }
    
    currentY += lineHeight;
  });

  return currentY;
}

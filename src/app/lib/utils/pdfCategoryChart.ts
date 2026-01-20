import jsPDF from 'jspdf';
import { PDF_COLORS } from './pdfStyles';
import type { CategoryInfo } from './pdfTypes';

/**
 * Crée le titre "CATEGORY SCORES *" avec la couleur du module
 */
export function createScoresHeaderBox(
  pdf: jsPDF,
  categoryLabel: string,
  pageWidth: number,
  margin: number,
  yPosition: number,
  categoryInfo?: CategoryInfo
): number {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  
  // Utiliser la couleur du module si disponible, sinon noir
  if (categoryInfo && categoryInfo.color) {
    pdf.setTextColor(categoryInfo.color[0], categoryInfo.color[1], categoryInfo.color[2]);
  } else {
    pdf.setTextColor(...PDF_COLORS.BLACK);
  }
  
  pdf.text(`${categoryLabel.toUpperCase()} SCORES *`, pageWidth / 2, yPosition + 2, { align: 'center' });
  
  // Réinitialiser la couleur
  pdf.setTextColor(...PDF_COLORS.BLACK);
  
  return yPosition + 7;
}

/**
 * Calcule les moyennes par type d'évaluateur ET récupère la note individuelle du candidat
 */
export function calculateAveragesByTypeAndCandidatScore(
  questions: Array<{
    overallAverage: number | null;
    averagesByEvaluatorType: Record<string, number>;
    candidatAnswer?: number | null;
  }>
): { avgByType: Record<string, number>; candidatScore: number } {
  const avgByType: Record<string, number> = {
    COLLABORATEUR_DIRECT: 0,
    MANAGER_DIRECT: 0,
    COLLEGUE: 0,
    RH: 0,
    CANDIDAT: 0,
  };

  // Calculer les moyennes par type d'évaluateur
  if (questions && questions.length > 0) {
    Object.keys(avgByType).forEach((type) => {
      const sum = questions.reduce((acc, q) => acc + (q.averagesByEvaluatorType[type] || 0), 0);
      avgByType[type] = sum / questions.length;
    });
  }

  // Calculer la moyenne des réponses individuelles du candidat
  let candidatScore = 0;
  if (questions && questions.length > 0) {
    const candidatAnswers = questions.filter(q => q.candidatAnswer !== null && q.candidatAnswer !== undefined);
    if (candidatAnswers.length > 0) {
      const sum = candidatAnswers.reduce((acc, q) => acc + (q.candidatAnswer || 0), 0);
      candidatScore = sum / candidatAnswers.length;
    }
  }

  return { avgByType, candidatScore };
}

/**
 * Dessine le graphique des scores avec barres horizontales
 */
export function drawScoresChart(
  pdf: jsPDF,
  categoryAverage: number,
  avgByType: Record<string, number>,
  candidatScore: number,
  margin: number,
  yPosition: number
): number {
  const evaluatorTypes = [
    { label: 'Overall', value: categoryAverage, showValue: true },
    { label: 'Direct Reports', value: avgByType.COLLABORATEUR_DIRECT, showValue: true },
    { label: 'Manager', value: avgByType.MANAGER_DIRECT, showValue: true },
    { label: 'Peer', value: avgByType.COLLEGUE, showValue: true },
    { label: 'Others', value: avgByType.RH, showValue: true },
    { label: 'Self', value: candidatScore, showValue: false },
  ];

  const barMaxWidth = 120;
  const barStartX = margin + 45;
  let currentY = yPosition;

  evaluatorTypes.forEach((item, idx) => {
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...PDF_COLORS.BLACK);
    pdf.text(item.label, barStartX - 3, currentY + 2, { align: 'right' });

    // Valeur à gauche de la barre
    if (item.showValue) {
      pdf.text(`|${item.value.toFixed(1)}`, barStartX + 2, currentY + 2);
    }

    // Lignes verticales de grille (0, 1, 2, 3, 4, 5, 6, 7)
    if (idx === 0) {
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      for (let i = 0; i <= 7; i++) {
        const x = barStartX + 10 + (i * barMaxWidth / 7);
        pdf.line(x, currentY - 2, x, currentY + (evaluatorTypes.length * 4.5) + 5);
      }
    }

    // Barre de valeur (noire pour Self, grise pour les autres)
    const barWidth = (item.value / 7) * barMaxWidth;
    if (idx === evaluatorTypes.length - 1) {
      // Barre noire pour "Self"
      pdf.setFillColor(...PDF_COLORS.BLACK);
    } else {
      // Barre grise claire pour les autres
      pdf.setFillColor(180, 180, 180);
    }
    pdf.rect(barStartX + 10, currentY - 1, barWidth, 3.5, 'F');

    // Valeur à droite de la barre pour Self
    if (!item.showValue && item.value > 0) {
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${item.value.toFixed(1)}`, barStartX + 10 + barWidth + 2, currentY + 2);
    }

    currentY += 4.5;
  });

  return currentY;
}

/**
 * Ajoute la légende de l'échelle sous le graphique
 */
export function addScaleLegend(
  pdf: jsPDF,
  margin: number,
  yPosition: number
): number {
  const barMaxWidth = 120;
  const barStartX = margin + 45;

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  for (let i = 0; i <= 7; i++) {
    const x = barStartX + 10 + (i * barMaxWidth / 7);
    pdf.text(`${i}`, x - 1, yPosition + 3);
  }

  return yPosition + 8;
}

import jsPDF from 'jspdf';
import { PDF_COLORS } from './pdfStyles';

/**
 * Crée l'encadré de titre "CATEGORY SCORES *"
 */
export function createScoresHeaderBox(
  pdf: jsPDF,
  categoryLabel: string,
  pageWidth: number,
  margin: number,
  yPosition: number
): number {
  pdf.setFillColor(220, 220, 220);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text(`${categoryLabel.toUpperCase()} SCORES *`, pageWidth / 2, yPosition + 7, { align: 'center' });
  
  return yPosition + 15;
}

/**
 * Calcule les moyennes par type d'évaluateur
 */
export function calculateAveragesByType(
  questions: Array<{
    overallAverage: number | null;
    averagesByEvaluatorType: Record<string, number>;
  }>
): Record<string, number> {
  const avgByType: Record<string, number> = {
    COLLABORATEUR_DIRECT: 0,
    MANAGER_DIRECT: 0,
    COLLEGUE: 0,
    RH: 0,
    CANDIDAT: 0,
  };

  if (questions && questions.length > 0) {
    Object.keys(avgByType).forEach((type) => {
      const sum = questions.reduce((acc, q) => acc + (q.averagesByEvaluatorType[type] || 0), 0);
      avgByType[type] = sum / questions.length;
    });
  }

  return avgByType;
}

/**
 * Dessine le graphique des scores avec barres horizontales
 */
export function drawScoresChart(
  pdf: jsPDF,
  categoryAverage: number,
  avgByType: Record<string, number>,
  margin: number,
  yPosition: number
): number {
  const evaluatorTypes = [
    { label: 'Overall', value: categoryAverage, showValue: true },
    { label: 'Direct Reports', value: avgByType.COLLABORATEUR_DIRECT, showValue: true },
    { label: 'Manager', value: avgByType.MANAGER_DIRECT, showValue: true },
    { label: 'Peer', value: avgByType.COLLEGUE, showValue: true },
    { label: 'Others', value: avgByType.RH, showValue: true },
    { label: 'Self', value: avgByType.CANDIDAT, showValue: false },
  ];

  const barMaxWidth = 120;
  const barStartX = margin + 45;
  let currentY = yPosition;

  evaluatorTypes.forEach((item, idx) => {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...PDF_COLORS.BLACK);
    pdf.text(item.label, barStartX - 3, currentY + 3, { align: 'right' });

    // Valeur à gauche de la barre
    if (item.showValue) {
      pdf.text(`|${item.value.toFixed(1)}`, barStartX + 2, currentY + 3);
    }

    // Lignes verticales de grille (0, 1, 2, 3, 4, 5, 6, 7)
    if (idx === 0) {
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      for (let i = 0; i <= 7; i++) {
        const x = barStartX + 10 + (i * barMaxWidth / 7);
        pdf.line(x, currentY - 2, x, currentY + (evaluatorTypes.length * 7) + 5);
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
    pdf.rect(barStartX + 10, currentY - 1, barWidth, 5, 'F');

    // Valeur à droite de la barre pour Self
    if (!item.showValue && item.value > 0) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${item.value.toFixed(1)}`, barStartX + 10 + barWidth + 2, currentY + 3);
    }

    currentY += 7;
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

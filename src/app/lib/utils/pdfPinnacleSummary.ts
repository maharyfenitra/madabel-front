import jsPDF from 'jspdf';
import type { CategoryReport } from './pdfTypes';
import { PDF_COLORS, PDF_FONT_SIZES, PDF_SPACING } from './pdfStyles';
import { formatScore } from './pdfHelpers';
import { addPageHeader, addPageFooter } from './pdfPages';

/**
 * Calcule la moyenne générale d'une liste de questions
 */
function calculateAverage(questions: CategoryReport['questions']): number {
  if (!questions || questions.length === 0) return 0;
  const sum = questions.reduce((acc, q) => acc + (q.overallAverage || 0), 0);
  return sum / questions.length;
}

/**
 * Calcule les moyennes par type d'évaluateur et les compteurs de participants
 */
function calculateAveragesByType(questions: CategoryReport['questions']): { avgByType: Record<string, number>; countByType: Record<string, number> } {
  const typeAverages: Record<string, { sum: number; count: number }> = {};
  const countByType: Record<string, number> = {
    COLLABORATEUR_DIRECT: 0,
    MANAGER_DIRECT: 0,
    COLLEGUE: 0,
    RH: 0,
    CANDIDAT: 0,
  };

  questions.forEach((q) => {
    Object.entries(q.averagesByEvaluatorType).forEach(([type, avg]) => {
      if (!typeAverages[type]) {
        typeAverages[type] = { sum: 0, count: 0 };
      }
      typeAverages[type].sum += avg;
      typeAverages[type].count++;
    });
    
    // Calculer le max des compteurs pour chaque type
    if (q.countByEvaluatorType) {
      Object.entries(q.countByEvaluatorType).forEach(([type, count]) => {
        countByType[type] = Math.max(countByType[type], count);
      });
    }
  });

  const avgByType: Record<string, number> = {};
  Object.entries(typeAverages).forEach(([type, data]) => {
    avgByType[type] = data.count > 0 ? data.sum / data.count : 0;
  });

  return { avgByType, countByType };
}

/**
 * Dessine un mini graphique horizontal pour une sous-catégorie
 */
function drawMiniChart(
  pdf: jsPDF,
  xStart: number,
  yStart: number,
  avgByType: Record<string, number>,
  countByType: Record<string, number>,
  overallAverage: number,
  totalCount: number
): number {
  const labels = [
    { key: 'COLLABORATEUR_DIRECT', label: 'Collaborateurs Directs' },
    { key: 'MANAGER_DIRECT', label: 'Manager Direct' },
    { key: 'COLLEGUE', label: 'Pairs' },
    { key: 'RH', label: 'Autres' },
    { key: 'CANDIDAT', label: 'Soi' },
  ];

  const lineHeight = 5;
  const maxBarWidth = 100;
  let currentY = yStart;

  // Ajouter "Moyenne générale" en premier avec le compteur total
  pdf.setFontSize(PDF_FONT_SIZES.TINY);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const labelWithCount = `Moyenne générale (${totalCount})`;
  pdf.text(labelWithCount, xStart, currentY);

  // Dessiner la barre
  const barWidth = (overallAverage / 7) * maxBarWidth;
  pdf.setFillColor(...PDF_COLORS.DARK_GREY);
  pdf.rect(xStart + 45, currentY - 3, barWidth, 3, 'F');

  currentY += lineHeight;

  // Dessiner les autres lignes avec les compteurs
  labels.forEach((item) => {
    const value = avgByType[item.key] || 0;
    const count = countByType[item.key] || 0;
    const labelWithCount = `${item.label} (${count})`;
    pdf.text(labelWithCount, xStart, currentY);

    const itemBarWidth = (value / 7) * maxBarWidth;
    pdf.setFillColor(...PDF_COLORS.DARK_GREY);
    pdf.rect(xStart + 45, currentY - 3, itemBarWidth, 3, 'F');

    currentY += lineHeight;
  });

  return currentY + PDF_SPACING.SMALL;
}

/**
 * Crée la page de sommaire Pinnacle avec Pinnacle-Soi et Pinnacle-Autres
 */
export function createPinnacleSummaryPage(
  pdf: jsPDF,
  soiQuestions: CategoryReport['questions'],
  autresQuestions: CategoryReport['questions'],
  logoCouleursDataUrl: string,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  candidatName?: string
): void {
  pdf.addPage();
  const currentPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
  addPageHeader(pdf, logoCouleursDataUrl, currentPage, pageWidth, candidatName);

  let yPosition = 50;

  // Titre principal
  pdf.setFontSize(PDF_FONT_SIZES.HEADING);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('Pinnacle-Soi et Pinnacle-Autres', margin, yPosition);
  yPosition += PDF_SPACING.LARGE;

  // Section Pinnacle-Soi (toujours affichée)
  // Bandeau bleu
  pdf.setFillColor(33, 150, 243);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');

  pdf.setFontSize(PDF_FONT_SIZES.SUBTITLE);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Pinnacle-Soi', margin + 5, yPosition + 7);

  yPosition += 15;

  // Calculer les moyennes et les compteurs
  const soiAverage = calculateAverage(soiQuestions);
  const { avgByType: soiAvgByType, countByType: soiCountByType } = calculateAveragesByType(soiQuestions);
  const soiTotalCount = soiCountByType.COLLABORATEUR_DIRECT + soiCountByType.MANAGER_DIRECT + soiCountByType.COLLEGUE + soiCountByType.RH;

  // Moyenne générale
  pdf.setFontSize(PDF_FONT_SIZES.BODY);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text(`Moyenne générale ${formatScore(soiAverage)}`, margin, yPosition);
  yPosition += PDF_SPACING.MEDIUM;

  // Mini graphique
  yPosition = drawMiniChart(pdf, margin + 5, yPosition, soiAvgByType, soiCountByType, soiAverage, soiTotalCount);
  yPosition += PDF_SPACING.MEDIUM;

  // Section Pinnacle-Autres (toujours affichée)
  // Bandeau bleu
  pdf.setFillColor(33, 150, 243);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');

  pdf.setFontSize(PDF_FONT_SIZES.SUBTITLE);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Pinnacle-Autres', margin + 5, yPosition + 7);

  yPosition += 15;

  // Calculer les moyennes et les compteurs
  const autresAverage = calculateAverage(autresQuestions);
  const { avgByType: autresAvgByType, countByType: autresCountByType } = calculateAveragesByType(autresQuestions);
  const autresTotalCount = autresCountByType.COLLABORATEUR_DIRECT + autresCountByType.MANAGER_DIRECT + autresCountByType.COLLEGUE + autresCountByType.RH;

  // Moyenne générale
  pdf.setFontSize(PDF_FONT_SIZES.BODY);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text(`Moyenne générale ${formatScore(autresAverage)}`, margin, yPosition);
  yPosition += PDF_SPACING.MEDIUM;

  // Mini graphique
  yPosition = drawMiniChart(pdf, margin + 5, yPosition, autresAvgByType, autresCountByType, autresAverage, autresTotalCount);

  // Bas de page
  addPageFooter(pdf, pageWidth, pageHeight);
}

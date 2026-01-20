
import jsPDF from 'jspdf';
import type { CategoryInfo } from './pdfTypes';
import { PDF_COLORS } from './pdfStyles';

/**
 * Crée le bandeau de titre de la catégorie
 */
export function createCategoryHeaderBanner(
  pdf: jsPDF,
  categoryLabel: string,
  categoryInfo: CategoryInfo,
  pageWidth: number,
  margin: number,
  yPosition: number
): number {
  // Bandeau de titre de la catégorie avec couleur spécifique
  pdf.setFillColor(categoryInfo.color[0], categoryInfo.color[1], categoryInfo.color[2]);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(categoryInfo.textColor[0], categoryInfo.textColor[1], categoryInfo.textColor[2]);
  pdf.text(categoryLabel.toUpperCase(), margin + 5, yPosition + 8);
  
  // Réinitialisation complète après le bandeau
  pdf.setTextColor(0, 0, 0);
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(0, 0, 0);
  
  return yPosition + 20; // Augmenté de 18 à 20 pour plus d'espace
}

/**
 * Affiche la moyenne générale de la catégorie
 */
export function displayCategoryAverage(
  pdf: jsPDF,
  categoryAverage: number,
  margin: number,
  yPosition: number
): number {
  // Effacer toute la ligne avec un rectangle blanc avant d'écrire
  const pageWidth = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, yPosition - 5, pageWidth, 12, 'F');
  
  // Réinitialisation complète du style pour éviter les artefacts
  pdf.setDrawColor(0, 0, 0);
  pdf.setFillColor(255, 255, 255);
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Moyenne générale ${categoryAverage.toFixed(1)}`, margin, yPosition);
  
  return yPosition + 10; // Augmenté de 8 à 10 pour plus d'espace
}

/**
 * Affiche le texte explicatif de la catégorie
 */
export function displayExplanationText(
  pdf: jsPDF,
  explanationText: string,
  pageWidth: number,
  margin: number,
  yPosition: number
): number {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  const splitText = pdf.splitTextToSize(explanationText, pageWidth - 2 * margin);
  pdf.text(splitText, margin, yPosition);
  
  return yPosition + splitText.length * 3.5; // Espace minimum absolu
}

import jsPDF from 'jspdf';
import { PDF_COLORS } from './pdfStyles';

/**
 * Crée la quatrième page (Format du rapport)
 */
export function createFormatPage(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  candidatName?: string
): void {
  pdf.addPage();
  
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo en haut à gauche
  if (logoCouleursDataUrl) {
    pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, 60, 24);
  }
  
  // Nom du candidat en haut à droite (sans fond)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const displayName = candidatName || 'Nom du candidat';
  pdf.text(`${displayName} P 4`, pageWidth - 45, 20, { align: 'center' });
  
  let yPosition = 50;
  
  // Bandeau gris "FORMAT DU RAPPORT"
  pdf.setFillColor(...PDF_COLORS.GREY_BANNER);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('FORMAT DU RAPPORT', margin + 5, yPosition + 8);
  yPosition += 18;
  
  // Ligne avec mots colorés
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // "•Production," en vert
  pdf.setTextColor(...PDF_COLORS.GREEN);
  pdf.text('•Production, ', margin + 5, yPosition);
  
  // "Permission," en jaune foncé
  pdf.setTextColor(...PDF_COLORS.YELLOW);
  pdf.text('Permission, ', margin + 35, yPosition);
  
  // "Pinnacle" en bleu
  pdf.setTextColor(...PDF_COLORS.BLUE);
  pdf.text('Pinnacle ', margin + 68, yPosition);
  
  // "( Soi," en noir
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('( Soi, ', margin + 90, yPosition);
  
  // "Position," en rouge
  pdf.setTextColor(244, 67, 54); // Rouge Position
  pdf.text('Position, ', margin + 104, yPosition);
  
  // "Développement des autres)" en violet
  pdf.setTextColor(156, 39, 176); // Violet
  pdf.text('Développement des autres)', margin + 125, yPosition);
  
  yPosition += 10;
  
  // Trois puces vides
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('•', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('•', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('•', margin + 5, yPosition);
  yPosition += 12;
  
  // Bandeau gris vide
  pdf.setFillColor(...PDF_COLORS.GREY_BANNER);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  yPosition += 18;
  
  // Texte "0 de 0 (reprend les points)" en noir avec parenthèse en jaune
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('0 de 0 ', margin, yPosition);
  
  // "(reprend les points)" en jaune
  const textWidth = pdf.getTextWidth('0 de 0 ');
  pdf.setTextColor(...PDF_COLORS.YELLOW);
  pdf.text('(reprend les points)', margin + textWidth, yPosition);
  yPosition += 8;
  
  // Liste avec puces
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('•0 de 0 Collaborateurs directs', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('•0 de 0 Manager Direct', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('•0 de 0 Pair / Associé', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('•0 de 0 Autres', margin + 5, yPosition);
  yPosition += 10;
  
  // Bas de page pour la page 4 vide
}

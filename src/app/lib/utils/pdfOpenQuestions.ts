import jsPDF from 'jspdf';
import { PDF_COLORS, PDF_FONT_SIZES, PDF_SPACING } from './pdfStyles';
import { addPageHeader, addPageFooter } from './pdfPages';

/**
 * Crée la page des questions ouvertes
 */
export function createOpenQuestionsPage(
  pdf: jsPDF,
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

  // Bandeau titre "QUESTIONS OUVERTES"
  pdf.setFillColor(60, 60, 60); // Gris foncé
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  pdf.setFontSize(PDF_FONT_SIZES.SUBTITLE);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('QUESTIONS OUVERTES', margin + 5, yPosition + 8);
  
  yPosition += 20;

  // Question 1
  pdf.setFontSize(PDF_FONT_SIZES.BODY);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const question1 = "Quelles sont les plus grandes forces de cette personne lorsqu'il s'agit d'entrer en relation avec les autres et de les diriger ?";
  const splitQ1 = pdf.splitTextToSize(question1, pageWidth - 2 * margin);
  pdf.text(splitQ1, margin, yPosition);
  yPosition += splitQ1.length * 5 + 3;

  // Puces pour question 1
  for (let i = 0; i < 3; i++) {
    pdf.setFontSize(PDF_FONT_SIZES.BODY);
    pdf.text('•', margin + 2, yPosition);
    yPosition += 6;
  }
  yPosition += 8;

  // Question 2
  pdf.setFont('helvetica', 'bold');
  const question2 = "Quelles sont les plus grandes difficultés de cette personne lorsqu'il s'agit d'entrer en relation avec les autres et de les diriger ?";
  const splitQ2 = pdf.splitTextToSize(question2, pageWidth - 2 * margin);
  pdf.text(splitQ2, margin, yPosition);
  yPosition += splitQ2.length * 5 + 3;

  // Puces pour question 2
  for (let i = 0; i < 3; i++) {
    pdf.setFontSize(PDF_FONT_SIZES.BODY);
    pdf.text('•', margin + 2, yPosition);
    yPosition += 6;
  }
  yPosition += 8;

  // Question 3
  pdf.setFont('helvetica', 'bold');
  const question3 = "Quels sont les points forts et les difficultés de cette personne en ce qui concerne le développement des autres ? (Tout autre commentaire que vous souhaitez faire peut être inscrit dans cette section également).";
  const splitQ3 = pdf.splitTextToSize(question3, pageWidth - 2 * margin);
  pdf.text(splitQ3, margin, yPosition);
  yPosition += splitQ3.length * 5 + 3;

  // Puces pour question 3
  for (let i = 0; i < 3; i++) {
    pdf.setFontSize(PDF_FONT_SIZES.BODY);
    pdf.text('•', margin + 2, yPosition);
    yPosition += 6;
  }

  // Bas de page
  addPageFooter(pdf, pageWidth, pageHeight);
}

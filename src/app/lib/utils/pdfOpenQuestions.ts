import jsPDF from 'jspdf';
import { PDF_COLORS, PDF_FONT_SIZES, PDF_SPACING } from './pdfStyles';
import { addPageHeader, addPageFooter } from './pdfPages';

interface OpenQuestion {
  text: string;
  type: string;
  textAnswers?: Array<{ text: string; evaluatorType?: string }>;
}

/**
 * Crée la page des questions ouvertes avec les questions AUTRE de type TEXT
 * Affiche toujours la page, même s'il n'y a pas de questions configurées
 */
export function createOpenQuestionsPage(
  pdf: jsPDF,
  openQuestions: OpenQuestion[],
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

  // Si aucune question configurée, afficher un message
  if (!openQuestions || openQuestions.length === 0) {
    pdf.setFontSize(PDF_FONT_SIZES.BODY);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(...PDF_COLORS.BLACK);
    pdf.text('Aucune question ouverte configurée pour ce questionnaire.', margin, yPosition);
    addPageFooter(pdf, pageWidth, pageHeight);
    return;
  }

  // Afficher chaque question dynamiquement
  openQuestions.forEach((question, index) => {
    // Vérifier si on a besoin d'une nouvelle page
    if (yPosition > pageHeight - 60) {
      addPageFooter(pdf, pageWidth, pageHeight);
      pdf.addPage();
      const newPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
      addPageHeader(pdf, logoCouleursDataUrl, newPage, pageWidth, candidatName);
      yPosition = 50;
    }

    // Afficher le texte de la question
    pdf.setFontSize(PDF_FONT_SIZES.BODY);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...PDF_COLORS.BLACK);
    
    const questionText = `${index + 1}. ${question.text}`;
    const splitQuestion = pdf.splitTextToSize(questionText, pageWidth - 2 * margin);
    pdf.text(splitQuestion, margin, yPosition);
    yPosition += splitQuestion.length * 5 + 5;

    // Afficher les réponses s'il y en a
    if (question.textAnswers && question.textAnswers.length > 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(PDF_FONT_SIZES.BODY - 1);
      
      question.textAnswers.forEach((answer, answerIndex) => {
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition > pageHeight - 40) {
          addPageFooter(pdf, pageWidth, pageHeight);
          pdf.addPage();
          const newPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
          addPageHeader(pdf, logoCouleursDataUrl, newPage, pageWidth, candidatName);
          yPosition = 50;
        }

        // Afficher la réponse directement sans le type d'évaluateur
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...PDF_COLORS.BLACK);
        const responseText = answer.text || '';
        const splitResponse = pdf.splitTextToSize(responseText, pageWidth - 2 * margin - 5);
        pdf.text(splitResponse, margin + 2, yPosition);
        yPosition += splitResponse.length * 5 + 3;
      });
    } else {
      // Afficher des lignes vides si pas de réponses
      for (let i = 0; i < 3; i++) {
        pdf.setFontSize(PDF_FONT_SIZES.BODY);
        pdf.setFont('helvetica', 'normal');
        pdf.text('•', margin + 2, yPosition);
        yPosition += 6;
      }
    }
    yPosition += 8; // Espacement entre les questions
  });

  // Bas de page
  addPageFooter(pdf, pageWidth, pageHeight);
}

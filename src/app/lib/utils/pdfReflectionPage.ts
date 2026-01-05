import jsPDF from 'jspdf';
import { PDF_COLORS, PDF_FONT_SIZES, PDF_SPACING, CATEGORY_DATA } from './pdfStyles';
import { addPageHeader, addPageFooter } from './pdfPages';
import { formatScore } from './pdfHelpers';
import type { CategoryReport } from './pdfTypes';

/**
 * Crée la page de réflexion avec les moyennes des catégories et questions de réflexion
 */
export function createReflectionPage(
  pdf: jsPDF,
  reportCategories: CategoryReport[],
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

  // Calculer les moyennes de chaque catégorie
  const categoryAverages: Record<string, number> = {};
  const categoriesOrder = ['PRODUCTION', 'PERMISSION', 'PINNACLE', 'POSITION'];
  
  // Calculer moyenne pour chaque catégorie standard
  categoriesOrder.forEach(catName => {
    const category = reportCategories.find(c => c.category === catName);
    if (category && category.questions && category.questions.length > 0) {
      const sum = category.questions.reduce((acc, q) => acc + (q.overallAverage || 0), 0);
      categoryAverages[catName] = sum / category.questions.length;
    } else {
      categoryAverages[catName] = 0;
    }
  });

  // Calculer moyenne pour "Développement des autres"
  const developOthersQuestions: any[] = [];
  reportCategories.forEach(cat => {
    if (cat.questions) {
      const filteredQuestions = cat.questions.filter((q: any) => q.developOthers === true);
      developOthersQuestions.push(...filteredQuestions);
    }
  });
  
  if (developOthersQuestions.length > 0) {
    const sum = developOthersQuestions.reduce((acc, q) => acc + (q.overallAverage || 0), 0);
    categoryAverages['DÉVELOPPEMENT DES AUTRES'] = sum / developOthersQuestions.length;
  } else {
    categoryAverages['DÉVELOPPEMENT DES AUTRES'] = 0;
  }

  // Afficher les moyennes des catégories à gauche
  const categoryDisplayInfo = [
    { name: 'Production', key: 'PRODUCTION', color: [76, 175, 80] },
    { name: 'Permission', key: 'PERMISSION', color: [255, 193, 7] },
    { name: 'Pinnacle', key: 'PINNACLE', color: [33, 150, 243] },
    { name: 'Position', key: 'POSITION', color: [244, 67, 54] },
    { name: 'Développement des autres', key: 'DÉVELOPPEMENT DES AUTRES', color: [103, 58, 183] },
  ];

  pdf.setFontSize(PDF_FONT_SIZES.BODY);
  categoryDisplayInfo.forEach(catInfo => {
    const average = categoryAverages[catInfo.key] || 0;
    
    // Nom de la catégorie avec couleur
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(catInfo.color[0], catInfo.color[1], catInfo.color[2]);
    pdf.text(catInfo.name, margin, yPosition);
    
    // Moyenne
    pdf.setTextColor(...PDF_COLORS.BLACK);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatScore(average), margin + 55, yPosition);
    
    yPosition += 6;
  });

  yPosition += 10;

  // Question 1
  pdf.setFontSize(PDF_FONT_SIZES.BODY);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const question1 = "Qu'est-ce qui vous a surpris dans ces résultats ?";
  pdf.text(question1, margin, yPosition);
  yPosition += 7;

  // Lignes pour la réponse
  pdf.setDrawColor(200, 200, 200);
  for (let i = 0; i < 5; i++) {
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;
  }
  yPosition += 5;

  // Question 2
  pdf.setFont('helvetica', 'bold');
  const question2 = "Qu'est-ce qui vous a encouragé dans ces résultats ?";
  pdf.text(question2, margin, yPosition);
  yPosition += 7;

  // Lignes pour la réponse
  for (let i = 0; i < 5; i++) {
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;
  }
  yPosition += 5;

  // Question 3
  pdf.setFont('helvetica', 'bold');
  const question3Text = "Examinez vos commentaires écrits (section « Questions ouvertes » du présent rapport). Quels commentaires ont confirmé le retour d'information que vous avez reçu de vos scores ?";
  const splitQ3 = pdf.splitTextToSize(question3Text, pageWidth - 2 * margin);
  pdf.text(splitQ3, margin, yPosition);
  yPosition += splitQ3.length * 5 + 2;

  // Lignes pour la réponse
  for (let i = 0; i < 6; i++) {
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;
  }

  // Bas de page
  addPageFooter(pdf, pageWidth, pageHeight);
}

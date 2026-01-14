import jsPDF from 'jspdf';
import type { CategoryReport, CategoryInfo } from './pdfTypes';
import { addPageHeader, addPageFooter } from './pdfPages';
import { CATEGORY_DESCRIPTIONS } from './pdfStyles';
import { 
  createCategoryHeaderBanner, 
  displayCategoryAverage, 
  displayExplanationText 
} from './pdfCategoryHeader';
import {
  createScoresHeaderBox,
  calculateAveragesByType,
  drawScoresChart,
  addScaleLegend
} from './pdfCategoryChart';
import {
  displayTableNote,
  createQuestionsTable,
  displayRatingScale
} from './pdfCategoryTable';

/**
 * Crée une page pour une catégorie avec toutes ses questions
 */
export function createCategoryPage(
  pdf: jsPDF,
  category: CategoryReport,
  categoryInfo: CategoryInfo,
  logoCouleursDataUrl: string,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  isFirstCategory: boolean,
  candidatName?: string
): void {
  // Nouvelle page pour chaque catégorie
  pdf.addPage();
  const currentPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
  addPageHeader(pdf, logoCouleursDataUrl, currentPage, pageWidth, candidatName);
  
  let yPosition = 50;
  const categoryLabel = categoryInfo.name || category.category || 'Sans catégorie';
  
  // Calculer la moyenne générale de la catégorie
  let categoryAverage = 0;
  if (category.questions && category.questions.length > 0) {
    const sum = category.questions.reduce((acc, q) => acc + (q.overallAverage || 0), 0);
    categoryAverage = sum / category.questions.length;
  }

  // 1. Bandeau de titre de la catégorie
  yPosition = createCategoryHeaderBanner(pdf, categoryLabel, categoryInfo, pageWidth, margin, yPosition);
  
  // 2. Moyenne générale
  yPosition = displayCategoryAverage(pdf, categoryAverage, margin, yPosition);
  
  // 3. Texte explicatif selon la catégorie
  const explanationText = CATEGORY_DESCRIPTIONS[category.category] || CATEGORY_DESCRIPTIONS.PRODUCTION;
  yPosition = displayExplanationText(pdf, explanationText, pageWidth, margin, yPosition);
  
  // 4. Encadré "PRODUCTION SCORES *"
  yPosition = createScoresHeaderBox(pdf, categoryLabel, pageWidth, margin, yPosition);
  
  // 5. Calculer les moyennes par type d'évaluateur
  const avgByType = calculateAveragesByType(category.questions || []);
  
  // 6. Graphique des scores
  yPosition = drawScoresChart(pdf, categoryAverage, avgByType, margin, yPosition);
  
  // 7. Légende de l'échelle
  yPosition = addScaleLegend(pdf, margin, yPosition);
  
  // 8. Note explicative du tableau
  yPosition = displayTableNote(pdf, pageWidth, margin, yPosition);

  // 9. Tableau des questions
  yPosition = createQuestionsTable(
    pdf,
    category,
    categoryInfo,
    logoCouleursDataUrl,
    pageWidth,
    margin,
    yPosition,
    candidatName
  );
  
  // 10. Texte de l'échelle de notation (seulement si des questions existent)
  if (category.questions && category.questions.length > 0) {
    yPosition = displayRatingScale(pdf, pageWidth, margin, yPosition);
  }
  
  // Bas de page
  addPageFooter(pdf, pageWidth, pageHeight);
}

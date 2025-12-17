import jsPDF from 'jspdf';
import type { ReportData } from './pdfTypes';
import { loadImage } from './pdfHelpers';
import { CATEGORY_DATA } from './pdfStyles';
import {
  createCoverPage,
  createTransitionPage,
  createIntroductionPage,
  createFormatPage,
  createConclusionPage,
} from './pdfPages';
import { createCategoryPage } from './pdfCategoryPage';

/**
 * GÃ©nÃ¨re un PDF Ã  partir des donnÃ©es du rapport d'Ã©valuation
 */
export async function generateReportPDF(data: ReportData): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;

  // Charger les logos
  let logoDataUrl = '';
  let logoCouleursDataUrl = '';
  try {
    logoDataUrl = await loadImage('/Logo-360.png');
    logoCouleursDataUrl = await loadImage('/Logo-couleurs-Madabel.webp');
  } catch (error) {
    console.warn('Logo non chargÃ©:', error);
  }

  // PAGE 1 - Couverture
  createCoverPage(pdf, data, logoCouleursDataUrl, logoDataUrl, pageWidth, pageHeight, margin);

  // PAGE 2 - Transition
  createTransitionPage(pdf, logoCouleursDataUrl, pageWidth, pageHeight);

  // PAGE 3 - Introduction
  createIntroductionPage(pdf, logoCouleursDataUrl, logoDataUrl, pageWidth, pageHeight, margin);

  // PAGE 4 - Format du rapport
  createFormatPage(pdf, logoCouleursDataUrl, pageWidth, pageHeight, margin);

  // PAGES 5+ - CatÃ©gories
  const reportCategories = data.report || [];
  
  for (let catIndex = 0; catIndex < reportCategories.length; catIndex++) {
    const category = reportCategories[catIndex];
    const categoryInfo = CATEGORY_DATA[catIndex] || CATEGORY_DATA[0];
    
    createCategoryPage(
      pdf,
      category,
      categoryInfo,
      logoCouleursDataUrl,
      pageWidth,
      pageHeight,
      margin,
      catIndex === 0 // isFirstCategory
    );
  }

  // DERNIÃˆRE PAGE - Conclusion
  createConclusionPage(pdf, logoCouleursDataUrl, pageWidth, pageHeight, margin);

  // TÃ©lÃ©charger le PDF
  const fileName = `rapport-360-${data.evaluationRef || 'evaluation'}.pdf`;
  pdf.save(fileName);
}


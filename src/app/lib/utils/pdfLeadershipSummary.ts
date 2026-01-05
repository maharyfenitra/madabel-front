import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDF_COLORS, PDF_FONT_SIZES, CATEGORY_DATA } from './pdfStyles';
import { addPageHeader, addPageFooter } from './pdfPages';
import { formatScore } from './pdfHelpers';
import type { CategoryReport } from './pdfTypes';

/**
 * Crée la page de résumé des attributs de leadership
 */
export function createLeadershipSummaryPage(
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

  // Bandeau titre
  pdf.setFillColor(200, 200, 200); // Gris clair
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
  
  pdf.setFontSize(PDF_FONT_SIZES.SUBTITLE);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('Résumé des attributs de leadership', margin + 5, yPosition + 7);
  
  yPosition += 15;

  // Collecter toutes les questions de toutes les catégories
  const allQuestions: Array<{
    text: string;
    category: string;
    average: number;
  }> = [];

  reportCategories.forEach(category => {
    if (category.questions) {
      category.questions.forEach(question => {
        // Déterminer la catégorie d'affichage
        let displayCategory = category.category;
        
        // Si c'est PINNACLE, utiliser la sous-catégorie
        if (category.category === 'PINNACLE' && question.subcategory) {
          if (question.subcategory === 'SOI') {
            displayCategory = 'Pinnacle-S';
          } else if (question.subcategory === 'AUTRES') {
            displayCategory = 'Pinnacle-A';
          }
        } else if (category.category === 'PINNACLE') {
          displayCategory = 'Pinnacle';
        }
        
        allQuestions.push({
          text: question.questionText,
          category: displayCategory,
          average: question.overallAverage || 0,
        });
      });
    }
  });

  // Trier par moyenne décroissante
  allQuestions.sort((a, b) => b.average - a.average);

  // Préparer les données du tableau
  const tableData = allQuestions.map((q, index) => [
    (index + 1).toString(),
    q.text,
    q.category,
    formatScore(q.average),
  ]);

  // Définir les couleurs des catégories
  const categoryColors: Record<string, [number, number, number]> = {
    'POSITION': [244, 67, 54],
    'Position': [244, 67, 54],
    'PERMISSION': [255, 193, 7],
    'Permission': [255, 193, 7],
    'PRODUCTION': [76, 175, 80],
    'Production': [76, 175, 80],
    'PINNACLE': [33, 150, 243],
    'Pinnacle': [33, 150, 243],
    'Pinnacle-S': [33, 150, 243],
    'Pinnacle-A': [33, 150, 243],
  };

  autoTable(pdf, {
    startY: yPosition,
    head: [['Rang', 'Article', 'Catégorie', 'Moyenne']],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [60, 60, 60],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      valign: 'middle',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', valign: 'middle' },
      1: { cellWidth: 110, halign: 'left', valign: 'middle' },
      2: { cellWidth: 25, halign: 'center', valign: 'middle' },
      3: { cellWidth: 18, halign: 'center', valign: 'middle' },
    },
    margin: { left: margin, right: margin },
    didParseCell: (hookData: any) => {
      // Colorer la colonne "Catégorie" selon la catégorie
      if (hookData.section === 'body' && hookData.column.index === 2) {
        const cellValue = hookData.cell.raw;
        const color = categoryColors[cellValue];
        
        if (color) {
          hookData.cell.styles.fillColor = color;
          hookData.cell.styles.textColor = [255, 255, 255];
          hookData.cell.styles.fontStyle = 'bold';
        }
      }
    },
    didDrawPage: (hookData: any) => {
      // Ajouter l'en-tête sur les nouvelles pages
      if (hookData.pageNumber > currentPage) {
        const newPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
        addPageHeader(pdf, logoCouleursDataUrl, newPage, pageWidth, candidatName);
      }
    },
  });

  // Bas de page
  addPageFooter(pdf, pageWidth, pageHeight);
}

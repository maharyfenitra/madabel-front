import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CategoryReport, CategoryInfo } from './pdfTypes';
import { formatScore } from './pdfHelpers';
import { PDF_COLORS, PDF_FONT_SIZES, TABLE_CONFIG } from './pdfStyles';
import { addPageHeader } from './pdfPages';

/**
 * Configuration des en-têtes de colonnes du tableau
 */
const TABLE_HEADERS = [
  'Moyen-\nne\ngéné-\nrale',
  'Collab\no-\nrateur\ns\nDirects',
  'Manag\ner\nDirect',
  'Pairs',
  'Autre\ns',
  'Soi',
] as const;

/**
 * Configuration des en-têtes de colonnes pour le tableau Développement des autres
 */
const TABLE_HEADERS_WITH_CATEGORY = [
  'Moyen-\nne\ngéné-\nrale',
  'Collab\no-\nrateur\ns\nDirects',
  'Manag\ner\nDirect',
  'Pairs',
  'Autre\ns',
  'Soi',
  'Catégorie',
] as const;

/**
 * Affiche la note explicative du tableau
 * @param pdf - Instance jsPDF
 * @param pageWidth - Largeur de la page
 * @param margin - Marge de la page
 * @param yPosition - Position Y actuelle
 * @returns Nouvelle position Y après l'affichage
 */
export function displayTableNote(
  pdf: jsPDF,
  pageWidth: number,
  margin: number,
  yPosition: number
): number {
  pdf.setFontSize(PDF_FONT_SIZES.BODY);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const noteText = `Le tableau montre chacun des éléments de cette catégorie, classés de la note la plus élevée à la note la plus basse sur la base de l'ensemble des participants.`;
  const splitNote = pdf.splitTextToSize(noteText, pageWidth - 2 * margin);
  pdf.text(splitNote, margin, yPosition);
  
  return yPosition + splitNote.length * 4 + 5;
}

/**
 * Crée le tableau des questions de la catégorie avec styling approprié
 * @param pdf - Instance jsPDF
 * @param category - Données de la catégorie
 * @param categoryInfo - Informations de style de la catégorie
 * @param logoCouleursDataUrl - URL du logo pour les en-têtes de page
 * @param pageWidth - Largeur de la page
 * @param margin - Marge de la page
 * @param yPosition - Position Y actuelle
 * @param candidatName - Nom du candidat (optionnel)
 * @returns Nouvelle position Y après le tableau
 */
export function createQuestionsTable(
  pdf: jsPDF,
  category: CategoryReport,
  categoryInfo: CategoryInfo,
  logoCouleursDataUrl: string,
  pageWidth: number,
  margin: number,
  yPosition: number,
  candidatName?: string
): number {
  // Déterminer si c'est la page "Développement des autres"
  const isDevelopOthers = category.category === 'DÉVELOPPEMENT DES AUTRES';
  
  // Préparer les données du tableau (vide si pas de questions)
  const tableData = (!category.questions || category.questions.length === 0) 
    ? [[
        'Aucune question pour cette catégorie', 
        '-', '-', '-', '-', '-',
        ...(isDevelopOthers ? ['-'] : [])
      ]]
    : category.questions.map((question) => {
        const baseData = [
          question.questionText,
          formatScore(question.overallAverage),
          formatScore(question.averagesByEvaluatorType.COLLABORATEUR_DIRECT),
          formatScore(question.averagesByEvaluatorType.MANAGER_DIRECT),
          formatScore(question.averagesByEvaluatorType.COLLEGUE),
          formatScore(question.averagesByEvaluatorType.RH),
          formatScore(question.averagesByEvaluatorType.CANDIDAT),
        ];
        
        // Ajouter la colonne catégorie si c'est la page "Développement des autres"
        if (isDevelopOthers && question.category) {
          baseData.push(question.category);
        }
        
        return baseData;
      });

  // Choisir les en-têtes appropriés
  const headers = isDevelopOthers ? TABLE_HEADERS_WITH_CATEGORY : TABLE_HEADERS;
  
  console.log(`📊 Creating table for ${category.category} with ${tableData.length} rows`);
  
  // Diviser les données en morceaux: 8 lignes pour la première page, 20 lignes pour les suivantes
  const FIRST_PAGE_ROWS = 8;
  const OTHER_PAGES_ROWS = 20;
  const chunks: any[][] = [];
  
  if (tableData.length <= FIRST_PAGE_ROWS) {
    // Tout tient sur la première page
    chunks.push(tableData);
  } else {
    // Premier chunk: 8 lignes
    chunks.push(tableData.slice(0, FIRST_PAGE_ROWS));
    
    // Chunks suivants: 20 lignes chacun
    for (let i = FIRST_PAGE_ROWS; i < tableData.length; i += OTHER_PAGES_ROWS) {
      chunks.push(tableData.slice(i, i + OTHER_PAGES_ROWS));
    }
  }
  
  console.log(`📊 Table split into ${chunks.length} chunks (first: ${chunks[0].length} rows, others: up to ${OTHER_PAGES_ROWS} rows)`);
  
  let currentY = yPosition;
  
  // Créer un tableau pour chaque chunk
  chunks.forEach((chunkData, chunkIndex) => {
    // Si ce n'est pas le premier chunk, créer une nouvelle page
    if (chunkIndex > 0) {
      pdf.addPage();
      const currentPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
      addPageHeader(pdf, logoCouleursDataUrl, currentPage, pageWidth, candidatName);
      currentY = 55; // Position Y après l'en-tête
      console.log(`📄 Created new page ${currentPage} for chunk ${chunkIndex + 1}/${chunks.length}`);
    }

  autoTable(pdf, {
    startY: currentY,
    head: [[category.category, ...headers]],
    body: chunkData,
    theme: 'plain',
    showHead: chunkIndex === 0 ? 'firstPage' : 'everyPage', // En-tête seulement sur première page du chunk
    pageBreak: 'avoid', // Désactiver la pagination automatique car on gère manuellement
    rowPageBreak: 'avoid',
    tableWidth: 'auto',
    margin: { left: margin, right: margin, top: 55, bottom: 20 },
    didDrawPage: (hookData: any) => {
      // Ajouter l'en-tête sur toutes les pages de continuation du tableau
      if (hookData.pageNumber > 1) {
        const currentPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
        console.log(`📄 Adding header to table continuation page ${currentPage}`);
        addPageHeader(pdf, logoCouleursDataUrl, currentPage, pageWidth, candidatName);
      }
    },
    styles: {
      font: 'helvetica',
      fontSize: PDF_FONT_SIZES.BODY,
      cellPadding: TABLE_CONFIG.CELL_PADDING,
      lineColor: TABLE_CONFIG.LINE_COLOR,
      lineWidth: TABLE_CONFIG.LINE_WIDTH,
      textColor: PDF_COLORS.WHITE,
    },
    headStyles: {
      fillColor: PDF_COLORS.DARK_GREY,
      textColor: PDF_COLORS.WHITE,
      fontStyle: 'normal',
      fontSize: PDF_FONT_SIZES.SMALL,
      halign: 'center',
      valign: 'middle',
      lineWidth: TABLE_CONFIG.LINE_WIDTH,
      lineColor: TABLE_CONFIG.LINE_COLOR,
    },
    bodyStyles: {
      fontSize: PDF_FONT_SIZES.BODY,
      minCellHeight: 8,
      textColor: PDF_COLORS.BLACK,
      lineWidth: TABLE_CONFIG.LINE_WIDTH,
      lineColor: TABLE_CONFIG.LINE_COLOR,
    },
    columnStyles: {
      0: { 
        halign: 'left', 
        valign: 'middle', 
        fillColor: PDF_COLORS.WHITE, 
        textColor: PDF_COLORS.BLACK 
      },
      1: { 
        halign: 'center', 
        valign: 'middle', 
        fillColor: PDF_COLORS.WHITE, 
        textColor: PDF_COLORS.BLACK 
      },
      2: { 
        halign: 'center', 
        valign: 'middle', 
        fillColor: PDF_COLORS.WHITE, 
        textColor: PDF_COLORS.BLACK 
      },
      3: { 
        halign: 'center', 
        valign: 'middle', 
        fillColor: PDF_COLORS.WHITE, 
        textColor: PDF_COLORS.BLACK 
      },
      4: { 
        halign: 'center', 
        valign: 'middle', 
        fillColor: PDF_COLORS.WHITE, 
        textColor: PDF_COLORS.BLACK 
      },
      5: { 
        halign: 'center', 
        valign: 'middle', 
        fillColor: PDF_COLORS.WHITE, 
        textColor: PDF_COLORS.BLACK 
      },
      6: { 
        halign: 'center', 
        valign: 'middle', 
        fillColor: PDF_COLORS.WHITE, 
        textColor: PDF_COLORS.BLACK 
      },
      ...(isDevelopOthers ? {
        7: { 
          halign: 'center', 
          valign: 'middle', 
          fillColor: PDF_COLORS.WHITE, 
          textColor: PDF_COLORS.WHITE 
        }
      } : {}),
    },
    didParseCell: (hookData: any) => {
      // Appliquer le style de la catégorie à l'en-tête de la première colonne
      if (hookData.section === 'head' && hookData.column.index === 0) {
        hookData.cell.styles.fillColor = categoryInfo.color;
        hookData.cell.styles.textColor = PDF_COLORS.WHITE;
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.halign = 'center';
        hookData.cell.styles.fontSize = 9;
      }
      
      // Colorer les cellules de la colonne "Catégorie" (colonne 7) pour "Développement des autres"
      if (isDevelopOthers && hookData.section === 'body' && hookData.column.index === 7) {
        const cellValue = hookData.cell.raw;
        
        // Définir les couleurs selon la catégorie
        const categoryColors: Record<string, { bg: [number, number, number], text: [number, number, number] }> = {
          'POSITION': { bg: [244, 67, 54], text: [255, 255, 255] }, // Rouge
          'PERMISSION': { bg: [255, 193, 7], text: [0, 0, 0] }, // Jaune
          'PRODUCTION': { bg: [76, 175, 80], text: [255, 255, 255] }, // Vert
          'PINNACLE': { bg: [33, 150, 243], text: [255, 255, 255] }, // Bleu
        };
        
        if (cellValue && categoryColors[cellValue]) {
          hookData.cell.styles.fillColor = categoryColors[cellValue].bg;
          hookData.cell.styles.textColor = categoryColors[cellValue].text;
          hookData.cell.styles.fontStyle = 'bold';
          hookData.cell.styles.fontSize = 7;
        }
      }
    },
    willDrawPage: (hookData: any) => {
      // Log pour déboguer
      if (hookData.pageNumber > 1) {
        console.log(`📄 Table will draw on page ${hookData.pageNumber}`);
      }
    },
  });
  
    currentY = (pdf as any).lastAutoTable.finalY + 10;
  });

  console.log(`📊 All ${chunks.length} table chunks created for ${category.category}`);
  
  return currentY;
}

/**
 * Affiche le texte de l'échelle de notation en bas du tableau
 * @param pdf - Instance jsPDF
 * @param pageWidth - Largeur de la page
 * @param margin - Marge de la page
 * @param yPosition - Position Y actuelle
 * @returns Nouvelle position Y après l'affichage
 */
export function displayRatingScale(
  pdf: jsPDF,
  pageWidth: number,
  margin: number,
  yPosition: number
): number {
  pdf.setFontSize(PDF_FONT_SIZES.BODY);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const scaleText = '1 = Très fortement en désaccord | 2 = Fortement en désaccord | 3 = En désaccord | 4 = Ni en accord ni en désaccord | 5 = En accord | 6 = Fortement en accord | 7 = Très en accord | 8 = Très en accord';
  const splitScaleText = pdf.splitTextToSize(scaleText, pageWidth - 2 * margin);
  pdf.text(splitScaleText, margin, yPosition);
  
  return yPosition + splitScaleText.length * 4 + 5;
}

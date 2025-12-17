import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CategoryReport, CategoryInfo } from './pdfTypes';
import { formatScore } from './pdfHelpers';
import { PDF_COLORS } from './pdfStyles';
import { addPageHeader, addPageFooter } from './pdfPages';

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
  isFirstCategory: boolean
): void {
  // Nouvelle page pour chaque catégorie (sauf la première qui suit la page 4)
  if (!isFirstCategory) {
    pdf.addPage();
    const currentPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
    addPageHeader(pdf, logoCouleursDataUrl, currentPage, pageWidth);
  }
  
  let yPosition = 50;
  const categoryLabel = categoryInfo.name || category.category || 'Sans catégorie';
  
  // Calculer la moyenne générale de la catégorie
  let categoryAverage = 0;
  if (category.questions && category.questions.length > 0) {
    const sum = category.questions.reduce((acc, q) => acc + (q.overallAverage || 0), 0);
    categoryAverage = sum / category.questions.length;
  }

  // Bandeau de titre de la catégorie avec couleur spécifique
  pdf.setFillColor(categoryInfo.color[0], categoryInfo.color[1], categoryInfo.color[2]);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(categoryInfo.textColor[0], categoryInfo.textColor[1], categoryInfo.textColor[2]);
  pdf.text(categoryLabel.toUpperCase(), margin + 5, yPosition + 8);
  
  yPosition += 18;
  
  // Moyenne générale
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Moyenne générale ${categoryAverage.toFixed(1)}`, margin, yPosition);
  yPosition += 8;
  
  // Texte explicatif
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const explanationText = `Le troisième niveau de leadership consiste à obtenir des résultats avec une équipe. Toute organisation, et donc tout leader, doit obtenir des résultats afin de se développer et de grandir. Les comportements axés sur les résultats comprennent la définition de la vision, la réflexion stratégique, la prise de décisions et le lancement d'actions pour réaliser cette vision. Produire des résultats au niveau de la production signifie définir des résultats responsables. A ce niveau, les autres vous suivent en raison de ce que vous avez fait pour l'organisation.`;
  
  const splitText = pdf.splitTextToSize(explanationText, pageWidth - 2 * margin);
  pdf.text(splitText, margin, yPosition);
  yPosition += splitText.length * 4 + 8;
  
  // Encadré "PRODUCTION SCORES *"
  pdf.setFillColor(220, 220, 220);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text(`${categoryLabel.toUpperCase()} SCORES *`, pageWidth / 2, yPosition + 7, { align: 'center' });
  yPosition += 15;
  
  // Calculer les moyennes par type d'évaluateur pour la catégorie
  const avgByType: Record<string, number> = {
    COLLABORATEUR_DIRECT: 0,
    MANAGER_DIRECT: 0,
    COLLEGUE: 0,
    RH: 0,
    CANDIDAT: 0,
  };
  
  if (category.questions && category.questions.length > 0) {
    Object.keys(avgByType).forEach((type) => {
      const sum = category.questions.reduce((acc, q) => acc + (q.averagesByEvaluatorType[type] || 0), 0);
      avgByType[type] = sum / category.questions.length;
    });
  }
  
  // Graphique des scores (barres horizontales)
  const evaluatorTypes = [
    { label: 'Overall', value: categoryAverage, showValue: true },
    { label: 'Direct Reports', value: avgByType.COLLABORATEUR_DIRECT, showValue: true },
    { label: 'Manager', value: avgByType.MANAGER_DIRECT, showValue: true },
    { label: 'Peer', value: avgByType.COLLEGUE, showValue: true },
    { label: 'Others', value: avgByType.RH, showValue: true },
    { label: 'Self', value: avgByType.CANDIDAT, showValue: false },
  ];
  
  const barMaxWidth = 120;
  const barStartX = margin + 45;
  
  evaluatorTypes.forEach((item, idx) => {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...PDF_COLORS.BLACK);
    pdf.text(item.label, barStartX - 3, yPosition + 3, { align: 'right' });
    
    // Valeur à gauche de la barre
    if (item.showValue) {
      pdf.text(`|${item.value.toFixed(1)}`, barStartX + 2, yPosition + 3);
    }
    
    // Lignes verticales de grille (0, 1, 2, 3, 4, 5, 6, 7)
    if (idx === 0) {
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      for (let i = 0; i <= 7; i++) {
        const x = barStartX + 10 + (i * barMaxWidth / 7);
        pdf.line(x, yPosition - 2, x, yPosition + (evaluatorTypes.length * 7) + 5);
      }
    }
    
    // Barre de valeur (noire pour Self, grise pour les autres)
    const barWidth = (item.value / 7) * barMaxWidth;
    if (idx === evaluatorTypes.length - 1) {
      // Barre noire pour "Self"
      pdf.setFillColor(...PDF_COLORS.BLACK);
    } else {
      // Barre grise claire pour les autres
      pdf.setFillColor(180, 180, 180);
    }
    pdf.rect(barStartX + 10, yPosition - 1, barWidth, 5, 'F');
    
    // Valeur à droite de la barre pour Self
    if (!item.showValue && item.value > 0) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${item.value.toFixed(1)}`, barStartX + 10 + barWidth + 2, yPosition + 3);
    }
    
    yPosition += 7;
  });
  
  // Légende de l'échelle
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  for (let i = 0; i <= 7; i++) {
    const x = barStartX + 10 + (i * barMaxWidth / 7);
    pdf.text(`${i}`, x - 1, yPosition + 3);
  }
  
  yPosition += 8;
  
  // Note explicative
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const noteText = `Le tableau montre chacun des éléments de cette catégorie, classés de la note la plus élevée à la note la plus basse sur la base de l'ensemble des participants.`;
  const splitNote = pdf.splitTextToSize(noteText, pageWidth - 2 * margin);
  pdf.text(splitNote, margin, yPosition);
  yPosition += splitNote.length * 4 + 5;
  
  // Titre du tableau
  pdf.setFillColor(categoryInfo.color[0], categoryInfo.color[1], categoryInfo.color[2]);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(categoryInfo.textColor[0], categoryInfo.textColor[1], categoryInfo.textColor[2]);
  pdf.text(categoryLabel.toUpperCase(), pageWidth / 2, yPosition + 7, { align: 'center' });
  yPosition += 10;

  // Si la catégorie a des questions
  if (category.questions && category.questions.length > 0) {
    // Créer le tableau avec les vraies données
    const tableData = category.questions.map((question, idx) => {
      return [
        `${idx + 1}`,
        question.questionText,
        formatScore(question.overallAverage),
        formatScore(question.averagesByEvaluatorType.COLLABORATEUR_DIRECT),
        formatScore(question.averagesByEvaluatorType.MANAGER_DIRECT),
        formatScore(question.averagesByEvaluatorType.COLLEGUE),
        formatScore(question.averagesByEvaluatorType.RH),
        formatScore(question.averagesByEvaluatorType.CANDIDAT),
      ];
    });

    const tableStartY = yPosition;

    autoTable(pdf, {
      startY: tableStartY,
      head: [[
        '',
        '',
        'Moyen-\nne\ngéné-\nrale',
        'Collab\no-\nrateur\ns\nDirects',
        'Manag\ner\nDirect',
        'Pairs',
        'Autre\ns',
        'Soi',
      ]],
      body: tableData,
      theme: 'plain',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2,
        lineColor: [200, 200, 200],
        lineWidth: 0.3,
        textColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [60, 60, 60],
        textColor: [255, 255, 255],
        fontStyle: 'normal',
        fontSize: 7,
        halign: 'center',
        valign: 'middle',
        lineWidth: 0.3,
        lineColor: [200, 200, 200],
      },
      bodyStyles: {
        fontSize: 8,
        minCellHeight: 8,
        textColor: [0, 0, 0],
        lineWidth: 0.3,
        lineColor: [200, 200, 200],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center', valign: 'middle', fillColor: [255, 255, 255] },
        1: { cellWidth: 80, halign: 'left', valign: 'middle', fillColor: [255, 255, 255] },
        2: { cellWidth: 20, halign: 'center', valign: 'middle', fillColor: [60, 60, 60], textColor: [255, 255, 255] },
        3: { cellWidth: 20, halign: 'center', valign: 'middle', fillColor: [60, 60, 60], textColor: [255, 255, 255] },
        4: { cellWidth: 20, halign: 'center', valign: 'middle', fillColor: [60, 60, 60], textColor: [255, 255, 255] },
        5: { cellWidth: 20, halign: 'center', valign: 'middle', fillColor: [60, 60, 60], textColor: [255, 255, 255] },
        6: { cellWidth: 20, halign: 'center', valign: 'middle', fillColor: [60, 60, 60], textColor: [255, 255, 255] },
        7: { cellWidth: 20, halign: 'center', valign: 'middle', fillColor: [60, 60, 60], textColor: [255, 255, 255] },
      },
      margin: { left: margin, right: margin },
      didDrawPage: (hookData: any) => {
        if (hookData.pageNumber > 1) {
          const currentPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
          addPageHeader(pdf, logoCouleursDataUrl, currentPage, pageWidth);
        }
      },
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 10;
  } else {
    // Pas de questions pour cette catégorie
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Aucune question pour cette catégorie', margin + 5, yPosition);
    yPosition += 15;
  }
  
  // Bas de page
  addPageFooter(pdf, pageWidth, pageHeight);
}

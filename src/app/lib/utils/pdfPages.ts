import jsPDF from 'jspdf';
import type { ReportData } from './pdfTypes';
import { PDF_COLORS } from './pdfStyles';

/**
 * Ajoute le logo et la boîte jaune sur une page
 */
export function addPageHeader(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  pageNumber: number,
  pageWidth: number,
  candidatName?: string
): void {
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo en haut à gauche
  if (logoCouleursDataUrl) {
    pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, 60, 24);
  }
  
  // Nom du candidat et numéro de page en haut à droite (sans fond)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const displayName = candidatName || 'Nom du candidat';
  pdf.text(`${displayName} P ${pageNumber}`, pageWidth - 45, 20, { align: 'center' });
}

/**
 * Ajoute le footer sur une page
 */
export function addPageFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number
): void {
  // Bas de page vide - texte supprimé
}

/**
 * Crée la page de couverture
 */
export function createCoverPage(
  pdf: jsPDF,
  data: ReportData,
  logoCouleursDataUrl: string,
  logoDataUrl: string,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo couleurs MADABEL en haut à gauche
  if (logoCouleursDataUrl) {
    try {
      const logoWidth = 60;
      const logoHeight = 24;
      pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, logoWidth, logoHeight);
    } catch (e) {
      console.warn('Erreur logo couleurs couverture:', e);
    }
  }
  
  // Nom du candidat en haut à droite (sans fond)
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  const candidatDisplayNameHeader = data.candidatName || 'Nom du candidat';
  pdf.text(candidatDisplayNameHeader, pageWidth - 47.5, 21, { align: 'center' });
  
  // Cadre gris foncé avec "Préparé pour" et nom du candidat
  pdf.setFillColor(...PDF_COLORS.BLUE_GREY);
  pdf.roundedRect(margin + 10, 50, pageWidth - 2 * (margin + 10), 35, 2, 2, 'F');
  
  // Bordure blanche autour du cadre
  pdf.setDrawColor(...PDF_COLORS.WHITE);
  pdf.setLineWidth(1);
  pdf.roundedRect(margin + 10, 50, pageWidth - 2 * (margin + 10), 35, 2, 2, 'S');
  
  // Texte blanc "Préparé pour"
  pdf.setTextColor(...PDF_COLORS.WHITE);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Préparé pour', pageWidth / 2, 65, { align: 'center' });
  
  // Nom du candidat en blanc gras
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const candidatDisplayName = data.candidatName || 'Nom du candidat';
  pdf.text(candidatDisplayName, pageWidth / 2, 78, { align: 'center' });
  
  // Logo EMOTIONAL INTELLIGENCE (Logo-360.png)
  const centerX = pageWidth / 2;
  const centerY = 135;
  
  if (logoDataUrl) {
    try {
      const logoEQWidth = 70;
      const logoEQHeight = 70;
      pdf.addImage(logoDataUrl, 'PNG', centerX - logoEQWidth / 2, centerY - logoEQHeight / 2, logoEQWidth, logoEQHeight);
    } catch (e) {
      console.warn('Erreur logo EQ:', e);
    }
  }
  
  // Date de création
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Créé le date en ${currentDate}`, centerX, pageHeight - 60, { align: 'center' });
}

/**
 * Crée la deuxième page (page de transition)
 */
export function createTransitionPage(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  pageWidth: number,
  pageHeight: number,
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
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  const displayName = candidatName || 'Nom du candidat';
  pdf.text(`${displayName} P 2`, pageWidth - 47.5, 21, { align: 'center' });
}

/**
 * Crée la page de conclusion
 */
export function createConclusionPage(
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
  const conclusionPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const displayName = candidatName || 'Nom du candidat';
  pdf.text(`${displayName} P ${conclusionPage}`, pageWidth - 45, 20, { align: 'center' });
  
  let yPosition = 50;

  // Section Conclusion
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('Conclusion', margin, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const conclusionText = [
    'Ce rapport 360° offre une vision complète des compétences du candidat évalué à travers les',
    'différentes perspectives de son environnement professionnel.',
    '',
    'Les résultats permettent d\'identifier :',
    '',
    '  • Les points forts sur lesquels s\'appuyer',
    '  • Les axes d\'amélioration à travailler',
    '  • Les écarts de perception entre l\'auto-évaluation et les évaluations externes',
    '',
    'Il est recommandé d\'utiliser ce rapport comme base de discussion lors d\'un entretien de',
    'développement professionnel avec le candidat évalué. L\'objectif est de construire ensemble un',
    'plan d\'action personnalisé pour favoriser la progression des compétences.',
    '',
    '',
    'Ce document est confidentiel et destiné uniquement aux personnes habilitées dans le cadre',
    'du processus d\'évaluation.',
  ];

  conclusionText.forEach((line) => {
    pdf.text(line, margin, yPosition);
    yPosition += 5;
  });
}

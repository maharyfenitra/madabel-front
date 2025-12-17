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
  pageWidth: number
): void {
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo en haut à gauche
  if (logoCouleursDataUrl) {
    pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, 60, 24);
  }
  
  // Boîte jaune en haut à droite avec numéro de page
  pdf.setFillColor(...PDF_COLORS.YELLOW_BOX);
  pdf.roundedRect(pageWidth - 80, 10, 70, 15, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text(`Nom du candidat au test P ${pageNumber}`, pageWidth - 45, 20, { align: 'center' });
}

/**
 * Ajoute le footer sur une page
 */
export function addPageFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number
): void {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('MADABEL Leadership Transformation', pageWidth - 20, pageHeight - 15, { align: 'right' });
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
  
  // "Nom du candidat au test !" en jaune en haut à droite
  pdf.setFillColor(255, 255, 0);
  pdf.rect(pageWidth - 75, 15, 55, 10, 'F');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Nom du candidat au test ?', pageWidth - 47.5, 21, { align: 'center' });
  
  // Cadre gris foncé avec "Prepared for" et nom du candidat
  pdf.setFillColor(...PDF_COLORS.BLUE_GREY);
  pdf.roundedRect(margin + 10, 50, pageWidth - 2 * (margin + 10), 35, 2, 2, 'F');
  
  // Bordure blanche autour du cadre
  pdf.setDrawColor(...PDF_COLORS.WHITE);
  pdf.setLineWidth(1);
  pdf.roundedRect(margin + 10, 50, pageWidth - 2 * (margin + 10), 35, 2, 2, 'S');
  
  // Texte blanc "Prepared for"
  pdf.setTextColor(...PDF_COLORS.WHITE);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Prepared for', pageWidth / 2, 65, { align: 'center' });
  
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
  
  // Texte explicatif sous le logo
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('Intelligence Émotionnelle (IE) : Confiance', margin, centerY + 50, { maxWidth: pageWidth - 2 * margin });
  pdf.text('Donne des résultats : Cultive les relations : Développe les autres', margin, centerY + 56, { maxWidth: pageWidth - 2 * margin });
  
  // Date de création
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Créé le date en ${currentDate}`, centerX, pageHeight - 60, { align: 'center' });
  
  // Bas de page
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('MADABEL Leadership Transformation', pageWidth - 20, pageHeight - 15, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.text('MADABEL, Leadership Transformation', pageWidth / 2, pageHeight - 15, { align: 'center' });
}

/**
 * Crée la deuxième page (page de transition)
 */
export function createTransitionPage(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  pageWidth: number,
  pageHeight: number
): void {
  pdf.addPage();
  
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo en haut à gauche
  if (logoCouleursDataUrl) {
    pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, 60, 24);
  }
  
  // Boîte jaune en haut à droite
  pdf.setFillColor(255, 255, 0);
  pdf.rect(pageWidth - 75, 15, 55, 10, 'F');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Nom du candidat au test P 2', pageWidth - 47.5, 21, { align: 'center' });
  
  // Bas de page
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('MADABEL Leadership Transformation', pageWidth - 20, pageHeight - 15, { align: 'right' });
}

/**
 * Crée la troisième page (Introduction)
 */
export function createIntroductionPage(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  logoDataUrl: string,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  pdf.addPage();
  
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo en haut à gauche
  if (logoCouleursDataUrl) {
    pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, 60, 24);
  }
  
  // Boîte jaune en haut à droite
  pdf.setFillColor(255, 255, 0);
  pdf.rect(pageWidth - 75, 15, 55, 10, 'F');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Nom du candidat au test P 3', pageWidth - 47.5, 21, { align: 'center' });
  
  let yPosition = 50;
  
  // Bandeau gris "INTRODUCTION"
  pdf.setFillColor(60, 60, 60);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.WHITE);
  pdf.text('INTRODUCTION', margin + 5, yPosition + 8);
  yPosition += 18;
  
  // Ligne avec mots colorés
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // "Production," en vert
  pdf.setTextColor(...PDF_COLORS.GREEN);
  pdf.text('Production, ', margin + 5, yPosition);
  
  // "Permission," en jaune foncé
  pdf.setTextColor(...PDF_COLORS.YELLOW);
  pdf.text('Permission, ', margin + 32, yPosition);
  
  // "Pinnacle" en bleu
  pdf.setTextColor(...PDF_COLORS.BLUE);
  pdf.text('Pinnacle ', margin + 62, yPosition);
  
  // "-, Position, Développement des autres)." en noir
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('-, Position, Développement des autres).', margin + 82, yPosition);
  yPosition += 15;
  
  // Logo EQ centré
  const centerX = pageWidth / 2;
  if (logoDataUrl) {
    try {
      const logoEQWidth = 60;
      const logoEQHeight = 60;
      pdf.addImage(logoDataUrl, 'PNG', centerX - logoEQWidth / 2, yPosition, logoEQWidth, logoEQHeight);
      yPosition += logoEQHeight + 10;
    } catch (e) {
      console.warn('Erreur logo EQ:', e);
    }
  }
  
  // Boîte grise
  pdf.setFillColor(220, 220, 220);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
  yPosition += 15;
  
  // Paragraphes explicatifs
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  const explanationTexts = [
    'Lisez attentivement tous les en-têtes. Les informations figurant ci-dessus et dans les en-',
    'têtes de chaque section vous aideront à tirer le meilleur parti de votre rapport. Nous vous',
    'encourageons à l\'étudier attentivement du début à la fin, sans sauter les explications.',
    '',
    'Restez ouvert aux commentaires. Votre attitude à l\'égard des informations contenues dans',
    'le rapport et cruciale pour la façon dont vous les recevez et les utilisez.',
    '',
    'Vous aurez des éléments de retour très positifs ; réfléchissez à la manière dont vous pouvez',
    'continuer à vous appuyer sur ces points forts.',
    '',
    'De même, vous aurez quelques commentaires constructifs dans votre rapport.',
    'N\'oubliez pas que les commentaires constructifs sont toujours blessants. Notre ego a',
    'tendance à être sensible et la moindre critique peut blesser. Attendez-vous à ce choc et',
    'rappelez-vous que c\'est normal. Évitez d\'être sur la défensive en reconnaissant qu\'il n\'y a',
    'pas de leaders parfaits.',
  ];
  
  explanationTexts.forEach((line) => {
    pdf.text(line, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
    yPosition += 5;
  });
  
  // Bas de page pour la page 3
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('MADABEL Leadership Transformation', pageWidth - 20, pageHeight - 15, { align: 'right' });
}

/**
 * Crée la quatrième page (Format du rapport)
 */
export function createFormatPage(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  pdf.addPage();
  
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo en haut à gauche
  if (logoCouleursDataUrl) {
    pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, 60, 24);
  }
  
  // Boîte jaune en haut à droite avec numéro de page
  pdf.setFillColor(...PDF_COLORS.YELLOW_BOX);
  pdf.roundedRect(pageWidth - 80, 10, 70, 15, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('Nom du candidat au test P 4', pageWidth - 45, 20, { align: 'center' });
  
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
  
  // "Production," en vert
  pdf.setTextColor(...PDF_COLORS.GREEN);
  pdf.text('•Production, ', margin + 5, yPosition);
  
  // "Permission," en jaune foncé
  pdf.setTextColor(...PDF_COLORS.YELLOW);
  pdf.text('Permission, ', margin + 32, yPosition);
  
  // "Pinnacle" en bleu
  pdf.setTextColor(...PDF_COLORS.BLUE);
  pdf.text('Pinnacle ', margin + 62, yPosition);
  
  // "( Soi, Position, Développement des autres)" en noir
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('( Soi, Position, Développement des autres)', margin + 82, yPosition);
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
  
  // Texte "0 de 0 (repères les points)" en rouge
  pdf.setTextColor(255, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('0 de 0 (repères les points)', margin, yPosition);
  yPosition += 8;
  
  // Liste avec puces
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('• 0 de 0 Collaborateurs directs', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('• 0 de 0 Manager Direct', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('• 0 de 0 Pair / Associé', margin + 5, yPosition);
  yPosition += 6;
  pdf.text('• 0 de 0 Autres', margin + 5, yPosition);
  yPosition += 10;
  
  // Bas de page pour la page 4
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('MADABEL Leadership Transformation', pageWidth - 20, pageHeight - 15, { align: 'right' });
}

/**
 * Crée la page de conclusion
 */
export function createConclusionPage(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  pdf.addPage();
  
  // Fond blanc
  pdf.setFillColor(...PDF_COLORS.WHITE);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo en haut à gauche
  if (logoCouleursDataUrl) {
    pdf.addImage(logoCouleursDataUrl, 'WEBP', 30, 15, 60, 24);
  }
  
  // Boîte jaune en haut à droite avec numéro de page
  const conclusionPage = (pdf.internal as any).getCurrentPageInfo().pageNumber;
  pdf.setFillColor(...PDF_COLORS.YELLOW_BOX);
  pdf.roundedRect(pageWidth - 80, 10, 70, 15, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text(`Nom du candidat au test P ${conclusionPage}`, pageWidth - 45, 20, { align: 'center' });
  
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

  // Bas de page
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('MADABEL Leadership Transformation', pageWidth - 20, pageHeight - 15, { align: 'right' });
}

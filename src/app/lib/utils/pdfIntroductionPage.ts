import jsPDF from 'jspdf';
import { PDF_COLORS } from './pdfStyles';

/**
 * Crée la troisième page (Introduction)
 */
export function createIntroductionPage(
  pdf: jsPDF,
  logoCouleursDataUrl: string,
  logoDataUrl: string,
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
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  const displayName = candidatName || 'Nom du candidat';
  pdf.text(`${displayName} P 3`, pageWidth - 47.5, 21, { align: 'center' });
  
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
  
  // "Pinnacle," en bleu
  pdf.setTextColor(...PDF_COLORS.BLUE);
  pdf.text('Pinnacle, ', margin + 62, yPosition);
  
  // "Position." en noir
  pdf.setTextColor(...PDF_COLORS.BLACK);
  pdf.text('Position.', margin + 88, yPosition);
  yPosition += 15;
  
  // Logo EQ centré
  const centerX = pageWidth / 2;
  if (logoDataUrl) {
    try {
      const logoEQWidth = 60;
      const logoEQHeight = 60;
      pdf.addImage(logoDataUrl, 'PNG', centerX - logoEQWidth / 2, yPosition, logoEQWidth, logoEQHeight);
      yPosition += logoEQHeight + 5;
    } catch (e) {
      console.warn('Erreur logo EQ:', e);
    }
  }
  
  // Texte sous le logo
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...PDF_COLORS.BLACK);
  const textUnderLogo = [
    'Intelligence Émotionnelle (IE)- Confiance',
    'Donne des résultats - Cultive les relations - Développe les autres'
  ];
  textUnderLogo.forEach((line) => {
    pdf.text(line, margin, yPosition);
    yPosition += 5;
  });
  yPosition += 5;
  
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
  
  // Bas de page pour la page 3 vide
}

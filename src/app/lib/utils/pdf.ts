import jsPDF from 'jspdf';
import type { ReportData } from './pdfTypes';
import { loadImage } from './pdfHelpers';
import { CATEGORY_DATA } from './pdfStyles';
import {
  createCoverPage,
  createTransitionPage,
  createConclusionPage,
} from './pdfPages';
import { createIntroductionPage } from './pdfIntroductionPage';
import { createFormatPage } from './pdfFormatPage';
import { createCategoryPage } from './pdfCategoryPage';
import { createPinnacleSummaryPage } from './pdfPinnacleSummary';
import { createOpenQuestionsPage } from './pdfOpenQuestions';
import { createReflectionPage } from './pdfReflectionPage';
import { createLeadershipSummaryPage } from './pdfLeadershipSummary';

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
  createTransitionPage(pdf, logoCouleursDataUrl, pageWidth, pageHeight, data.candidatName);

  // PAGE 3 - Introduction
  createIntroductionPage(pdf, logoCouleursDataUrl, logoDataUrl, pageWidth, pageHeight, margin, data.candidatName);

  // PAGE 4 - Format du rapport
  createFormatPage(pdf, logoCouleursDataUrl, pageWidth, pageHeight, margin, data.candidatName);

  // PAGES 5+ - Catégories - TOUJOURS afficher toutes les catégories dans l'ordre fixe
  // Sauvegarder la catégorie AUTRE avant de la filtrer pour les questions ouvertes
  console.log('🔵 Total categories in data.report:', data.report.length);
  console.log('🔵 Categories:', data.report.map((c: any) => c.category).join(', '));
  
  const autreCategory = (data.report || []).find(c => c.category === 'AUTRE');
  console.log('🔵 Found AUTRE category:', autreCategory ? 'YES' : 'NO');
  if (autreCategory) {
    console.log('🔵 AUTRE category questions:', autreCategory.questions.length);
    console.log('🔵 AUTRE questions types:', autreCategory.questions.map((q: any) => q.questionType).join(', '));
  }
  
  // Filtrer la catégorie AUTRE qui ne doit pas apparaître dans les pages de catégories
  const reportCategories = (data.report || []).filter(c => c.category !== 'AUTRE');
  
  // Liste fixe des catégories à afficher dans l'ordre
  const FIXED_CATEGORIES = ['PRODUCTION', 'PERMISSION', 'PINNACLE', 'POSITION'];
  
  for (let catIndex = 0; catIndex < FIXED_CATEGORIES.length; catIndex++) {
    const categoryName = FIXED_CATEGORIES[catIndex];
    
    // Trouver les données de cette catégorie (ou créer un objet vide si pas de données)
    const categoryData = reportCategories.find(c => c.category === categoryName) || {
      category: categoryName,
      questions: []
    };
    
    // Traitement spécial pour PINNACLE : ne pas créer de page principale, seulement la page sommaire
    if (categoryName === 'PINNACLE') {
      console.log('🔵 Skipping main PINNACLE page, will create summary page after PERMISSION');
      continue; // Skip la création de la page principale PINNACLE
    }
    
    // Trouver categoryInfo par nom
    const categoryInfo = CATEGORY_DATA.find(c => c.name === categoryName) || CATEGORY_DATA[0];
    
    createCategoryPage(
      pdf,
      categoryData,
      categoryInfo,
      logoCouleursDataUrl,
      pageWidth,
      pageHeight,
      margin,
      catIndex === 0, // isFirstCategory
      data.candidatName
    );
    
    // Après PERMISSION, insérer TOUJOURS la page sommaire Pinnacle-Soi et Pinnacle-Autres
    if (categoryName === 'PERMISSION') {
      console.log('🔵 Creating Pinnacle summary page after PERMISSION');
      
      // Trouver la catégorie PINNACLE pour extraire les sous-questions (ou utiliser tableau vide)
      const pinnacleCategory = reportCategories.find(c => c.category === 'PINNACLE') || {
        category: 'PINNACLE',
        questions: []
      };
      
      console.log('🔵 Found Pinnacle category:', pinnacleCategory ? 'YES' : 'NO');
      console.log('🔵 Pinnacle questions count:', pinnacleCategory?.questions.length || 0);
      
      // Extraire les questions SOI et AUTRES (ou tableaux vides si pas de catégorie PINNACLE)
      const soiQuestions = pinnacleCategory ? pinnacleCategory.questions.filter(q => q.subcategory === 'SOI') : [];
      const autresQuestions = pinnacleCategory ? pinnacleCategory.questions.filter(q => q.subcategory === 'AUTRES') : [];

      console.log('🔵 SOI questions:', soiQuestions.length);
      console.log('🔵 AUTRES questions:', autresQuestions.length);
      console.log('🔵 Calling createPinnacleSummaryPage...');
      
      // Toujours créer la page sommaire, même sans questions
      createPinnacleSummaryPage(
        pdf,
        soiQuestions,
        autresQuestions,
        logoCouleursDataUrl,
        pageWidth,
        pageHeight,
        margin,
        data.candidatName
      );
      
      console.log('🔵 Pinnacle summary page created successfully');
      
      // Créer uniquement la page détaillée pour Pinnacle-Soi (Pinnacle-Autres sera créée après POSITION)
      console.log('🔵 Creating detailed page for Pinnacle-Soi');
      console.log('🔵 Total Pinnacle questions:', pinnacleCategory?.questions.length || 0);
      
      // Log toutes les subcategories pour debugging
      if (pinnacleCategory && pinnacleCategory.questions) {
        pinnacleCategory.questions.forEach((q, idx) => {
          console.log(`🔵 Question ${idx + 1} subcategory:`, q.subcategory);
        });
      }
      
      const soiQuestionsDetailed = pinnacleCategory ? pinnacleCategory.questions.filter(q => q.subcategory === 'SOI') : [];

      console.log('🔵 Filtered SOI questions:', soiQuestionsDetailed.length);

      // Page détaillée pour Pinnacle-Soi (toujours créée)
      console.log('🔵 Creating Pinnacle-Soi detailed page...');
      const soiCategory = {
        category: 'Pinnacle-Soi',
        questions: soiQuestionsDetailed,
      };
      const soiInfo = {
        name: 'Pinnacle-Soi',
        color: [33, 150, 243] as [number, number, number],
        textColor: [255, 255, 255] as [number, number, number],
      };
      createCategoryPage(pdf, soiCategory, soiInfo, logoCouleursDataUrl, pageWidth, pageHeight, margin, false, data.candidatName);
      console.log('🔵 Pinnacle-Soi detailed page created');
    }
  }

  // Créer les pages finales (toujours affichées, sans condition)
  
  // Créer la page détaillée Pinnacle-Autres (toujours affichée)
  console.log('🔵 Creating Pinnacle-Autres detailed page...');
  const pinnacleCategory = reportCategories.find(c => c.category === 'PINNACLE') || {
    category: 'PINNACLE',
    questions: []
  };
  
  const autresQuestionsDetailed = pinnacleCategory.questions.filter(q => q.subcategory === 'AUTRES');
  console.log('🔵 Filtered AUTRES questions:', autresQuestionsDetailed.length);

  const autresCategory = {
    category: 'Pinnacle-Autres',
    questions: autresQuestionsDetailed,
  };
  const autresInfo = {
    name: 'Pinnacle-Autres',
    color: [33, 150, 243] as [number, number, number],
    textColor: [255, 255, 255] as [number, number, number],
  };
  createCategoryPage(pdf, autresCategory, autresInfo, logoCouleursDataUrl, pageWidth, pageHeight, margin, false, data.candidatName);
  console.log('🔵 Pinnacle-Autres detailed page created');
  
  // Créer la page "Développement des autres" avec toutes les questions où developOthers === true
  console.log('🔵 Creating Développement des autres page...');
  
  // Collecter toutes les questions avec developOthers === true de toutes les catégories
  const developOthersQuestions: any[] = [];
  reportCategories.forEach(cat => {
    if (cat.questions) {
      const filteredQuestions = cat.questions.filter((q: any) => q.developOthers === true);
      // Ajouter la catégorie d'origine à chaque question
      const questionsWithCategory = filteredQuestions.map((q: any) => ({
        ...q,
        category: cat.category, // Catégorie d'origine
      }));
      developOthersQuestions.push(...questionsWithCategory);
    }
  });
  
  console.log('🔵 Total developOthers questions:', developOthersQuestions.length);
  
  // Créer la page avec une couleur violette distincte
  const developOthersCategory = {
    category: 'DÉVELOPPEMENT DES AUTRES',
    questions: developOthersQuestions,
  };
  const developOthersInfo = {
    name: 'DÉVELOPPEMENT DES AUTRES',
    color: [103, 58, 183] as [number, number, number], // Violet/Indigo
    textColor: [255, 255, 255] as [number, number, number],
  };
  createCategoryPage(pdf, developOthersCategory, developOthersInfo, logoCouleursDataUrl, pageWidth, pageHeight, margin, false, data.candidatName);
  console.log('🔵 Développement des autres page created');
  
  // Créer la page des questions ouvertes avec les questions AUTRE de type TEXT
  console.log('🔵 Creating Questions ouvertes page...');
  
  // Utiliser la catégorie AUTRE sauvegardée avant le filtrage
  const openQuestions = autreCategory && autreCategory.questions 
    ? autreCategory.questions
        .filter((q: any) => {
          console.log('🔵 Question type check:', q.questionType, 'TEXT?', q.questionType === 'TEXT');
          return q.questionType === 'TEXT';
        })
        .map((q: any) => ({ 
          text: q.questionText, 
          type: q.questionType,
          textAnswers: q.textAnswers || []
        }))
    : [];
  
  console.log('🔵 Found open questions (AUTRE + TEXT):', openQuestions.length);
  if (openQuestions.length > 0) {
    console.log('🔵 Open questions:', openQuestions.map(q => `${q.text.substring(0, 50)} (${q.textAnswers?.length || 0} answers)`).join(' | '));
  }
  
  // Toujours créer la page, même s'il n'y a pas de questions
  createOpenQuestionsPage(pdf, openQuestions, logoCouleursDataUrl, pageWidth, pageHeight, margin, data.candidatName);
  console.log('🔵 Questions ouvertes page created');
  
  // Créer la page de réflexion
  console.log('🔵 Creating Reflection page...');
  createReflectionPage(pdf, reportCategories, logoCouleursDataUrl, pageWidth, pageHeight, margin, data.candidatName);
  console.log('🔵 Reflection page created');
  
  // Créer la page de résumé des attributs de leadership (à la fin)
  console.log('🔵 Creating Leadership Summary page...');
  createLeadershipSummaryPage(pdf, reportCategories, logoCouleursDataUrl, pageWidth, pageHeight, margin, data.candidatName);
  console.log('🔵 Leadership Summary page created');

  // TÃ©lÃ©charger le PDF
  const fileName = `rapport-360-${data.evaluationRef || 'evaluation'}.pdf`;
  pdf.save(fileName);
}


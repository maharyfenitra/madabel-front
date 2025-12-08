import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type CategoryReport = {
  category: string;
  questions: Array<{
    questionId: number;
    questionText: string;
    questionType: string;
    overallAverage: number | null;
    averagesByEvaluatorType: Record<string, number>;
    totalEvaluators: number;
    answeredEvaluators: number;
  }>;
};

type ReportData = {
  evaluationRef: string;
  candidatName?: string;
  deadline: string;
  report: CategoryReport[];
};

/**
 * Génère un PDF à partir des données du rapport d'évaluation
 */
export async function generateReportPDF(data: ReportData): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'landscape', // Paysage pour avoir plus d'espace pour les tableaux
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Fonction pour ajouter une nouvelle page si nécessaire
  const checkAddPage = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // En-tête du rapport
  pdf.setFillColor(234, 179, 8); // yellow-500
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Rapport d\'Évaluation', margin, 15);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Référence: ${data.evaluationRef}`, margin, 25);

  yPosition = 45;

  // Informations générales
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Informations générales', margin, yPosition);
  yPosition += 7;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  if (data.candidatName) {
    pdf.text(`Candidat: ${data.candidatName}`, margin, yPosition);
    yPosition += 6;
  }
  
  pdf.text(`Date limite: ${new Date(data.deadline).toLocaleDateString('fr-FR')}`, margin, yPosition);
  yPosition += 12;

  // Parcourir les catégories
  for (const category of data.report) {
    checkAddPage(40);

    // Titre de la catégorie
    pdf.setFillColor(59, 130, 246); // blue-500
    pdf.rect(margin, yPosition - 6, pageWidth - 2 * margin, 10, 'F');
    
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(getCategoryLabel(category.category), margin + 3, yPosition);
    yPosition += 12;

    // Créer le tableau pour cette catégorie
    const tableData = category.questions.map((question, index) => {
      const row: any[] = [
        `${index + 1}. ${question.questionText}`,
        question.overallAverage !== null ? question.overallAverage.toFixed(1) : 'N/A',
        formatScore(question.averagesByEvaluatorType.COLLABORATEUR_DIRECT),
        formatScore(question.averagesByEvaluatorType.MANAGER_DIRECT),
        formatScore(question.averagesByEvaluatorType.MANAGER_N_2),
        formatScore(question.averagesByEvaluatorType.COLLEGUE),
        formatScore(question.averagesByEvaluatorType.RH),
        formatScore(question.averagesByEvaluatorType.CANDIDAT),
        `${question.answeredEvaluators}/${question.totalEvaluators}`,
      ];
      return row;
    });

    autoTable(pdf, {
      startY: yPosition,
      head: [[
        'Question',
        'Moy. Générale',
        'Collaborateurs',
        'Manager Direct',
        'Manager N+2',
        'Collègues',
        'RH',
        'Auto-évaluation',
        'Réponses',
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [249, 250, 251],
        textColor: [17, 24, 39],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 80, halign: 'left' }, // Question
        1: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: [37, 99, 235] }, // Moyenne
        2: { cellWidth: 20, halign: 'center' }, // Collaborateurs
        3: { cellWidth: 20, halign: 'center' }, // Manager Direct
        4: { cellWidth: 20, halign: 'center' }, // Manager N+2
        5: { cellWidth: 20, halign: 'center' }, // Collègues
        6: { cellWidth: 16, halign: 'center' }, // RH
        7: { cellWidth: 24, halign: 'center' }, // Auto-évaluation
        8: { cellWidth: 18, halign: 'center', fontSize: 8, textColor: [107, 114, 128] }, // Réponses
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data: any) => {
        // Ne rien faire ici, on gère le pied de page après
      },
    });

    yPosition = (pdf as any).lastAutoTable.finalY || yPosition + 10;
    yPosition += 10;
  }

  // Pied de page sur toutes les pages
  const totalPages = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175); // gray-400
    pdf.text(
      `Page ${i} sur ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    pdf.text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
      margin,
      pageHeight - 8
    );
  }

  // Télécharger le PDF
  pdf.save(`rapport-${data.evaluationRef}.pdf`);
}

/**
 * Formate un score pour l'affichage
 */
function formatScore(score: number | undefined): string {
  if (score === undefined || score === null) return '-';
  return score.toFixed(1);
}

/**
 * Obtenir le label d'une catégorie
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    COMPETENCES_TECHNIQUES: 'Compétences Techniques',
    COMPETENCES_MANAGÉRIALES: 'Compétences Managériales',
    COMPETENCES_RELATIONNELLES: 'Compétences Relationnelles',
    LEADERSHIP: 'Leadership',
    COMMUNICATION: 'Communication',
    TRAVAIL_EQUIPE: 'Travail en Équipe',
    INNOVATION: 'Innovation',
    RESULTAT: 'Orientation Résultats',
    AUTRE: 'Autre',
  };
  return labels[category] || category;
}

/**
 * Obtenir le label d'un type d'évaluateur
 */
function getEvaluatorTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CANDIDAT: 'Candidat',
    MANAGER_DIRECT: 'Manager Direct',
    MANAGER_N_2: 'Manager N+2',
    COLLEGUE: 'Collègue',
    COLLABORATEUR_DIRECT: 'Collaborateur Direct',
    RH: 'RH',
    AUTRE: 'Autre',
  };
  return labels[type] || type;
}

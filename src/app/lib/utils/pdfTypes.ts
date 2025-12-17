export type CategoryReport = {
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

export type ReportData = {
  evaluationRef: string;
  candidatName?: string;
  deadline: string;
  report: CategoryReport[];
};

export type CategoryInfo = {
  name: string;
  color: [number, number, number];
  textColor: [number, number, number];
};

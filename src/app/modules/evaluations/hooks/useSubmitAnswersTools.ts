export const useSubmitAnswersTools = (quiz: any, answersMap: any) => {
  const buildAnswersPayload = () => {
    const answers = (quiz.questions || []).map((q: any) => {
      const val = answersMap[q.id];
      if (q.type === "TEXT") return { questionId: q.id, textAnswer: val ?? "" };
      if (q.type === "SCALE")
        return {
          questionId: q.id,
          numericAnswer: typeof val === "number" ? val : null,
        };
      if (q.type === "MULTIPLE_CHOICE")
        return {
          questionId: q.id,
          selectedOptionIds: Array.isArray(val) ? val : [],
        };
      // SINGLE_CHOICE
      return {
        questionId: q.id,
        selectedOptionId: typeof val === "number" ? val : null,
      };
    });
    return answers;
  };

  const validateAnswers = () => {
    if (!quiz?.questions)
      return { isValid: false, message: "Aucune question trouvée" };

    const unansweredQuestions: string[] = [];

    for (const question of quiz.questions) {
      const answer = answersMap[question.id];

      // Vérifier si la réponse est vide ou null
      if (answer === undefined || answer === null || answer === "") {
        unansweredQuestions.push(question.text);
        continue;
      }

      // Pour les questions à choix multiples, vérifier qu'au moins une option est sélectionnée
      if (
        question.type === "MULTIPLE_CHOICE" &&
        (!Array.isArray(answer) || answer.length === 0)
      ) {
        unansweredQuestions.push(question.text);
        continue;
      }

      // Pour les questions texte, vérifier que ce n'est pas vide
      if (question.type === "TEXT" && (!answer || answer.trim() === "")) {
        unansweredQuestions.push(question.text);
        continue;
      }

      // Pour les questions échelle, vérifier que c'est un nombre valide
      if (
        question.type === "SCALE" &&
        (typeof answer !== "number" || answer < 0 || answer > 10)
      ) {
        unansweredQuestions.push(question.text);
        continue;
      }
    }

    if (unansweredQuestions.length > 0) {
      const questionsList = unansweredQuestions.map((q) => `• ${q}`).join("\n");
      return {
        isValid: false,
        message: `Veuillez répondre aux questions suivantes :\n\n${questionsList}`,
        unansweredCount: unansweredQuestions.length,
      };
    }

    return { isValid: true };
  };
  return { validateAnswers, buildAnswersPayload };
};

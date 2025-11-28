export const useSubmitAnswersTools = (quiz: any, answersMap: any, currentPage: number = 1, questionsPerPage: number = 5) => {
  
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
    
    // Vérifier toutes les questions de la page actuelle
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

      // Pour les questions numériques/échelle
      if (
        (question.type === "SCALE" || question.type === "NUMERIC") &&
        (answer === undefined || answer === null || answer === "")
      ) {
        unansweredQuestions.push(question.text);
        continue;
      }
    }

    if (unansweredQuestions.length > 0) {
      const questionsList = unansweredQuestions.map((q) => `• ${q}`).join("\n");
      return {
        isValid: false,
        message: `Veuillez répondre à toutes les questions avant de soumettre`,
        unansweredCount: unansweredQuestions.length,
      };
    }

    return { isValid: true };
  };

  // Fonction de validation des réponses pour la page actuelle uniquement
  const validateCurrentPageAnswers = () => {
    if (!quiz?.questions) return { isValid: false, message: "Aucune question trouvée" };

    const unansweredQuestions: string[] = [];
    const currentPageQuestions = quiz.questions;

    for (const question of currentPageQuestions) {
      const answer = answersMap[question.id];

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

      // Pour les questions à choix unique (SINGLE_CHOICE), vérifier qu'une option est sélectionnée
      if (question.type === "SINGLE_CHOICE" && (!answer || answer === null)) {
        unansweredQuestions.push(question.text);
        continue;
      }

      // Pour les questions numériques/échelle
      if (
        (question.type === "SCALE" || question.type === "NUMERIC") &&
        (answer === undefined || answer === null || answer === "")
      ) {
        unansweredQuestions.push(question.text);
        continue;
      }
    }

    if (unansweredQuestions.length > 0) {
      // Créer un message avec la liste des questions non répondues
      const questionsList = unansweredQuestions
        .slice(0, 3) // Limiter à 3 questions pour ne pas surcharger
        .map((q, idx) => {
          // Tronquer le texte de la question si trop long
          const shortText = q.length > 50 ? q.substring(0, 50) + "..." : q;
          return `${idx + 1}. ${shortText}`;
        })
        .join("\n");
      
      const moreText = unansweredQuestions.length > 3 
        ? `\n... et ${unansweredQuestions.length - 3} autre(s) question(s)` 
        : "";

      return {
        isValid: false,
        message: `${unansweredQuestions.length} question(s) non répondue(s) sur cette page`,
        description: questionsList + moreText,
        unansweredCount: unansweredQuestions.length,
      };
    }

    return { isValid: true };
  };

  return { validateAnswers, validateCurrentPageAnswers, buildAnswersPayload };
};

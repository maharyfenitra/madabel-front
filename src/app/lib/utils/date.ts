export const formatDate = (isoDate?: string, locale = "fr-FR"): string => {
  if (!isoDate) return "—"; // valeur par défaut si la date est vide
  const date = new Date(isoDate);
  return date.toLocaleDateString(locale); // format court : JJ/MM/AAAA
};
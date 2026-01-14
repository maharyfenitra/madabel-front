import type { CategoryInfo } from './pdfTypes';

export const CATEGORY_DATA: CategoryInfo[] = [
  { name: 'PRODUCTION', color: [76, 175, 80], textColor: [255, 255, 255] }, // Vert
  { name: 'PERMISSION', color: [255, 193, 7], textColor: [0, 0, 0] }, // Jaune
  { name: 'PINNACLE', color: [33, 150, 243], textColor: [255, 255, 255] }, // Bleu
  { name: 'POSITION', color: [244, 67, 54], textColor: [255, 255, 255] }, // Rouge
  { name: 'DEVELOPPEMENT', color: [156, 39, 176], textColor: [255, 255, 255] }, // Violet
];

export const PDF_COLORS = {
  YELLOW_BOX: [255, 193, 7] as [number, number, number],
  GREY_BANNER: [200, 200, 200] as [number, number, number],
  DARK_GREY: [60, 60, 60] as [number, number, number],
  WHITE: [255, 255, 255] as [number, number, number],
  BLACK: [0, 0, 0] as [number, number, number],
  BLUE_GREY: [70, 90, 110] as [number, number, number],
  GREEN: [76, 175, 80] as [number, number, number],
  YELLOW: [255, 193, 7] as [number, number, number],
  BLUE: [33, 150, 243] as [number, number, number],
};

/**
 * Constantes de dimensions et espacements pour le PDF
 */
export const PDF_DIMENSIONS = {
  PAGE_WIDTH: 210, // A4 width in mm
  PAGE_HEIGHT: 297, // A4 height in mm
  MARGIN: 15,
  HEADER_HEIGHT: 50,
  FOOTER_HEIGHT: 20,
} as const;

/**
 * Constantes de tailles de police
 */
export const PDF_FONT_SIZES = {
  TITLE: 16,
  SUBTITLE: 12,
  HEADING: 10,
  BODY: 8,
  SMALL: 7,
  TINY: 6,
} as const;

/**
 * Constantes d'espacement
 */
export const PDF_SPACING = {
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 15,
  XLARGE: 20,
} as const;

/**
 * Configuration du tableau
 */
export const TABLE_CONFIG = {
  FIRST_COLUMN_WIDTH: 60,
  OTHER_COLUMN_WIDTH: 16,
  LINE_WIDTH: 0.3,
  LINE_COLOR: [200, 200, 200] as [number, number, number],
  CELL_PADDING: 2,
} as const;

/**
 * Textes explicatifs pour chaque catégorie de leadership
 */
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  PRODUCTION: `Le troisième niveau de leadership consiste à obtenir des résultats avec une équipe. Toute organisation, et donc tout leader, doit obtenir des résultats afin de se développer et de grandir. Les comportements axés sur les résultats comprennent la définition de la vision, la réflexion stratégique, la prise de décisions et le lancement d'actions pour réaliser cette vision. Produire des résultats au niveau de la production signifie définir des résultats responsables. A ce niveau, les autres vous suivent en raison de ce que vous avez fait pour l'organisation.`,
  
  PERMISSION: `À ce niveau de leadership, les autres vous suivent parce qu'ils vous ont donné la permission de développer une relation avec eux. Les grands leaders inspirent et motivent les autres leaders pour qu'ils atteignent l'excellence. Afin de motiver et de produire de meilleurs résultats, un leader s'intéresse véritablement aux autres. Les grands leaders forment, coachent, mentorent, encouragent et responsabilisent ! Les scores de ce niveau reflètent vos compétences relationnelles dans le cadre de vos attributs de leadership fondamentaux.`,
  
  PINNACLE: `Le cinquième et plus haut niveau de leadership est le Pinnacle. À ce niveau, votre influence s'étend au-delà de votre organisation immédiate. Vous développez d'autres leaders qui développent eux-mêmes des leaders. Votre impact se mesure par la croissance et le développement des personnes que vous avez influencées.`,
  
  'Pinnacle-Soi': `Cette sous-catégorie évalue votre développement personnel au niveau Pinnacle. Elle mesure votre capacité à vous développer en tant que leader exemplaire et à servir de modèle pour les autres.`,
  
  'Pinnacle-Autres': `Cette sous-catégorie évalue votre impact sur le développement des autres au niveau Pinnacle. Elle mesure votre capacité à développer des leaders qui développent eux-mêmes d'autres leaders.`,
  
  POSITION: `Le premier niveau de leadership est basé sur la position. Les gens vous suivent parce qu'ils le doivent. Votre influence ne s'étend pas au-delà des limites de votre description de poste. Plus vous restez longtemps à ce niveau, plus il est difficile de progresser et de développer votre influence.`,
  
  'DÉVELOPPEMENT DES AUTRES': `Les grands leaders s'engagent à développer les autres, tant sur le plan personnel que professionnel. Les leaders très efficaces savent que le temps investi dans le développement des autres a un impact incommensurable et réussit à la fois l'organisation et la satisfaction des autres. L'utilisation conjointe des autres niveaux de leadership (Position, Permission et Production) aide les leaders à développer efficacement les personnes. À ce niveau de leadership, vous utilisez votre expérience et vos connaissances pour reproduire vos propres compétences dans la vie des autres. Lorsque vous faites cela, les autres vous suivent en raison de ce que vous avez fait pour eux.`,
};

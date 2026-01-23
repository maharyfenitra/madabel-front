import type { CategoryInfo } from './pdfTypes';
import { CATEGORY_DATA as CATEGORIES, CATEGORY_DESCRIPTIONS as DESCRIPTIONS } from './categories';

export const CATEGORY_DATA: CategoryInfo[] = CATEGORIES;

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
  RED: [244, 67, 54] as [number, number, number],
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
  CELL_PADDING: 1,
} as const;

/**
 * Textes explicatifs pour chaque catégorie de leadership
 */
export const CATEGORY_DESCRIPTIONS: Record<string, string> = DESCRIPTIONS;

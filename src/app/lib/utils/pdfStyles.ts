import type { CategoryInfo } from './pdfTypes';

export const CATEGORY_DATA: CategoryInfo[] = [
  { name: 'PRODUCTION', color: [76, 175, 80], textColor: [255, 255, 255] }, // Vert
  { name: 'PERMISSION', color: [255, 193, 7], textColor: [0, 0, 0] }, // Jaune
  { name: 'PINNACLE', color: [33, 150, 243], textColor: [255, 255, 255] }, // Bleu
  { name: 'POSITION', color: [255, 152, 0], textColor: [255, 255, 255] }, // Orange
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

import type { CategoryInfo } from '../pdfTypes';
import { PRODUCTION_CONFIG, PRODUCTION_DESCRIPTION } from './production';
import { PERMISSION_CONFIG, PERMISSION_DESCRIPTION } from './permission';
import { PINNACLE_CONFIG, PINNACLE_DESCRIPTION } from './pinnacle';
import { POSITION_CONFIG, POSITION_DESCRIPTION } from './position';
import { DEVELOPPEMENT_CONFIG, DEVELOPPEMENT_DESCRIPTION } from './developpement';

export const CATEGORY_DATA: CategoryInfo[] = [
  PRODUCTION_CONFIG,
  PERMISSION_CONFIG,
  PINNACLE_CONFIG,
  POSITION_CONFIG,
  DEVELOPPEMENT_CONFIG,
];

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  PRODUCTION: PRODUCTION_DESCRIPTION,
  PERMISSION: PERMISSION_DESCRIPTION,
  POSITION: POSITION_DESCRIPTION,
  'DÉVELOPPEMENT DES AUTRES': DEVELOPPEMENT_DESCRIPTION,
};

export * from './production';
export * from './permission';
export * from './pinnacle';
export * from './position';
export * from './developpement';

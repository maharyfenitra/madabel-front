/**
 * Local storage helpers with type safety
 */

/**
 * Get item from localStorage
 */
export function getStorageItem<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === 'undefined') return defaultValue || null;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : (defaultValue || null);
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue || null;
  }
}

/**
 * Set item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all localStorage
 */
export function clearStorage(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Check if key exists in localStorage
 */
export function hasStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.localStorage.getItem(key) !== null;
}

/**
 * Get multiple items from localStorage
 */
export function getStorageItems<T extends Record<string, any>>(
  keys: (keyof T)[]
): Partial<T> {
  const result: any = {};
  
  for (const key of keys) {
    const value = getStorageItem(String(key));
    if (value !== null) {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Set multiple items in localStorage
 */
export function setStorageItems<T extends Record<string, any>>(items: T): boolean {
  try {
    for (const [key, value] of Object.entries(items)) {
      setStorageItem(key, value);
    }
    return true;
  } catch (error) {
    console.error('Error setting multiple localStorage items:', error);
    return false;
  }
}

/**
 * Storage keys constants
 */
export const StorageKeys = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

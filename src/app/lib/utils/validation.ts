/**
 * Validation helpers for forms
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (French format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate required field
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Validate minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

/**
 * Validate number range
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate password strength
 */
export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate form fields
 */
export interface FieldValidation {
  field: string;
  value: any;
  rules: {
    required?: boolean;
    email?: boolean;
    phone?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateFields(validations: FieldValidation[]): ValidationResult {
  const errors: Record<string, string> = {};

  for (const validation of validations) {
    const { field, value, rules } = validation;

    if (rules.required && !isRequired(value)) {
      errors[field] = 'Ce champ est requis';
      continue;
    }

    if (value && rules.email && !isValidEmail(value)) {
      errors[field] = 'Email invalide';
      continue;
    }

    if (value && rules.phone && !isValidPhone(value)) {
      errors[field] = 'Numéro de téléphone invalide';
      continue;
    }

    if (value && rules.minLength && !minLength(value, rules.minLength)) {
      errors[field] = `Minimum ${rules.minLength} caractères`;
      continue;
    }

    if (value && rules.maxLength && !maxLength(value, rules.maxLength)) {
      errors[field] = `Maximum ${rules.maxLength} caractères`;
      continue;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = 'Format invalide';
      continue;
    }

    if (rules.custom && !rules.custom(value)) {
      errors[field] = 'Validation personnalisée échouée';
      continue;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize string input
 */
export function sanitizeString(str: string | undefined | null): string {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Validate file upload
 */
export interface FileValidation {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // mime types
  allowedExtensions?: string[]; // file extensions
}

export function validateFile(file: File, rules: FileValidation): { valid: boolean; error?: string } {
  if (rules.maxSize && file.size > rules.maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux (max: ${(rules.maxSize / 1024 / 1024).toFixed(2)} MB)`,
    };
  }

  if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non autorisé (types acceptés: ${rules.allowedTypes.join(', ')})`,
    };
  }

  if (rules.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !rules.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Extension non autorisée (extensions acceptées: ${rules.allowedExtensions.join(', ')})`,
      };
    }
  }

  return { valid: true };
}

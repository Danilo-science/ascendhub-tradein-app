import DOMPurify from 'dompurify';

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validación de teléfono (formato argentino)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+54\s?)?(\d{2,4}\s?)?\d{4}\s?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Sanitización de strings
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remover caracteres peligrosos y scripts
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
};

// Validación de longitud de texto
export const isValidTextLength = (text: string, minLength = 1, maxLength = 1000): boolean => {
  return text.length >= minLength && text.length <= maxLength;
};

// Validación de archivos de imagen
export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

// Validación de nombre (solo letras, espacios y algunos caracteres especiales)
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]{2,50}$/;
  return nameRegex.test(name);
};

// Validación de contraseña segura
export const isValidPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Escape de caracteres SQL (aunque usemos ORM, es buena práctica)
export const escapeSqlString = (input: string): string => {
  return input.replace(/'/g, "''").replace(/\\/g, '\\\\');
};

// Validación de URL
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Rate limiting simple (en memoria)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxRequests = 10, windowMs = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// Headers de seguridad para respuestas
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;",
});

// Validación de entrada para formularios
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateTradeInForm = (data: {
  categoria?: string;
  marca?: string;
  modelo?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  descripcionAdicional?: string;
  imagenes?: File[];
  [key: string]: unknown;
}): ValidationResult => {
  const errors: string[] = [];
  
  // Validar campos requeridos
  if (!data.categoria || !sanitizeString(data.categoria)) {
    errors.push('La categoría es requerida');
  }
  
  if (!data.marca || !sanitizeString(data.marca)) {
    errors.push('La marca es requerida');
  }
  
  if (!data.modelo || !isValidTextLength(sanitizeString(data.modelo), 2, 100)) {
    errors.push('El modelo debe tener entre 2 y 100 caracteres');
  }
  
  if (!data.nombre || !isValidName(sanitizeString(data.nombre))) {
    errors.push('El nombre debe contener solo letras y tener entre 2 y 50 caracteres');
  }
  
  if (!data.email || !isValidEmail(sanitizeString(data.email))) {
    errors.push('El email no es válido');
  }
  
  if (!data.telefono || !isValidPhone(sanitizeString(data.telefono))) {
    errors.push('El teléfono no tiene un formato válido');
  }
  
  if (!data.ciudad || !isValidTextLength(sanitizeString(data.ciudad), 2, 100)) {
    errors.push('La ciudad debe tener entre 2 y 100 caracteres');
  }
  
  // Validar descripción adicional si existe
  if (data.descripcionAdicional && !isValidTextLength(sanitizeString(data.descripcionAdicional), 0, 1000)) {
    errors.push('La descripción adicional no puede exceder 1000 caracteres');
  }
  
  // Validar imágenes si existen
  if (data.imagenes && Array.isArray(data.imagenes)) {
    if (data.imagenes.length > 6) {
      errors.push('No se pueden subir más de 6 imágenes');
    }
    
    for (const imagen of data.imagenes) {
      if (imagen instanceof File && !isValidImageFile(imagen)) {
        errors.push(`La imagen ${imagen.name} no es válida o es muy grande`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAuthForm = (data: { email: string; password: string; name?: string }): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.email || !isValidEmail(sanitizeString(data.email))) {
    errors.push('El email no es válido');
  }
  
  if (!data.password || !isValidPassword(data.password)) {
    errors.push('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
  }
  
  if (data.name !== undefined && (!data.name || !isValidName(sanitizeString(data.name)))) {
    errors.push('El nombre debe contener solo letras y tener entre 2 y 50 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
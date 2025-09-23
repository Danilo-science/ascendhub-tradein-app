import { z } from 'zod';
import { logger } from '@/lib/logger';

// ============================================================================
// ESQUEMAS BASE REUTILIZABLES
// ============================================================================

export const emailSchema = z.string()
  .email('El email no es válido')
  .min(1, 'El email es requerido')
  .transform(email => email.toLowerCase().trim());

export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial');

export const nameSchema = z.string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede exceder 50 caracteres')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
  .transform(name => name.trim());

export const phoneSchema = z.string()
  .min(10, 'El teléfono debe tener al menos 10 dígitos')
  .max(15, 'El teléfono no puede exceder 15 dígitos')
  .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'El teléfono no tiene un formato válido')
  .transform(phone => phone.replace(/\s/g, ''));

export const urlSchema = z.string()
  .url('La URL no es válida')
  .optional()
  .or(z.literal(''));

export const priceSchema = z.number()
  .min(0, 'El precio debe ser mayor o igual a 0')
  .max(999999, 'El precio no puede exceder $999,999');

// ============================================================================
// ESQUEMAS DE FORMULARIOS
// ============================================================================

// Autenticación - Sign In
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida')
});

// Autenticación - Sign Up
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Trade-In
export const tradeInSchema = z.object({
  // Información del dispositivo
  categoria: z.string().min(1, 'La categoría es requerida'),
  marca: z.string().min(1, 'La marca es requerida'),
  modelo: z.string()
    .min(2, 'El modelo debe tener al menos 2 caracteres')
    .max(100, 'El modelo no puede exceder 100 caracteres')
    .transform(modelo => modelo.trim()),
  anio: z.string().optional(),
  color: z.string().optional(),
  capacidad: z.string().optional(),
  
  // Estado del dispositivo
  estadoGeneral: z.string().min(1, 'El estado general es requerido'),
  pantalla: z.string().optional(),
  bateria: z.string().optional(),
  funcionamiento: z.string().optional(),
  accesorios: z.array(z.string()).optional(),
  
  // Información de contacto
  nombre: nameSchema,
  email: emailSchema,
  telefono: phoneSchema,
  ciudad: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres')
    .transform(ciudad => ciudad.trim()),
  
  // Información adicional
  descripcionAdicional: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .transform(desc => desc?.trim()),
  
  // Archivos
  imagenes: z.array(z.instanceof(File)).optional()
});

// Perfil de usuario
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: z.string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional()
    .transform(addr => addr?.trim()),
  city: z.string()
    .max(100, 'La ciudad no puede exceder 100 caracteres')
    .optional()
    .transform(city => city?.trim()),
  country: z.string()
    .max(100, 'El país no puede exceder 100 caracteres')
    .optional()
    .transform(country => country?.trim())
});

// Cambio de contraseña
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
});

// Información de envío
export const shippingSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .transform(addr => addr.trim()),
  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres')
    .transform(city => city.trim()),
  state: z.string()
    .min(2, 'El estado/provincia es requerido')
    .max(100, 'El estado/provincia no puede exceder 100 caracteres')
    .transform(state => state.trim()),
  zipCode: z.string()
    .min(3, 'El código postal debe tener al menos 3 caracteres')
    .max(10, 'El código postal no puede exceder 10 caracteres')
    .regex(/^[0-9A-Za-z\s\-]+$/, 'El código postal no tiene un formato válido')
    .transform(zip => zip.replace(/\s/g, '')),
  country: z.string()
    .min(2, 'El país es requerido')
    .max(100, 'El país no puede exceder 100 caracteres')
    .transform(country => country.trim())
});

// Información de pago
export const paymentSchema = z.object({
  cardNumber: z.string()
    .min(13, 'El número de tarjeta debe tener al menos 13 dígitos')
    .max(19, 'El número de tarjeta no puede exceder 19 dígitos')
    .regex(/^[0-9\s]+$/, 'El número de tarjeta solo puede contener números')
    .transform(card => card.replace(/\s/g, '')),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'La fecha de expiración debe tener el formato MM/YY'),
  cvv: z.string()
    .min(3, 'El CVV debe tener al menos 3 dígitos')
    .max(4, 'El CVV no puede exceder 4 dígitos')
    .regex(/^[0-9]+$/, 'El CVV solo puede contener números'),
  cardholderName: nameSchema
});

// ============================================================================
// TIPOS TYPESCRIPT
// ============================================================================

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type TradeInFormData = z.infer<typeof tradeInSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export const validateWithZod = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown,
  context?: string
): ValidationResult<T> => {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      logger.debug('Validación exitosa', context || 'validation');
      return {
        success: true,
        data: result.data,
        errors: []
      };
    } else {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      logger.warn('Errores de validación', context || 'validation');
      return {
        success: false,
        errors
      };
    }
  } catch (error) {
    logger.error('Error durante validación', error, context || 'validation');
    return {
      success: false,
      errors: [{ field: 'general', message: 'Error interno de validación' }]
    };
  }
};

export const getValidationErrors = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown,
  context?: string
): string[] => {
  const result = validateWithZod(schema, data, context);
  return result.errors.map(error => error.message);
};

export const validateField = <T>(
  schema: z.ZodSchema<T>, 
  data: unknown, 
  fieldPath: string,
  context?: string
): string | null => {
  const result = validateWithZod(schema, data, context);
  const error = result.errors.find(err => err.field === fieldPath);
  return error ? error.message : null;
};

// Validación en tiempo real para campos individuales
export const validateFieldRealTime = <T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: any,
  allData: Record<string, any> = {}
): string | null => {
  try {
    // Crear un objeto temporal con el campo a validar
    const tempData = { ...allData, [fieldName]: value };
    const result = schema.safeParse(tempData);
    
    if (!result.success) {
      const fieldError = result.error.errors.find(
        err => err.path.includes(fieldName)
      );
      return fieldError ? fieldError.message : null;
    }
    
    return null;
  } catch (error) {
    logger.error('Error en validación en tiempo real', error, `field-validation-${fieldName}`);
    return 'Error de validación';
  }
};

// Validador para archivos de imagen
export const validateImageFile = (file: File): ValidationResult => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  const errors: Array<{ field: string; message: string }> = [];
  
  if (!allowedTypes.includes(file.type)) {
    errors.push({
      field: 'type',
      message: 'Solo se permiten archivos JPG, PNG y WebP'
    });
  }
  
  if (file.size > maxSize) {
    errors.push({
      field: 'size',
      message: 'El archivo no puede exceder 5MB'
    });
  }
  
  const success = errors.length === 0;
  
  if (!success) {
    logger.warn('Archivo de imagen inválido', { fileName: file.name, errors });
  }
  
  return { success, errors };
};

// Validador para múltiples archivos
export const validateImageFiles = (files: File[]): ValidationResult => {
  const maxFiles = 10;
  const errors: Array<{ field: string; message: string }> = [];
  
  if (files.length > maxFiles) {
    errors.push({
      field: 'count',
      message: `No se pueden subir más de ${maxFiles} archivos`
    });
  }
  
  files.forEach((file, index) => {
    const fileValidation = validateImageFile(file);
    if (!fileValidation.success) {
      fileValidation.errors.forEach(error => {
        errors.push({
          field: `file_${index}_${error.field}`,
          message: `Archivo ${index + 1}: ${error.message}`
        });
      });
    }
  });
  
  return {
    success: errors.length === 0,
    errors
  };
};
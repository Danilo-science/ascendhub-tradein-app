import { z } from 'zod';

// Esquemas base reutilizables
const emailSchema = z.string()
  .email('El email no es válido')
  .min(1, 'El email es requerido');

const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número');

const nameSchema = z.string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede exceder 50 caracteres')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios');

const phoneSchema = z.string()
  .min(10, 'El teléfono debe tener al menos 10 dígitos')
  .max(15, 'El teléfono no puede exceder 15 dígitos')
  .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'El teléfono no tiene un formato válido');

// Esquema para autenticación - Sign In
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida')
});

// Esquema para autenticación - Sign Up
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Esquema para Trade-In
export const tradeInSchema = z.object({
  // Información del dispositivo
  categoria: z.string().min(1, 'La categoría es requerida'),
  marca: z.string().min(1, 'La marca es requerida'),
  modelo: z.string()
    .min(2, 'El modelo debe tener al menos 2 caracteres')
    .max(100, 'El modelo no puede exceder 100 caracteres'),
  anio: z.string().optional(),
  color: z.string().optional(),
  capacidad: z.string().optional(),
  
  // Estado del dispositivo
  estadoGeneral: z.string().min(1, 'El estado general es requerido'),
  pantalla: z.string().optional(),
  bateria: z.string().optional(),
  funcionamiento: z.string().optional(),
  accesorios: z.array(z.string()).optional(),
  
  // Información personal
  nombre: nameSchema,
  email: emailSchema,
  telefono: phoneSchema,
  ciudad: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres'),
  
  // Información adicional
  descripcionAdicional: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
  
  // Archivos
  imagenes: z.array(z.instanceof(File)).optional()
});

// Esquema para perfil de usuario
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: z.string().max(200, 'La dirección no puede exceder 200 caracteres').optional(),
  city: z.string().max(100, 'La ciudad no puede exceder 100 caracteres').optional(),
  country: z.string().max(100, 'El país no puede exceder 100 caracteres').optional()
});

// Esquema para cambio de contraseña
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
});

// Tipos TypeScript derivados de los esquemas
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type TradeInFormData = z.infer<typeof tradeInSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Función helper para validar y formatear errores
export const validateWithZod = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true as const,
      data: result.data,
      errors: []
    };
  }
  
  return {
    success: false as const,
    data: null,
    errors: result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }))
  };
};

// Función helper para obtener solo los mensajes de error
export const getValidationErrors = <T>(schema: z.ZodSchema<T>, data: unknown): string[] => {
  const result = validateWithZod(schema, data);
  return result.errors.map(err => err.message);
};

// Función helper para validar un campo específico
export const validateField = <T>(schema: z.ZodSchema<T>, data: unknown, fieldPath: string): string | null => {
  const result = validateWithZod(schema, data);
  const fieldError = result.errors.find(err => err.field === fieldPath);
  return fieldError ? fieldError.message : null;
};
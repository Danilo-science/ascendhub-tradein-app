import { z } from 'zod';

export const validateFieldRealTime = (
  schema: z.ZodSchema,
  fieldName: string,
  value: string,
  formData: any
): { isValid: boolean; message?: string } => {
  try {
    // Crear un objeto temporal con el campo actualizado
    const tempData = { ...formData, [fieldName]: value };
    
    // Validaciones específicas por campo
    switch (fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, message: 'Formato de email inválido' };
        }
        break;
        
      case 'password':
        if (value.length < 8) {
          return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return { isValid: false, message: 'Debe contener mayúscula, minúscula y número' };
        }
        break;
        
      case 'confirmPassword':
        if (value !== tempData.password) {
          return { isValid: false, message: 'Las contraseñas no coinciden' };
        }
        break;
        
      case 'name':
        if (value.length < 2) {
          return { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' };
        }
        break;
    }
    
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.errors[0]?.message || 'Campo inválido' };
    }
    return { isValid: false, message: 'Error de validación' };
  }
};

export const getFieldErrorMessage = (fieldName: string, error: string): string => {
  const errorMessages: { [key: string]: { [key: string]: string } } = {
    email: {
      'String must contain at least 1 character(s)': 'El email es requerido',
      'Invalid email': 'Formato de email inválido'
    },
    password: {
      'String must contain at least 8 character(s)': 'La contraseña debe tener al menos 8 caracteres',
      'String must contain at least 1 character(s)': 'La contraseña es requerida'
    },
    name: {
      'String must contain at least 2 character(s)': 'El nombre debe tener al menos 2 caracteres',
      'String must contain at least 1 character(s)': 'El nombre es requerido'
    },
    confirmPassword: {
      'String must contain at least 1 character(s)': 'Confirma tu contraseña',
      'Passwords do not match': 'Las contraseñas no coinciden'
    }
  };
  
  return errorMessages[fieldName]?.[error] || error;
};
import { z } from 'zod';

/**
 * Validación para formulario de creación de usuarios
 * Alineado con el backend: user.validator.ts
 */
export const createUserFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no debe exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/,
      'El nombre solo puede contener letras, espacios, guiones y apóstrofes'
    ),
  
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no debe exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/,
      'El apellido solo puede contener letras, espacios, guiones y apóstrofes'
    ),
  
  email: z.string()
    .min(1, 'El email es requerido')
    .max(255, 'El email no debe exceder 255 caracteres')
    .email('Formato de email inválido')
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'El email debe tener un formato válido (ejemplo@dominio.com)'
    ),
  
  phoneNumber: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(
      /^(\+?[1-9]\d{1,14}|[0-9]{7,15})$/,
      'Formato de teléfono inválido. Debe tener entre 7 y 15 dígitos'
    ),
  
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no debe exceder 100 caracteres'),
  
  confirmPassword: z.string()
    .min(1, 'La confirmación de contraseña es requerida'),
  
  role: z.enum(['USER', 'ADMIN', 'OPERATOR', 'SUPER_ADMIN'])
    .default('OPERATOR'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

/**
 * Validación para formulario de actualización de usuarios
 */
export const updateUserFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no debe exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/,
      'El nombre solo puede contener letras, espacios, guiones y apóstrofes'
    )
    .optional(),
  
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no debe exceder 100 caracteres')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/,
      'El apellido solo puede contener letras, espacios, guiones y apóstrofes'
    )
    .optional(),
  
  email: z.string()
    .min(1, 'El email es requerido')
    .max(255, 'El email no debe exceder 255 caracteres')
    .email('Formato de email inválido')
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'El email debe tener un formato válido (ejemplo@dominio.com)'
    )
    .optional(),
  
  phoneNumber: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(
      /^(\+?[1-9]\d{1,14}|[0-9]{7,15})$/,
      'Formato de teléfono inválido. Debe tener entre 7 y 15 dígitos'
    )
    .optional(),
  
  role: z.enum(['USER', 'ADMIN', 'OPERATOR', 'SUPER_ADMIN'])
    .optional(),
  
  isActive: z.boolean().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;

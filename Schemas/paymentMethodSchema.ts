import { z } from 'zod';

/**
 * Constantes de validación de métodos de pago
 * Deben coincidir con PAYMENT_METHOD_CONSTANTS del backend
 */
const PAYMENT_METHOD_CONSTANTS = {
  CARD_NUMBER_LENGTH: {
    MIN: 13,
    MAX: 19
  },
  CVV_LENGTH: {
    STANDARD: 3,
    AMEX: 4
  },
} as const;

/**
 * Validador de número de tarjeta
 */
const cardNumberValidator = z
  .string()
  .min(1, 'El número de tarjeta es requerido')
  .transform(val => val.replace(/\s+/g, '')) // Remover espacios
  .refine(
    val => /^\d+$/.test(val),
    'El número de tarjeta debe contener solo dígitos'
  )
  .refine(
    val => val.length >= PAYMENT_METHOD_CONSTANTS.CARD_NUMBER_LENGTH.MIN && 
           val.length <= PAYMENT_METHOD_CONSTANTS.CARD_NUMBER_LENGTH.MAX,
    `El número de tarjeta debe tener entre ${PAYMENT_METHOD_CONSTANTS.CARD_NUMBER_LENGTH.MIN} y ${PAYMENT_METHOD_CONSTANTS.CARD_NUMBER_LENGTH.MAX} dígitos`
  );

/**
 * Validador de CVV
 */
const cvvValidator = z
  .string()
  .min(3, 'El CVV debe tener al menos 3 dígitos')
  .max(4, 'El CVV debe tener máximo 4 dígitos')
  .refine(val => /^\d+$/.test(val), 'El CVV debe contener solo dígitos');

/**
 * Validador de mes de expiración
 */
const expiryMonthValidator = z
  .number()
  .int('El mes debe ser un número entero')
  .min(1, 'El mes debe estar entre 1 y 12')
  .max(12, 'El mes debe estar entre 1 y 12');

/**
 * Validador de año de expiración
 */
const expiryYearValidator = z
  .number()
  .int('El año debe ser un número entero')
  .min(new Date().getFullYear(), 'El año de expiración no puede ser en el pasado')
  .max(new Date().getFullYear() + 20, 'El año de expiración parece inválido');

/**
 * Validador de nombre del titular
 */
const cardholderNameValidator = z
  .string()
  .min(3, 'El nombre del titular debe tener al menos 3 caracteres')
  .max(100, 'El nombre del titular es demasiado largo')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre del titular solo debe contener letras y espacios');

/**
 * Schema de validación para crear un método de pago
 * Coincide con CreatePaymentMethodSchema del backend
 */
export const CreatePaymentMethodSchema = z.object({
  type: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PSE', 'NEQUI', 'DAVIPLATA'], {
    errorMap: () => ({ message: 'Tipo de método de pago no válido' }),
  }),
  cardNumber: cardNumberValidator,
  cardholderName: cardholderNameValidator,
  expiryMonth: expiryMonthValidator,
  expiryYear: expiryYearValidator,
  cvv: cvvValidator,
  billingAddress: z
    .string()
    .max(200, 'La dirección de facturación es demasiado larga')
    .optional(),
  nickname: z
    .string()
    .max(50, 'El nombre personalizado es demasiado largo')
    .optional(),
  setAsDefault: z.boolean().optional(),
}).refine(
  data => {
    // Validar que la tarjeta no esté expirada
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (data.expiryYear < currentYear) return false;
    if (data.expiryYear === currentYear && data.expiryMonth < currentMonth) return false;
    
    return true;
  },
  {
    message: 'La tarjeta ha expirado o expirará muy pronto',
    path: ['expiryMonth'],
  }
);

export type CreatePaymentMethodFormData = z.infer<typeof CreatePaymentMethodSchema>;

/**
 * Schema de validación para actualizar un método de pago
 * Coincide con UpdatePaymentMethodSchema del backend
 */
export const UpdatePaymentMethodSchema = z.object({
  cardholderName: cardholderNameValidator.optional(),
  expiryMonth: expiryMonthValidator.optional(),
  expiryYear: expiryYearValidator.optional(),
  billingAddress: z
    .string()
    .max(200, 'La dirección de facturación es demasiado larga')
    .optional(),
  nickname: z
    .string()
    .max(50, 'El nombre personalizado es demasiado largo')
    .optional(),
  isActive: z.boolean().optional(),
}).refine(
  data => {
    // Si se proporciona mes o año, validar que no esté expirada
    if (data.expiryMonth !== undefined || data.expiryYear !== undefined) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      const month = data.expiryMonth ?? currentMonth;
      const year = data.expiryYear ?? currentYear;
      
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
    }
    
    return true;
  },
  {
    message: 'La nueva fecha de expiración no puede ser en el pasado',
    path: ['expiryMonth'],
  }
);

export type UpdatePaymentMethodFormData = z.infer<typeof UpdatePaymentMethodSchema>;

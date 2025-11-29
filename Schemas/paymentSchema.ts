import { z } from 'zod';

/**
 * Constantes de validación de pagos
 * Deben coincidir con PAYMENT_CONSTRAINTS del backend
 */
const PAYMENT_CONSTRAINTS = {
  MIN_AMOUNT: 1000, // $1000 COP mínimo
  MAX_AMOUNT: 1000000, // $1,000,000 COP máximo
  TRANSACTION_ID_MAX_LENGTH: 100,
} as const;

/**
 * Schema de validación para crear un pago
 * Coincide con createPaymentSchema del backend
 */
export const CreatePaymentSchema = z.object({
  reservationId: z.string().uuid({ message: 'El ID de reservación debe ser un UUID válido' }),
  amount: z.number()
    .min(PAYMENT_CONSTRAINTS.MIN_AMOUNT, { message: `El monto mínimo es $${PAYMENT_CONSTRAINTS.MIN_AMOUNT}` })
    .max(PAYMENT_CONSTRAINTS.MAX_AMOUNT, { message: `El monto máximo es $${PAYMENT_CONSTRAINTS.MAX_AMOUNT}` })
    .positive({ message: 'El monto debe ser positivo' }),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'CASH'], {
    errorMap: () => ({ message: 'Método de pago no válido' }),
  }),
  transactionId: z.string()
    .max(PAYMENT_CONSTRAINTS.TRANSACTION_ID_MAX_LENGTH, {
      message: `El ID de transacción no puede exceder ${PAYMENT_CONSTRAINTS.TRANSACTION_ID_MAX_LENGTH} caracteres`
    })
    .optional(),
  paymentStatus: z.enum(['PENDING', 'SUCCESSFUL', 'FAILED'], {
    errorMap: () => ({ message: 'Estado de pago no válido' }),
  }),
  paymentMethodId: z.string().uuid().optional(),
});

export type CreatePaymentFormData = z.infer<typeof CreatePaymentSchema>;

/**
 * Schema de validación para actualizar un pago
 * Coincide con updatePaymentSchema del backend
 */
export const UpdatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'SUCCESSFUL', 'FAILED'], {
    errorMap: () => ({ message: 'Estado de pago no válido' }),
  }).optional(),
  transactionId: z.string()
    .max(PAYMENT_CONSTRAINTS.TRANSACTION_ID_MAX_LENGTH, {
      message: `El ID de transacción no puede exceder ${PAYMENT_CONSTRAINTS.TRANSACTION_ID_MAX_LENGTH} caracteres`
    })
    .optional(),
});

export type UpdatePaymentFormData = z.infer<typeof UpdatePaymentSchema>;

/**
 * Schema para crear reservación con pago en una sola transacción
 * Coincide con CreateReservationWithPaymentData del backend
 */
export const CreateReservationWithPaymentSchema = z.object({
  // Datos de reservación
  parkingSpotId: z.string().uuid({ message: 'Debe ser un UUID válido' }),
  vehicleId: z.string().uuid({ message: 'Debe ser un UUID válido' }),
  guestName: z.string().optional(),
  guestContact: z.string().optional(),
  startTime: z.string()
    .datetime({ message: 'Debe ser una fecha y hora válida en formato ISO' })
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return date > new Date();
    }, {
      message: 'La fecha debe ser en el futuro'
    }),
  endTime: z.string()
    .datetime({ message: 'Debe ser una fecha y hora válida en formato ISO' })
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return date > new Date();
    }, {
      message: 'La fecha debe ser en el futuro'
    }),
  
  // Datos de pago
  amount: z.number()
    .min(PAYMENT_CONSTRAINTS.MIN_AMOUNT, { message: `El monto mínimo es $${PAYMENT_CONSTRAINTS.MIN_AMOUNT}` })
    .max(PAYMENT_CONSTRAINTS.MAX_AMOUNT, { message: `El monto máximo es $${PAYMENT_CONSTRAINTS.MAX_AMOUNT}` })
    .positive({ message: 'El monto debe ser positivo' }),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'CASH'], {
    errorMap: () => ({ message: 'Método de pago no válido' }),
  }),
  paymentMethodId: z.string().uuid().optional(),
  transactionId: z.string()
    .max(PAYMENT_CONSTRAINTS.TRANSACTION_ID_MAX_LENGTH, {
      message: `El ID de transacción no puede exceder ${PAYMENT_CONSTRAINTS.TRANSACTION_ID_MAX_LENGTH} caracteres`
    })
    .optional(),
}).refine((data) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  return endTime > startTime;
}, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['endTime']
});

export type CreateReservationWithPaymentFormData = z.infer<typeof CreateReservationWithPaymentSchema>;

import { z } from 'zod';

/**
 * Constantes de validación de reservaciones
 * Deben coincidir con RESERVATION_CONSTRAINTS del backend
 */
const RESERVATION_CONSTRAINTS = {
  MIN_DURATION_HOURS: 1,
  MAX_DURATION_HOURS: 24 * 7, // 1 semana
  MAX_ADVANCE_BOOKING_DAYS: 30,
  MIN_ADVANCE_BOOKING_MINUTES: 15,
} as const;

/**
 * Schema de validación para crear una reservación
 * Coincide con createReservationSchema del backend
 */
export const CreateReservationSchema = z.object({
  parkingSpotId: z.string().uuid({ message: 'Debe ser un UUID válido' }),
  vehicleId: z.string().uuid({ message: 'Debe ser un UUID válido' }),
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
  guestName: z.string().optional(),
  guestContact: z.string().optional(),
}).refine((data) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  return endTime > startTime;
}, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['endTime']
}).refine((data) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  return durationHours >= RESERVATION_CONSTRAINTS.MIN_DURATION_HOURS;
}, {
  message: `La reservación debe durar al menos ${RESERVATION_CONSTRAINTS.MIN_DURATION_HOURS} hora(s)`,
  path: ['endTime']
}).refine((data) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  return durationHours <= RESERVATION_CONSTRAINTS.MAX_DURATION_HOURS;
}, {
  message: `La reservación no puede durar más de ${RESERVATION_CONSTRAINTS.MAX_DURATION_HOURS} horas`,
  path: ['endTime']
}).refine((data) => {
  const now = new Date();
  const startTime = new Date(data.startTime);
  const minAdvanceMs = RESERVATION_CONSTRAINTS.MIN_ADVANCE_BOOKING_MINUTES * 60 * 1000;
  return startTime.getTime() - now.getTime() >= minAdvanceMs;
}, {
  message: `La reservación debe hacerse con al menos ${RESERVATION_CONSTRAINTS.MIN_ADVANCE_BOOKING_MINUTES} minutos de anticipación`,
  path: ['startTime']
}).refine((data) => {
  const now = new Date();
  const startTime = new Date(data.startTime);
  const maxAdvanceMs = RESERVATION_CONSTRAINTS.MAX_ADVANCE_BOOKING_DAYS * 24 * 60 * 60 * 1000;
  return startTime.getTime() - now.getTime() <= maxAdvanceMs;
}, {
  message: `La reservación no puede hacerse con más de ${RESERVATION_CONSTRAINTS.MAX_ADVANCE_BOOKING_DAYS} días de anticipación`,
  path: ['startTime']
});

export type CreateReservationFormData = z.infer<typeof CreateReservationSchema>;

/**
 * Schema de validación para actualizar una reservación
 * Coincide con updateReservationSchema del backend
 */
export const UpdateReservationSchema = z.object({
  startTime: z.string()
    .datetime({ message: 'Debe ser una fecha y hora válida en formato ISO' })
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return date > new Date();
    }, {
      message: 'La fecha debe ser en el futuro'
    })
    .optional(),
  endTime: z.string()
    .datetime({ message: 'Debe ser una fecha y hora válida en formato ISO' })
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return date > new Date();
    }, {
      message: 'La fecha debe ser en el futuro'
    })
    .optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']).optional(),
}).refine((data) => {
  // Si se proporcionan ambas fechas, validar que endTime > startTime
  if (data.startTime && data.endTime) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    return endTime > startTime;
  }
  return true;
}, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['endTime']
}).refine((data) => {
  // Si se proporcionan ambas fechas, validar duración mínima
  if (data.startTime && data.endTime) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return durationHours >= RESERVATION_CONSTRAINTS.MIN_DURATION_HOURS;
  }
  return true;
}, {
  message: `La reservación debe durar al menos ${RESERVATION_CONSTRAINTS.MIN_DURATION_HOURS} hora(s)`,
  path: ['endTime']
}).refine((data) => {
  // Si se proporcionan ambas fechas, validar duración máxima
  if (data.startTime && data.endTime) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return durationHours <= RESERVATION_CONSTRAINTS.MAX_DURATION_HOURS;
  }
  return true;
}, {
  message: `La reservación no puede durar más de ${RESERVATION_CONSTRAINTS.MAX_DURATION_HOURS} horas`,
  path: ['endTime']
});

export type UpdateReservationFormData = z.infer<typeof UpdateReservationSchema>;

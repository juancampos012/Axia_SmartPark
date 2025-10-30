import { z } from 'zod';

// Frontend validator for parking edit form.
// Mirrors backend updateParkingSchema but accepts string inputs for numeric fields
// (we coerce them to numbers). Messages are aligned with backend when possible.

export const updateParkingFormSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no debe exceder 100 caracteres')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, { message: 'El nombre solo puede contener letras, números, espacios, guiones, guiones bajos y puntos' })
    .optional(),

  address: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(255, 'La dirección no debe exceder 255 caracteres')
    .optional(),

  description: z.string()
    .max(500, 'La descripción no debe exceder 500 caracteres')
    .optional(),

  totalCapacity: z.coerce.number()
    .int({ message: 'La capacidad total debe ser un número entero' })
    .min(1, { message: 'La capacidad total debe ser al menos 1' })
    .optional(),

  actualCapacity: z.coerce.number()
    .int({ message: 'La capacidad actual debe ser un número entero' })
    .min(0, { message: 'La capacidad actual no puede ser negativa' })
    .optional(),

  floors: z.coerce.number()
    .int({ message: 'Los pisos deben ser un número entero' })
    .min(1, { message: 'Debe haber al menos 1 piso' })
    .max(20, { message: 'No puede haber más de 20 pisos' })
    .optional(),

  schedule: z.string()
    .max(200, 'El horario no debe exceder 200 caracteres')
    .optional(),

  hourlyCarRate: z.coerce.number()
    .min(100, { message: 'La tarifa por hora para carros debe ser al menos 100' })
    .optional(),

  hourlyMotorcycleRate: z.coerce.number()
    .min(50, { message: 'La tarifa por hora para motos debe ser al menos 50' })
    .optional(),

  dailyRate: z.coerce.number()
    .min(100, { message: 'La tarifa diaria debe ser al menos 100' })
    .optional(),

  monthlyRate: z.coerce.number()
    .min(100, { message: 'La tarifa mensual debe ser al menos 100' })
    .optional(),

  latitude: z.coerce.number()
    .min(-90, { message: 'La latitud debe estar entre -90 y 90' })
    .max(90, { message: 'La latitud debe estar entre -90 y 90' })
    .optional(),

  longitude: z.coerce.number()
    .min(-180, { message: 'La longitud debe estar entre -180 y 180' })
    .max(180, { message: 'La longitud debe estar entre -180 y 180' })
    .optional(),

  status: z.enum(['OPEN', 'CLOSED', 'FULL', 'MAINTENANCE']).optional(),
});

export type UpdateParkingFormData = z.infer<typeof updateParkingFormSchema>;

// schemas/carSchema.ts
import { z } from "zod";

const normalizeText = (text: string): string => text.trim();
const normalizePlate = (plate: string): string => plate.replace(/\s/g, '').toUpperCase();

export const CarEditSchema = z.object({
  carBrand: z
    .string()
    .min(1, "La marca es obligatoria")
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(30, "La marca no puede tener más de 30 caracteres")
    .regex(/^[A-Za-zÀ-ÿ\s\-]+$/, "La marca solo puede contener letras, espacios y guiones")
    .transform(normalizeText),

  model: z
    .string()
    .min(1, "El modelo es obligatorio")
    .min(2, "El modelo debe tener al menos 2 caracteres")
    .max(30, "El modelo no puede tener más de 30 caracteres")
    .regex(/^[A-Za-zÀ-ÿ0-9\s\-]+$/, "El modelo solo puede contener letras, números, espacios y guiones")
    .transform(normalizeText),

  licensePlate: z
    .string()
    .min(1, "La placa es obligatoria")
    .min(6, "La placa debe tener al menos 6 caracteres")
    .max(10, "La placa no puede tener más de 10 caracteres")
    .regex(/^[A-Za-z0-9\s\-]+$/, "La placa solo puede contener letras, números, espacios y guiones")
    .transform(normalizePlate),

  engineType: z
    .string()
    .min(1, "El tipo de motor es obligatorio")
    .refine(
      (type) => ['GASOLINA', 'DIESEL', 'ELÉCTRICO', 'HÍBRIDO', 'GAS'].includes(type.toUpperCase()),
      { message: "Tipo de motor no válido" }
    )
    .transform((val) => val.toUpperCase()),

  color: z
    .string()
    .min(1, "El color es obligatorio")
    .min(2, "El color debe tener al menos 2 caracteres")
    .max(20, "El color no puede tener más de 20 caracteres")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "El color solo puede contener letras y espacios")
    .transform(normalizeText),
});

export type CarFormData = z.infer<typeof CarEditSchema>;
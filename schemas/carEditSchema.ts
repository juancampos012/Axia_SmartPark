// schemas/carSchema.ts
import { z } from "zod";

const normalizeText = (text: string): string => text.trim();
const normalizePlate = (plate: string): string => plate.replace(/\s/g, '').toUpperCase();

export const CarEditSchema = z.object({
  carBrand: z
    .string()
    .min(1, "La marca es obligatoria")
    .max(30, "La marca no puede tener más de 30 caracteres")
    .regex(/^[a-zA-Z\s\-]+$/, "La marca solo puede contener letras, espacios y guiones")
    .transform(normalizeText),

  model: z
    .string()
    .min(1, "El modelo es obligatorio")
    .max(50, "El modelo no puede tener más de 50 caracteres")
    .regex(/^[a-zA-Z0-9\s\-\.]+$/, "El modelo solo puede contener letras, números, espacios, guiones y puntos")
    .transform(normalizeText),

  licensePlate: z
    .string()
    .min(6, "La placa debe tener 6 caracteres")
    .max(7, "La placa debe seguir el formato colombiano (max 7 caracteres con espacio)")
    .regex(/^[A-Z]{3}\s?[0-9]{3}$/i, "La placa debe seguir el formato colombiano: 3 letras seguidas de 3 números (ej: ABC123 o ABC 123)")
    .transform(normalizePlate),

  engineType: z
    .enum(["GASOLINE", "ELECTRIC", "HYBRID"], {
      errorMap: () => ({ message: "Tipo de motor no válido. Debe ser GASOLINE, ELECTRIC o HYBRID" }),
    })
    .optional(),

  color: z
    .string()
    .min(1, "El color es obligatorio")
    .max(30, "El color no puede tener más de 30 caracteres")
    .regex(/^[a-zA-Z\s\-]+$/, "El color solo puede contener letras, espacios y guiones")
    .transform(normalizeText),
});

export type CarFormData = z.infer<typeof CarEditSchema>;
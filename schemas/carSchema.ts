import { z } from "zod";

const carPlateRegex = /^[A-Z]{3}\d{3}$/; 
const motorcyclePlateRegex = /^[A-Z]{3}\d{2}[A-Z]$/; 

export const CarSchema = z
  .object({
    brand: z.string()
      .min(1, "La marca es obligatoria")
      .max(30, "La marca no puede tener más de 30 caracteres")
      .regex(/^[a-zA-Z\s\-]+$/, "La marca solo puede contener letras, espacios y guiones"),
    model: z.string()
      .min(1, "El modelo es obligatorio")
      .max(50, "El modelo no puede tener más de 50 caracteres")
      .regex(/^[a-zA-Z0-9\s\-\.]+$/, "El modelo solo puede contener letras, números, espacios, guiones y puntos"),
    color: z.string()
      .min(1, "El color es obligatorio")
      .max(30, "El color no puede tener más de 30 caracteres")
      .regex(/^[a-zA-Z\s\-]+$/, "El color solo puede contener letras, espacios y guiones"),
    plate: z
      .string()
      .min(6, "La placa debe tener 6 caracteres")
      .max(7, "La placa debe seguir el formato colombiano (max 7 caracteres con espacio)")
      .regex(/^[A-Z]{3}\s?[0-9]{3}$/i, "La placa debe seguir el formato colombiano: 3 letras seguidas de 3 números (ej: ABC123 o ABC 123)")
      .transform(val => val.toUpperCase().replace(/\s+/g, '')),
    type: z.enum(["CAR", "MOTORCYCLE"], {
      errorMap: () => ({ message: "Selecciona un tipo de vehículo" }),
    }),
    engineType: z.enum(["GASOLINE", "ELECTRIC", "HYBRID"], {
      errorMap: () => ({ message: "Selecciona un tipo de motor" }),
    }).optional(),
  });

export type CarFormData = z.infer<typeof CarSchema>;

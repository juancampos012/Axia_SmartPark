import { z } from "zod";

const carPlateRegex = /^[A-Z]{3}\d{3}$/; 
const motorcyclePlateRegex = /^[A-Z]{3}\d{2}[A-Z]$/; 

export const CarSchema = z
  .object({
    brand: z.string().min(2, "La marca es obligatoria"),
    model: z.string().min(1, "El modelo es obligatorio"),
    color: z.string().min(1, "El color es obligatorio"),
    plate: z
      .string()
      .min(5, "La placa es obligatoria")
      .max(6, "La placa no puede tener más de 6 caracteres")
      .toUpperCase(),
    type: z.enum(["CAR", "MOTORCYCLE"], {
      errorMap: () => ({ message: "Selecciona un tipo de vehículo" }),
    }),
    engineType: z.enum(["GASOLINE", "ELECTRIC", "HYBRID"], {
      errorMap: () => ({ message: "Selecciona un tipo de motor" }),
    }),
  })
  .superRefine((data, ctx) => {
    const { type, plate } = data;

    if (type === "CAR" && !carPlateRegex.test(plate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Formato de placa inválido (Ej: KYX816)",
        path: ["plate"],
      });
    }

    if (type === "MOTORCYCLE" && !motorcyclePlateRegex.test(plate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Formato de placa inválido (Ej: LVO67H)",
        path: ["plate"],
      });
    }
  });

export type CarFormData = z.infer<typeof CarSchema>;

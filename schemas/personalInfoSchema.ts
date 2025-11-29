import { z } from "zod";

const normalizeText = (text: string): string => text.trim();
const normalizeEmail = (email: string): string => email.toLowerCase().trim();

export const PersonalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/, "El nombre contiene caracteres inválidos")
    .transform(normalizeText),

  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/, "El apellido contiene caracteres inválidos")
    .transform(normalizeText),

  email: z
    .string()
    .min(1, "El email es obligatorio")
    .transform(normalizeEmail)
    .refine(
      (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      { message: "Por favor ingresa un email válido" }
    ),

  phone: z
    .string()
    .regex(/^(\+?[1-9]\d{1,14}|[0-9]{7,15})$/, "Formato de número de teléfono inválido"),

  active: z.boolean().default(true).optional(),
  createdAt: z.string().optional(),
});

export type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>;

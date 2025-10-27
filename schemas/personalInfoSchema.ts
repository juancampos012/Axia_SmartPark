import { z } from "zod";

const normalizeText = (text: string): string => text.trim();
const normalizeEmail = (email: string): string => email.toLowerCase().trim();

export const PersonalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios")
    .transform(normalizeText),

  lastName: z
    .string()
    .min(1, "El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "El apellido solo puede contener letras y espacios")
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
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos")
    .regex(/^\d{10}$/, "El teléfono debe contener exactamente 10 números"),

  active: z.boolean().default(true).optional(),
  createdAt: z.string().optional(),
});

export type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>;

import { z } from "zod";

const normalizeText = (text: string) => text.trim();
const normalizeEmail = (email: string) => email.toLowerCase().trim();

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/, "El nombre contiene caracteres inválidos")
      .transform(normalizeText),

    lastName: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder 50 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-']{2,100}$/, "El apellido contiene caracteres inválidos")
      .transform(normalizeText),

    email: z
      .string()
      .min(1, "El email es obligatorio")
      .transform(normalizeEmail)
      .refine(
        (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        { message: "El email no es válido" }
      ),

    phone: z
      .string()
      .regex(/^\d{10}$/, "El teléfono debe contener exactamente 10 números"),

    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(128, "La contraseña no puede exceder 128 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)"
      ),

    confirmPassword: z.string().min(1, "Confirma tu contraseña"),

    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "Debes aceptar los términos"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword && password && password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

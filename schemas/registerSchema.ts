import { z } from "zod";

const normalizeText = (text: string) => text.trim();
const normalizeEmail = (email: string) => email.toLowerCase().trim();

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "El nombre es obligatorio")
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras")
      .transform(normalizeText),

    lastName: z
      .string()
      .min(1, "El apellido es obligatorio")
      .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El apellido solo puede contener letras")
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
      .min(7, "La contraseña debe tener al menos 7 caracteres")
      .refine((val) => /[A-Z]/.test(val), {
        message: "La contraseña debe contener al menos una letra mayúscula (A-Z)"
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "La contraseña debe contener al menos una letra minúscula (a-z)"
      })
      .refine((val) => /\d/.test(val), {
        message: "La contraseña debe contener al menos un número (0-9)"
      })
      .refine((val) => /[@$!%*?&]/.test(val), {
        message: "La contraseña debe contener al menos un carácter especial (@$!%*?&)"
      }),

    confirmPassword: z.string(),

    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

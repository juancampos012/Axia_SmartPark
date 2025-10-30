import { z } from 'zod';

const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim().replace(/\s+/g, '');
};

const emailSchema = z.string()
  .min(1, 'El email es obligatorio')
  .transform(normalizeEmail)
  .refine(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    { message: 'Por favor ingresa un email válido' }
  );

export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es obligatoria')
});

export type LoginFormData = z.infer<typeof LoginSchema>;

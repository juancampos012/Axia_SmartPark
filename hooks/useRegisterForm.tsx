import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import { registerAuth } from '../libs/auth';
import type { RegisterDTO } from '../interfaces/Auth';
import { RegisterSchema, type RegisterFormData } from '../schemas/registerSchema';

interface UseRegisterFormProps {
  onSuccess?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  }) => void;
  onLoginPress?: () => void;
}

export const useRegisterForm = ({ onSuccess, onLoginPress }: UseRegisterFormProps = {}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false
    }, mode: 'all'
  });

  const passwordValue = watch('password');

  const buildPayload = (data: RegisterFormData): RegisterDTO => ({
    name: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
    phoneNumber: data.phone.trim(),
  } as any);

  const handleVerificationRequired = (result: any) => {
    Alert.alert(
      'Verificación requerida', 
      'Te hemos enviado un email de verificación. Por favor revisa tu bandeja de entrada y sigue las instrucciones.',
      [
        {
          text: 'OK',
          onPress: () => {
            reset();
            onLoginPress?.();
          }
        }
      ]
    );
  };

  const handleRegistrationSuccess = (result: any, data: RegisterFormData) => {
    onSuccess?.({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone
    });

    Alert.alert('Éxito', result.message || 'Cuenta creada exitosamente', [
      {
        text: 'OK',
        onPress: () => {
          reset();
          onLoginPress?.();
        }
      }
    ]);
  };

  const handleRegistrationError = (err: any) => {
    let errorMessage = 'No se pudo registrar';
    
    if (err.message) {
      if (err.message.includes('email') && err.message.includes('already')) {
        errorMessage = 'Este email ya está registrado. Intenta con otro email o inicia sesión.';
      } else if (err.message.includes('phone')) {
        errorMessage = 'Este número de teléfono ya está registrado.';
      } else {
        errorMessage = err.message;
      }
    }
    
    Alert.alert('Error en registro', errorMessage);
  };

  const submitForm = async (data: RegisterFormData) => {
    try {
      const payload = buildPayload(data);
      const result = await registerAuth(payload);

      if (result.verificationRequired) {
        handleVerificationRequired(result);
        return;
      }

      handleRegistrationSuccess(result, data);
    } catch (err: any) {
      handleRegistrationError(err);
    }
  };

  return {
    control,
    errors,
    isSubmitting,
    passwordValue,
    handleSubmit: handleSubmit(submitForm)
  };
};

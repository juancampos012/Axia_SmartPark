import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { registerAuth } from '../libs/auth';
import type { RegisterDTO } from '../interfaces/Auth';

interface OriginalFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

type FormValues = OriginalFormValues & {
  confirmPassword: string;
  acceptTerms: boolean;
};

interface UseRegisterFormProps {
  onSuccess?: (data: OriginalFormValues) => void;
  onLoginPress?: () => void;
}

export const useRegisterForm = ({ onSuccess, onLoginPress }: UseRegisterFormProps = {}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false
    }
  });

  const passwordValue = watch('password');

  const validatePasswords = (data: FormValues): boolean => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const validateTerms = (data: FormValues): boolean => {
    if (!data.acceptTerms) {
      Alert.alert('Términos', 'Debes aceptar los términos y condiciones');
      return false;
    }
    return true;
  };

  const buildPayload = (data: FormValues): RegisterDTO => {
    return {
      name: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phoneNumber: data.phone.trim(),
      confirmPassword: data.confirmPassword,
      acceptTerms: data.acceptTerms
    } as any;
  };

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

  const handleRegistrationSuccess = (result: any, data: FormValues) => {
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

  const submitForm = async (data: FormValues) => {
    try {
      if (!validatePasswords(data)) return;
      if (!validateTerms(data)) return;

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

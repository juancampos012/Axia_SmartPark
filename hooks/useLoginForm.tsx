import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { loginAuth } from '../libs/auth';
import { LoginDTO } from '../interfaces/Auth';

interface UseLoginFormProps {
  onSuccess?: () => void;
}

export const useLoginForm = ({ onSuccess }: UseLoginFormProps = {}) => {
  const { signIn } = useAuth();
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginDTO>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitForm = async (data: LoginDTO) => {
    try {
      const response = await loginAuth(data);
      
      console.log('Login - Backend response:', {
        hasUser: !!response.data.user,
        userId: response.data.user?.id,
        userEmail: response.data.user?.email,
        userRole: response.data.user?.role,
        parkingId: response.data.user?.parkingId,
        hasTokens: !!response.data.tokens
      });
      
      // Guardar en el AuthContext
      await signIn(
        response.data.user,
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      
      router.dismissAll();
      router.replace('/(tabs)/home');
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        "Error de inicio de sesión", 
        error.message || "Correo o contraseña incorrectos"
      );
    }
  };

  return {
    control,
    errors,
    isSubmitting,
    handleSubmit: handleSubmit(submitForm)
  };
};

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { loginAuth } from '../libs/auth';
import { LoginSchema, LoginFormData } from '../schemas/loginSchema';

interface UseLoginFormProps {
  onSuccess?: () => void;
}

export const useLoginForm = ({ onSuccess }: UseLoginFormProps = {}) => {
  const { signIn } = useAuth();
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitForm = async (data: LoginFormData) => {
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
      
      await signIn(
        response.data.user,
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      try {
        router.dismissAll();
      } catch (e) {
        console.log('No modals to dismiss');
      }
      router.replace('/(tabs)/home');
   
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Login error:', error);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
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
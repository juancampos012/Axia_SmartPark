import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import { LoginDTO } from '../../../interfaces/Auth';
import { loginAuth } from '../../../libs/auth';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onSignUpPress?: () => void;
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSignUpPress,
  onGooglePress,
  onFacebookPress
}) => {
  const { signIn } = useAuth();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDTO>({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const { signIn } = useAuth();

  const submitForm = async (data: LoginDTO) => {
    try {
      const response = await loginAuth(data);
      
      // Guardar en el AuthContext
      await signIn(
        response.data.user,
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      
       router.dismissAll();
      // Navegar a las tabs
      router.replace('/(tabs)/home');
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error de inicio de sesión", error.message || "Correo o contraseña incorrectos");
    }
  };

  return (
    <View className="w-full">
      {/* Campos del formulario */}
      <View className="space-y-4 mb-6">
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'El email es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email inválido'
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Correo electrónico"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
              leftIcon={<Ionicons name="mail-outline" size={20} color="#6B7280" />}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: 'La contraseña es obligatoria' }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Contraseña"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              autoCapitalize="none"
              error={errors.password?.message}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
            />
          )}
        />
      </View>

      {/* Botón de login */}
      <Button
        title="Iniciar sesión"
        onPress={handleSubmit(submitForm)}
        loading={isSubmitting}
        className="w-full mb-8 shadow-lg shadow-axia-green/25"
        size="large"
      />

      {/* Separador */}
      <View className="flex-row items-center mb-8">
        <View className="flex-1 h-px bg-axia-gray/30" />
        <Text className="px-4 text-axia-gray text-sm font-primary">O continúa con</Text>
        <View className="flex-1 h-px bg-axia-gray/30" />
      </View>

      {/* Botones sociales */}
      <View className="flex-row justify-between space-x-4 mb-8">
        <Pressable
          onPress={onGooglePress}
          className="flex-1 bg-axia-darkGray p-4 mr-4 ml-4 rounded-2xl items-center active:scale-95 shadow-lg shadow-black/20"
        >
          <View className="flex-row items-center">
            <Ionicons name="logo-google" size={20} color="#EF4444" />
            <Text className="text-white font-primary ml-2">Google</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onFacebookPress}
          className="flex-1 bg-axia-darkGray p-4 rounded-2xl items-center active:scale-95 shadow-lg shadow-black/20"
        >
          <View className="flex-row items-center">
            <Ionicons name="logo-facebook" size={20} color="#3B82F6" />
            <Text className="text-white font-primary ml-2">Facebook</Text>
          </View>
        </Pressable>
      </View>

      {/* Enlace a registro */}
      <View className="bg-axia-darkGray/50 rounded-2xl p-6 items-center">
        <Text className="text-axia-gray text-base font-primary mb-2">
          ¿Aún no tienes cuenta?
        </Text>
        <Pressable 
          onPress={() => router.push('/register')}
          className="active:scale-95"
        >
          <Text className="text-axia-green text-lg font-primaryBold">
            Crear cuenta ahora
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginForm;
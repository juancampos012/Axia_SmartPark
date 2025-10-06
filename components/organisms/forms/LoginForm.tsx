import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import { LoginDTO } from '../../../../interfaces/Auth';
import { loginAuth } from '../../../../libs/auth';
import { router, useRouter } from 'expo-router';
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
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDTO>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitForm = async (data: LoginDTO) => {
    setLoading(true);
    try {
      console.log("Iniciando login con email:", data.email);
      const response = await loginAuth({
        email: data.email,
        password: data.password,
      });

      if (response.success && response.data) {
        // Usar signIn del contexto para guardar el usuario y tokens
        await signIn(
          response.data.user,
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        );

        Alert.alert(
          "¡Bienvenido!",
          `Hola ${response.data.user.name}`,
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)/home"),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Error en login form:", error);
      
      let errorMessage = error.message || "Correo o contraseña incorrectos";
      
      // Mostrar información adicional si está disponible
      if (error.details) {
        console.log("Detalles del error:", error.details);
        
        // Si hay información sobre intentos de login
        if (error.details.loginAttempts !== undefined) {
          const attempts = error.details.loginAttempts;
          const maxAttempts = error.details.maxAttempts;
          
          if (maxAttempts && attempts >= maxAttempts) {
            errorMessage = `Cuenta bloqueada por demasiados intentos fallidos. ${error.details.lockTime ? `Inténtalo de nuevo en ${Math.ceil(error.details.lockTime / 60)} minutos.` : 'Contacta al soporte.'}`;
          } else if (maxAttempts) {
            const remainingAttempts = maxAttempts - attempts;
            errorMessage += `\n\nIntentos restantes: ${remainingAttempts}`;
          }
        }
        
        // Si hay tiempo de bloqueo
        if (error.details.retryAfter) {
          errorMessage += `\n\nReintentar en: ${Math.ceil(error.details.retryAfter / 60)} minutos`;
        }
      }
      
      Alert.alert("Error de inicio de sesión", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full px-6">
      {/* Input Email */}
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
          />
        )}
      />

      {/* Input Password */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'La contraseña es obligatoria',
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Contraseña"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password?.message}
          />
        )}
      />

      {/* Mostrar el primer error */}
      {errors.password && (
        <Text className="text-red-500">
          {errors.password.message ||
            (errors.password.types && Object.values(errors.password.types)[0])}
        </Text>
      )}

      {/* Botón de inicio de sesión */}
      <Button
        title="Iniciar sesión"
        onPress={handleSubmit(submitForm)}
        loading={isSubmitting || loading}
        className="w-full mt-4"
      />

      {/* Separador */}
      <View className="flex-row items-center my-8">
        <View className="flex-1 h-px bg-axia-gray" />
        <Text className="px-4 text-axia-gray text-sm">O ingresa con</Text>
        <View className="flex-1 h-px bg-axia-gray" />
      </View>

      {/* Botones de redes sociales */}
      <View className="flex-row justify-between space-x-6 mb-8 px-8">
        <Pressable
          onPress={onGooglePress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center mx-4"
        >
          <Ionicons name="logo-google" size={24} color="#FFFFFF" />
        </Pressable>

        <Pressable
          onPress={onFacebookPress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center mx-3"
        >
          <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Link para crear cuenta */}
      <View className="flex-row justify-center items-center">
        <Text className="text-axia-gray text-base">
          ¿Aún no tienes cuenta?{' '}
        </Text>
        <Pressable onPress={() => router.push('/register')}>
              <Text className="text-axia-green text-base font-primaryBold">
            Crear cuenta
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginForm;

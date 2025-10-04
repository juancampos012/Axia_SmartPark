import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import { LoginDTO } from '../../../interfaces/Auth';
import { loginAuth } from '../../../libs/auth';
import { router } from 'expo-router';

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
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDTO>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitForm = async (data: LoginDTO) => {
    try {
      const authResponse = await loginAuth(data);
      const user = authResponse.data.user;
      Alert.alert("Bienvenido", `Hola ${user.name}`);
      router.navigate('/(tabs)');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error de inicio de sesión", error.message || "Correo o contraseña incorrectos");
    }
  };

  return (
    <View className="w-full px-6">
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
          />
        )}
      />

      <Button
        title="Iniciar sesión"
        onPress={handleSubmit(submitForm)}
        loading={isSubmitting}
        className="w-full mt-4"
      />

      <View className="flex-row items-center my-8">
        <View className="flex-1 h-px bg-axia-gray" />
        <Text className="px-4 text-axia-gray text-sm">O ingresa con</Text>
        <View className="flex-1 h-px bg-axia-gray" />
      </View>

      <View className="flex-row justify-between space-x-6 mb-8 px-8">
        <Pressable
          onPress={onGooglePress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center"
        >
          <Ionicons name="logo-google" size={24} color="#FFFFFF" />
        </Pressable>

        <Pressable
          onPress={onFacebookPress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center"
        >
          <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <View className="flex-row justify-center items-center">
        <Text className="text-axia-gray text-base">¿Aún no tienes cuenta? </Text>
        <Pressable onPress={() => router.push('/register')}>
          <Text className="text-axia-green text-base font-primaryBold">Crear cuenta</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginForm;

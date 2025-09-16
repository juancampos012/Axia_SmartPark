import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onSignUpPress?: () => void;
  onGooglePress?: () => void;
  onFacebookPress?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSignUpPress,
  onGooglePress,
  onFacebookPress
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const submitForm = (data: { email: string; password: string }) => {
    if (onSubmit) {
      onSubmit(data);
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
          />
        )}
      />
      {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}

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

      {/* Botón Sign In */}
      <Button
        title="Iniciar sesión"
        onPress={handleSubmit(submitForm)}
        className="w-full mt-4"
      />

      {/* Separador "Or login with" */}
      <View className="flex-row items-center my-8">
        <View className="flex-1 h-px bg-axia-gray" />
        <Text className="px-4 text-axia-gray text-sm">O ingrear con</Text>
        <View className="flex-1 h-px bg-axia-gray" />
      </View>

      {/* Botones de redes sociales */}
      <View className="flex-row justify-between space-x-6 mb-8 px-8">
        <TouchableOpacity
          onPress={onGooglePress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center mx-4"
        >
          <Ionicons name="logo-google" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onFacebookPress}
          className="bg-axia-darkGray p-4 rounded-lg flex-1 items-center mx-3"
        >
          <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Link para Sign Up */}
      <View className="flex-row justify-center items-center">
        <Text className="text-axia-gray text-base">
          Aun no tienes cuenta?{' '}
        </Text>
        <TouchableOpacity onPress={onSignUpPress}>
          <Text className="text-axia-green text-base font-semibold">
            Crear cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;

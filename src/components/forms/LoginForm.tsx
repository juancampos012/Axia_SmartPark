import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onLogin?: (credentials: LoginCredentials) => void;
  loading?: boolean;
  containerClassName?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  loading = false,
  containerClassName = "",
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    const credentials: LoginCredentials = { email, password };
    
    if (onLogin) {
      onLogin(credentials);
    } else {
      // Login por defecto
      Alert.alert('Éxito', 'Inicio de sesión exitoso', [
        { text: 'OK', onPress: () => router.replace('/(home)') }
      ]);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Contraseña', 'Funcionalidad próximamente disponible');
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <View className={`bg-white rounded-xl p-6 m-4 shadow-sm ${containerClassName}`}>
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Iniciar Sesión
        </Text>
        <Text className="text-gray-600 text-center">
          Accede a tu cuenta de AxiaSmartPark
        </Text>
      </View>

      <Input
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        containerClassName="mb-4"
      />

      <Input
        label="Contraseña"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
        containerClassName="mb-4"
      />

      <TouchableOpacity
        onPress={handleForgotPassword}
        className="mb-6"
      >
        <Text className="text-blue-500 text-right font-medium">
          ¿Olvidaste tu contraseña?
        </Text>
      </TouchableOpacity>

      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
        loading={loading}
        variant="primary"
        size="lg"
        containerClassName="mb-4"
      />

      <View className="flex-row justify-center items-center">
        <Text className="text-gray-600">
          ¿No tienes cuenta? 
        </Text>
        <TouchableOpacity onPress={handleRegister} className="ml-2">
          <Text className="text-blue-500 font-medium">
            Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;

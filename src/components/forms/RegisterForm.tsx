import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface RegisterFormProps {
  onRegister?: (userData: RegisterData) => void;
  loading?: boolean;
  containerClassName?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  loading = false,
  containerClassName = "",
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!firstName) newErrors.firstName = 'El nombre es requerido';
    if (!lastName) newErrors.lastName = 'El apellido es requerido';
    
    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!phone) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido (10 dígitos)';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    const userData: RegisterData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    };
    
    if (onRegister) {
      onRegister(userData);
    } else {
      // Registro por defecto
      Alert.alert('Éxito', 'Registro exitoso. Bienvenido a AxiaSmartPark!', [
        { text: 'OK', onPress: () => router.replace('/(home)') }
      ]);
    }
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View className={`bg-white rounded-xl p-6 m-4 shadow-sm ${containerClassName}`}>
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Crear Cuenta
        </Text>
        <Text className="text-gray-600 text-center">
          Únete a AxiaSmartPark y encuentra tu parqueadero ideal
        </Text>
      </View>

      <View className="flex-row space-x-3 mb-4">
        <Input
          label="Nombre"
          placeholder="Juan"
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
          containerClassName="flex-1"
        />
        
        <Input
          label="Apellido"
          placeholder="Pérez"
          value={lastName}
          onChangeText={setLastName}
          error={errors.lastName}
          containerClassName="flex-1"
        />
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
        label="Teléfono"
        placeholder="3001234567"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        error={errors.phone}
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

      <Input
        label="Confirmar Contraseña"
        placeholder="••••••••"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={errors.confirmPassword}
        containerClassName="mb-6"
      />

      <Button
        title="Crear Cuenta"
        onPress={handleRegister}
        loading={loading}
        variant="primary"
        size="lg"
        containerClassName="mb-4"
      />

      <View className="flex-row justify-center items-center">
        <Text className="text-gray-600">
          ¿Ya tienes cuenta? 
        </Text>
        <TouchableOpacity onPress={handleLogin} className="ml-2">
          <Text className="text-blue-500 font-medium">
            Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;

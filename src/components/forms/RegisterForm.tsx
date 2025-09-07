import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
  onLoginPress?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onLoginPress }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSubmit) {
        onSubmit(formData);
      } else {
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <View className="w-full px-6">
      <Input
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => updateField('fullName', text)}
        autoCapitalize="words"
        error={errors.fullName}
      />

      <Input
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => updateField('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <Input
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => updateField('password', text)}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
      />

      <Input
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => updateField('phone', text)}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <Button
        title="SIGN UP"
        onPress={handleSubmit}
        loading={isLoading}
        className="w-full mt-4"
      />

      <View className="flex-row justify-center items-center mt-6">
        <Text className="text-axia-gray text-base">
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text className="text-axia-green text-base font-semibold">
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;
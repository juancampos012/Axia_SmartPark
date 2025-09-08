import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => void;
  onLoginPress?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onLoginPress }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: ''
    }
  });

  const submitForm = async (data: RegisterFormData) => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (onSubmit) {
        onSubmit(data);
      } else {
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al crear la cuenta');
    }
  };

  return (
    <View className="w-full px-6">
      {/* First Name */}
      <Controller
        control={control}
        name="firstName"
        rules={{ 
          required: 'El nombre es requerido',
          validate: {
            letters: (value) =>
              /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value) || 'El nombre solo puede contener letras',
          }
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="First Name"
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
            error={errors.firstName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        rules={{ 
          required: 'El apellido es requerido',
          validate: {
            letters: (value) =>
              /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value) || 'El apellido solo puede contener letras',
          }
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Last Name"
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
            error={errors.lastName?.message}
          />
        )}
      />  

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'El email es requerido',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'El email no es válido'
          }
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'La contraseña es requerida',
          minLength: { value: 7, message: 'Debe contener minimo 7 caracteres' },
          validate: {
            hasUppercase: (value) =>
              /[A-Z]/.test(value) || 'Debe contener al menos una mayúscula',
            hasSpecialChar: (value) =>
              /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(value) ||
              'Debe contener al menos un carácter especial',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password?.message}
          />
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        rules={{ 
          required: 'El teléfono es requerido',
          minLength: { value: 10, message: 'El telefono debe tener minimo 10 caracteres' }, 
          maxLength: { value: 10, message: 'El telefono debe tener maximo 10 caracteres' }, 
          validate: {
            number: (value) =>
              /^[0-9]+$/.test(value) || 'Solo puede contener números',
          }
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Phone"
            value={value}
            onChangeText={onChange}
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />
        )}
      />

      {/* Botón */}
      <Button
        title="SIGN UP"
        onPress={handleSubmit(submitForm)}
        loading={isSubmitting}
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

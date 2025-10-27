import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Checkbox from '../../atoms/Checkbox';
import { useRegisterForm } from '../../../hooks/useRegisterForm';

interface OriginalFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface RegisterFormProps {
  onSubmit?: (data: OriginalFormValues) => void;
  onLoginPress?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onLoginPress }) => {
  const { control, errors, isSubmitting, passwordValue, handleSubmit } = useRegisterForm({
    onSuccess: onSubmit,
    onLoginPress
  });

  const handleOpenTerms = () => {
    Linking.openURL('https://tu-sitio.com/terminos');
  };

  // Extrae errores individuales de la contraseña si existen
  const passwordErrors = errors.password?.message
    ? (Array.isArray(errors.password.message) ? errors.password.message : [errors.password.message])
    : [];

  return (
    <View className="w-full">
      <View className="space-y-4 mb-6">
        {/* Nombre */}
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nombre"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={errors.firstName?.message}
              leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
            />
          )}
        />

        {/* Apellido */}
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Apellido"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={errors.lastName?.message}
              leftIcon={<Ionicons name="people-outline" size={20} color="#6B7280" />}
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
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

        {/* Teléfono */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Teléfono (ej: 3001234567)"
              value={value}
              onChangeText={(text) => {
                const cleanText = text.replace(/\D/g, '').slice(0, 10);
                onChange(cleanText);
              }}
              keyboardType="phone-pad"
              error={errors.phone?.message}
              leftIcon={<Ionicons name="call-outline" size={20} color="#6B7280" />}
            />
          )}
        />

        {/* Contraseña */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                placeholder="Contraseña"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                error={undefined} // mostramos errores separados debajo
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
              />
              {passwordErrors.map((msg, idx) => (
                <Text key={idx} className="text-red-400 text-xs mt-1 ml-1">
                  {msg}
                </Text>
              ))}
            </>
          )}
        />

        {/* Confirmar contraseña */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmar contraseña"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword?.message}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
            />
          )}
        />
      </View>

      {/* Términos y condiciones */}
      <Controller
        control={control}
        name="acceptTerms"
        render={({ field: { onChange, value } }) => (
          <View className="bg-axia-darkGray/50 rounded-2xl p-4 mb-6">
            <View className="flex-row items-start">
              <Checkbox value={value} onValueChange={onChange} />
              <Pressable onPress={() => onChange(!value)} className="flex-1 ml-3">
                <Text className="text-axia-gray text-sm font-primary leading-5">
                  Acepto los{' '}
                  <Text className="text-axia-green font-primaryBold" onPress={handleOpenTerms}>
                    términos y condiciones
                  </Text>{' '}
                  de Axia SmartPark
                </Text>
              </Pressable>
            </View>
            {errors.acceptTerms && (
              <Text className="text-red-400 text-sm mt-2 ml-8">
                {errors.acceptTerms.message}
              </Text>
            )}
          </View>
        )}
      />

      {/* Botón de registro */}
      <Button
        title="Crear cuenta"
        onPress={handleSubmit}
        loading={isSubmitting}
        className="w-full mb-8 shadow-lg shadow-axia-green/25"
        size="large"
      />

      {/* Enlace a login */}
      <View className="bg-axia-darkGray/30 rounded-2xl p-6 items-center">
        <Text className="text-axia-gray text-base font-primary mb-2">
          ¿Ya tienes una cuenta?
        </Text>
        <Pressable onPress={onLoginPress} className="active:scale-95">
          <Text className="text-axia-green text-lg font-primaryBold">Iniciar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RegisterForm;

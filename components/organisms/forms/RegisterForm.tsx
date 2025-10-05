import React from 'react';
import { View, Text, Pressable, Alert, Linking } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Checkbox from '../../atoms/Checkbox';
import { registerAuth } from '../../../libs/auth';
import type { RegisterDTO } from '../../../interfaces/Auth';
import { Ionicons } from '@expo/vector-icons';

interface OriginalFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

type FormValues = OriginalFormValues & {
  confirmPassword: string;
  acceptTerms: boolean;
};

interface RegisterFormProps {
  onSubmit?: (data: OriginalFormValues) => void;
  onLoginPress?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onLoginPress }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false
    }
  });

  const passwordValue = watch('password');

  const submitForm = async (data: FormValues) => {
    try {
      if (data.password !== data.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
      if (!data.acceptTerms) {
        Alert.alert('Términos', 'Debes aceptar los términos y condiciones');
        return;
      }

      const payload: RegisterDTO & { confirmPassword?: string; acceptTerms?: boolean } = {
        name: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phoneNumber: data.phone.trim(),
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms
      };

      const result = await registerAuth(payload as any);

      if (result.verificationRequired) {
        Alert.alert(
          'Verificación requerida', 
          'Te hemos enviado un email de verificación. Por favor revisa tu bandeja de entrada y sigue las instrucciones.',
          [
            {
              text: 'OK',
              onPress: () => {
                reset();
                onLoginPress?.();
              }
            }
          ]
        );
        return;
      }

      onSubmit?.({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone
      });

      Alert.alert('Éxito', result.message || 'Cuenta creada exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            onLoginPress?.();
          }
        }
      ]);
    } catch (err: any) {
      let errorMessage = 'No se pudo registrar';
      
      if (err.message) {
        if (err.message.includes('email') && err.message.includes('already')) {
          errorMessage = 'Este email ya está registrado. Intenta con otro email o inicia sesión.';
        } else if (err.message.includes('phone')) {
          errorMessage = 'Este número de teléfono ya está registrado.';
        } else {
          errorMessage = err.message;
        }
      }
      
      Alert.alert('Error en registro', errorMessage);
    }
  };

  const handleOpenTerms = () => {
    // Aquí puedes agregar la URL de tus términos y condiciones
    Linking.openURL('https://tu-sitio.com/terminos');
  };

  return (
    <View className="w-full">
      {/* Campos del formulario con iconos */}
      <View className="space-y-4 mb-6">
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
              placeholder="Nombre"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={errors.firstName?.message}
              leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
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
              placeholder="Apellido"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={errors.lastName?.message}
              leftIcon={<Ionicons name="people-outline" size={20} color="#6B7280" />}
            />
          )}
        />

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
          name="phone"
          rules={{
            required: 'El teléfono es requerido',
            minLength: { value: 10, message: 'El teléfono debe tener mínimo 10 dígitos' },
            maxLength: { value: 10, message: 'El teléfono debe tener máximo 10 dígitos' },
            validate: {
              colombianFormat: (value) => {
                const cleanPhone = value.replace(/\D/g, '');
                if (cleanPhone.length !== 10) {
                  return 'El teléfono debe tener exactamente 10 dígitos';
                }
                if (!/^[1-8]|^3[0-9]/.test(cleanPhone)) {
                  return 'Formato de teléfono colombiano no válido';
                }
                return true;
              }
            }
          }}
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

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'La contraseña es requerida',
            minLength: { value: 7, message: 'Debe contener mínimo 7 caracteres' },
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

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: 'Confirma tu contraseña',
            validate: (value) => value === passwordValue || 'Las contraseñas no coinciden'
          }}
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
        rules={{ validate: (v) => v === true || 'Debes aceptar los términos' }}
        render={({ field: { onChange, value } }) => (
          <View className="bg-axia-darkGray/50 rounded-2xl p-4 mb-6">
            <View className="flex-row items-start">
              <Checkbox value={value} onValueChange={onChange} />
              <Pressable 
                onPress={() => onChange(!value)} 
                className="flex-1 ml-3"
              >
                <Text className="text-axia-gray text-sm font-primary leading-5">
                  Acepto los{' '}
                  <Text 
                    className="text-axia-green font-primaryBold"
                    onPress={handleOpenTerms}
                  >
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
        onPress={handleSubmit(submitForm)}
        loading={isSubmitting}
        className="w-full mb-8 shadow-lg shadow-axia-green/25"
        size="large"
      />

      {/* Enlace a login */}
      <View className="bg-axia-darkGray/30 rounded-2xl p-6 items-center">
        <Text className="text-axia-gray text-base font-primary mb-2">
          ¿Ya tienes una cuenta?
        </Text>
        <Pressable 
          onPress={onLoginPress}
          className="active:scale-95"
        >
          <Text className="text-axia-green text-lg font-primaryBold">
            Iniciar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RegisterForm;
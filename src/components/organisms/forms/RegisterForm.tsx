import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Checkbox from '../../atoms/Checkbox';
import { registerAuth } from '../../../../libs/auth';
import type { RegisterDTO } from '../../../../interfaces/Auth';

interface OriginalFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

// Extend with the extra fields we added
type FormValues = OriginalFormValues & {
  confirmPassword: string;
  acceptTerms: boolean;
};

interface RegisterFormProps {
  onSubmit?: (data: OriginalFormValues) => void; // optional external callback (keeps original shape)
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
      // Front validations already in rules; add a last-safety check for password match & acceptTerms
      if (data.password !== data.confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }
      if (!data.acceptTerms) {
        Alert.alert('Términos', 'Debes aceptar los términos y condiciones');
        return;
      }

      // Map to RegisterDTO expected by backend
      const payload: RegisterDTO & { confirmPassword?: string; acceptTerms?: boolean } = {
        name: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        phoneNumber: data.phone.trim(),
        // extras (some backends expect these; otherwise backend can ignore)
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms
      };

      // Call backend registration
      const result = await registerAuth(payload as any);

      // Handle verification requirement
      if (result.verificationRequired) {
        Alert.alert(
          'Verificación requerida', 
          'Te hemos enviado un email de verificación. Por favor revisa tu bandeja de entrada y sigue las instrucciones.',
          [
            {
              text: 'OK',
              onPress: () => {
                reset();
                onLoginPress?.(); // Navigate to login
              }
            }
          ]
        );
        return;
      }

      // If the caller passed an onSubmit we keep backward compatibility and return the original shape
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
      // Enhanced error handling
      let errorMessage = 'No se pudo registrar';
      
      if (err.message) {
        // Check for specific error types
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
            placeholder="Nombre"
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
            error={errors.firstName?.message}
          />
        )}
      />

      {/* Last Name */}
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
            placeholder="Correo electrónico"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />
        )}
      />

      {/* Password (same rules as original) */}
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
          />
        )}
      />

      {/* Confirm Password (new) */}
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
          />
        )}
      />

      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        rules={{
          required: 'El teléfono es requerido',
          minLength: { value: 10, message: 'El teléfono debe tener mínimo 10 dígitos' },
          maxLength: { value: 10, message: 'El teléfono debe tener máximo 10 dígitos' },
          validate: {
            colombianFormat: (value) => {
              // Colombian mobile numbers: 3XX XXXXXXX (10 digits starting with 3)
              // Colombian landline: 1-8 followed by 7 digits
              const cleanPhone = value.replace(/\D/g, ''); // Remove non-digits
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
              // Allow only numbers and limit to 10 digits
              const cleanText = text.replace(/\D/g, '').slice(0, 10);
              onChange(cleanText);
            }}
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />
        )}
      />

      {/* Accept terms (new) */}
      <Controller
        control={control}
        name="acceptTerms"
        rules={{ validate: (v) => v === true || 'Debes aceptar los términos' }}
        render={({ field: { onChange, value } }) => (
          <View className="flex-row items-center my-4">
            <Checkbox value={value} onValueChange={onChange} />
            <TouchableOpacity onPress={() => onChange(!value)}>
              <Text className="ml-3 text-axia-gray">Acepto los términos y condiciones</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Submit */}
      <Button
        title="Crear cuenta"
        onPress={handleSubmit(submitForm)}
        loading={isSubmitting}
        className="w-full mt-4"
      />

      <View className="flex-row justify-center items-center mt-6">
        <Text className="text-axia-gray text-base">
          ¿Ya tienes una cuenta?{' '}
        </Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text className="text-axia-green text-base font-semibold">
            Iniciar sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterForm;

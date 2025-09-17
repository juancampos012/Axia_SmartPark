import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '../ui/Input';

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  dateOfBirth: string;
}

interface PersonalInfoFormProps {
  initialData?: PersonalInfoFormData;
  isEditing?: boolean;
  onSubmit?: (data: PersonalInfoFormData) => void;
  onCancel?: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  initialData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    identification: '',
    dateOfBirth: ''
  },
  isEditing = false,
  onSubmit,
  onCancel
}) => {

  const { control, handleSubmit, formState: { errors }, reset } = useForm<PersonalInfoFormData>({
    defaultValues: initialData
  });

  const submitForm = (data: PersonalInfoFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleCancelPress = () => {
    // Restaurar valores originales
    reset(initialData);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <View className="w-full px-6">
      
      {/* Formulario */}
      <View className="space-y-4">
        
        {/* Nombres */}
        <View>
          <Text className="text-white text-sm font-medium mb-2">
            Nombre
          </Text>
          <Controller
            control={control}
            name="firstName"
            rules={{
              required: 'El nombre es obligatorio',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nombre"
                value={value}
                onChangeText={onChange}
                error={errors.firstName?.message}
                editable={isEditing}
              />
            )}
          />
        </View>

        {/* Apellidos */}
        <View>
          <Text className="text-white text-sm font-medium mb-2">
            Apellido
          </Text>
          <Controller
            control={control}
            name="lastName"
            rules={{
              required: 'El apellido es obligatorio',
              minLength: {
                value: 2,
                message: 'El apellido debe tener al menos 2 caracteres'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Apellido"
                value={value}
                onChangeText={onChange}
                error={errors.lastName?.message}
                editable={false}
              />
            )}
          />
        </View>

        {/* Email */}
        <View>
          <Text className="text-white text-sm font-medium mb-2">
            Correo electrónico
          </Text>
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
                editable={isEditing}
              />
            )}
          />
        </View>

        {/* Teléfono */}
        <View>
          <Text className="text-white text-sm font-medium mb-2">
            Teléfono
          </Text>
          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'El teléfono es obligatorio',
              pattern: {
                value: /^[+]?[\d\s\-()]+$/,
                message: 'Número de teléfono inválido'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Teléfono"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                error={errors.phone?.message}
                editable={isEditing}
              />
            )}
          />
        </View>

        {/* Identificación */}
        <View>
          <Text className="text-white text-sm font-medium mb-2">
            Identificación
          </Text>
          <Controller
            control={control}
            name="identification"
            rules={{
              required: 'La identificación es obligatoria',
              minLength: {
                value: 6,
                message: 'La identificación debe tener al menos 6 caracteres'
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Número de identificación"
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                error={errors.identification?.message}
                editable={false}
              />
            )}
          />
        </View>

        {/* Fecha de nacimiento */}
        <View>
          <Text className="text-white text-sm font-medium mb-2">
            Fecha de nacimiento
          </Text>
          <Controller
            control={control}
            name="dateOfBirth"
            rules={{
              required: 'La fecha de nacimiento es obligatoria'
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="DD/MM/YYYY"
                value={value}
                onChangeText={onChange}
                error={errors.dateOfBirth?.message}
                editable={false}
              />
            )}
          />
        </View>

      </View>

      {/* Botones de acción */}
      {isEditing && (
        <View className="mt-8 flex-row space-x-4">
          <TouchableOpacity
            onPress={handleSubmit(submitForm)}
            className="flex-1 bg-axia-green py-4 rounded-xl items-center justify-center mr-2"
          >
            <Text className="text-axia-black text-lg font-semibold">
              Guardar cambios
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleCancelPress}
            className="flex-1 bg-transparent border-2 border-axia-green py-4 rounded-xl items-center justify-center ml-2"
          >
            <Text className="text-axia-green text-lg font-semibold">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

export default PersonalInfoForm;
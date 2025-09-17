import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Input from '../../atoms/Input';
import Switch from '../../atoms/Switch';

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
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
    active: true,
    createdAt: ''
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

        {/* Estado activo */}
        <View>
          <Text className="text-white text-sm font-medium mb-3">
            Estado de la cuenta
          </Text>
          <Controller
            control={control}
            name="active"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                disabled={!isEditing}
                label={value ? "Cuenta activa" : "Cuenta inactiva"}
                className="bg-[#161B22] rounded-xl p-4"
              />
            )}
          />
        </View>

        {/* Usuario desde */}
        <View>
          <Text className="text-white text-sm font-medium mb-2">
            Usuario desde
          </Text>
          <Controller
            control={control}
            name="createdAt"
            render={({ field: { value } }) => (
              <View className="bg-[#161B22] rounded-xl p-4 border border-white/10">
                <Text className="text-white/80 text-base">
                  {value ? new Date(value).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'No disponible'}
                </Text>
              </View>
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
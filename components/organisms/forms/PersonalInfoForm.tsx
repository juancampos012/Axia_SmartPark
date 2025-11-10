import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Controller } from "react-hook-form";
import Input from "../../atoms/Input";
import { usePersonalInfoForm } from "../../../hooks/";

interface PersonalInfoFormProps {
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    active: boolean;
    createdAt: string;
  };
  isEditing?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
}) => {
  const { control, errors, handleSubmit, handleCancelPress } = usePersonalInfoForm({
    initialData,
    onSubmit,
    onCancel,
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmitPress = async () => {
    setSubmitting(true);
    try {
      await handleSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="w-full px-6">
      <View className="space-y-4">
        {/* Nombre */}
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <View>
              <Text className="text-white text-sm font-primary mb-2">Nombre</Text>
              <Input
                placeholder="Nombre"
                value={value}
                onChangeText={onChange}
                error={errors.firstName?.message}
                editable={isEditing}
              />
            </View>
          )}
        />

        {/* Apellido */}
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <View>
              <Text className="text-white text-sm font-primary mb-2">Apellido</Text>
              <Input
                placeholder="Apellido"
                value={value}
                onChangeText={onChange}
                error={errors.lastName?.message}
                editable={isEditing}
              />
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <View>
              <Text className="text-white text-sm font-primary mb-2">Correo electrónico</Text>
              <Input
                placeholder="Correo electrónico"
                value={value}
                onChangeText={() => {}}
                editable={false}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            </View>
          )}
        />

        {/* Teléfono */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <View>
              <Text className="text-white text-sm font-primary mb-2">Teléfono</Text>
              <Input
                placeholder="Teléfono"
                value={value}
                onChangeText={onChange}
                keyboardType="phone-pad"
                error={errors.phone?.message}
                editable={isEditing}
              />
            </View>
          )}
        />

        {/* Botones de acción */}
        {isEditing && (
          <View className="mt-8 flex-row space-x-4">
            <Pressable
              onPress={onSubmitPress}
              disabled={submitting}
              className={`flex-1 py-4 rounded-xl items-center justify-center mr-2 ${
                submitting ? "bg-gray-500 opacity-50" : "bg-axia-green active:opacity-80"
              }`}
            >
              <Text
                className={`text-lg font-primaryBold ${
                  submitting ? "text-gray-300" : "text-axia-black"
                }`}
              >
                {submitting ? "Guardando..." : "Guardar cambios"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCancelPress}
              disabled={submitting}
              className="flex-1 bg-transparent border-2 border-axia-green py-4 rounded-xl items-center justify-center ml-2 active:opacity-70 disabled:opacity-50"
            >
              <Text className="text-axia-green text-lg font-primaryBold">Cancelar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default PersonalInfoForm;

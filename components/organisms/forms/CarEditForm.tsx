// components/organisms/forms/CarEditForm.tsx
import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Controller } from "react-hook-form";
import Input from "../../atoms/Input";
import { useCarEditForm } from "../../../hooks/useCarEditForm";
import { CarFormData } from "../../../schemas/carEditSchema";

interface CarEditFormProps {
  initialData?: CarFormData;
  isEditing?: boolean;
  onSubmit?: (data: CarFormData) => void;
  onCancel?: () => void;
}

const CarEditForm: React.FC<CarEditFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
}) => {
  const { control, errors, handleSubmit, handleCancelPress, isSubmitting } = useCarEditForm({
    initialData,
    onSubmit,
    onCancel,
  });

  const engineTypes = [
    { label: "Gasolina", value: "GASOLINA" },
    { label: "Diesel", value: "DIESEL" },
    { label: "Eléctrico", value: "ELÉCTRICO" },
    { label: "Híbrido", value: "HÍBRIDO" },
    { label: "Gas", value: "GAS" },
  ];

  const onSubmitPress = async () => {
    await handleSubmit();
  };

  // Vista de solo lectura
  if (!isEditing) {
    return (
      <View className="bg-axia-darkGray rounded-2xl p-6">
        <View className="space-y-6">
          <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
            <Text className="text-axia-gray font-primary">Marca</Text>
            <Text className="text-white font-primaryBold">{initialData?.carBrand || "No especificado"}</Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
            <Text className="text-axia-gray font-primary">Modelo</Text>
            <Text className="text-white font-primaryBold">{initialData?.model || "No especificado"}</Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
            <Text className="text-axia-gray font-primary">Placa</Text>
            <Text className="text-white font-primaryBold">{initialData?.licensePlate || "No especificado"}</Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
            <Text className="text-axia-gray font-primary">Tipo de motor</Text>
            <Text className="text-white font-primaryBold">{initialData?.engineType || "No especificado"}</Text>
          </View>

          <View className="flex-row justify-between items-center py-3">
            <Text className="text-axia-gray font-primary">Color</Text>
            <Text className="text-white font-primaryBold">{initialData?.color || "No especificado"}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Vista de edición
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="bg-axia-darkGray rounded-2xl p-6 mb-6">
        {/* Marca */}
        <Controller
          control={control}
          name="carBrand"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Text className="text-white text-sm font-primary mb-2">Marca del vehículo</Text>
              <Input
                placeholder="Ej: Toyota, Hyundai, Kia..."
                value={value}
                onChangeText={onChange}
                error={errors.carBrand?.message}
                editable={isEditing}
              />
            </View>
          )}
        />

        {/* Modelo */}
        <Controller
          control={control}
          name="model"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Text className="text-white text-sm font-primary mb-2">Modelo</Text>
              <Input
                placeholder="Ej: Corolla, Tucson, Picanto..."
                value={value}
                onChangeText={onChange}
                error={errors.model?.message}
                editable={isEditing}
              />
            </View>
          )}
        />


        {/* Placa */}
        <Controller
          control={control}
          name="licensePlate"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Text className="text-white text-sm font-primary mb-2">Placa</Text>
              <Input
                placeholder="Ej: ABC123, XYZ789..."
                value={value}
                onChangeText={onChange}
                error={errors.licensePlate?.message}
                editable={isEditing}
                autoCapitalize="characters"
              />
            </View>
          )}
        />

        {/* Tipo de Motor */}
        <Controller
          control={control}
          name="engineType"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Text className="text-white text-sm font-primary mb-2">Tipo de motor</Text>
              <View className="flex-row flex-wrap -mx-1">
                {engineTypes.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => onChange(type.value)}
                    className={`px-4 py-3 rounded-xl mx-1 mb-2 flex-1 min-w-[45%] ${
                      value === type.value 
                        ? 'bg-axia-green border border-axia-green' 
                        : 'bg-axia-gray/20 border border-axia-gray/30'
                    }`}
                  >
                    <Text 
                      className={`text-center font-primary ${
                        value === type.value ? 'text-axia-black font-primaryBold' : 'text-white'
                      }`}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.engineType?.message && (
                <Text className="text-red-400 text-xs font-primary mt-2">
                  {errors.engineType.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Color */}
        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Text className="text-white text-sm font-primary mb-2">Color</Text>
              <Input
                placeholder="Ej: Rojo, Azul, Negro, Blanco..."
                value={value}
                onChangeText={onChange}
                error={errors.color?.message}
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
              disabled={isSubmitting}
              className={`flex-1 py-4 rounded-xl items-center justify-center mr-2 ${
                isSubmitting ? "bg-gray-500 opacity-50" : "bg-axia-green active:opacity-80"
              }`}
            >
              <Text
                className={`text-lg font-primaryBold ${
                  isSubmitting ? "text-gray-300" : "text-axia-black"
                }`}
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCancelPress}
              disabled={isSubmitting}
              className="flex-1 bg-transparent border-2 border-axia-green py-4 rounded-xl items-center justify-center ml-2 active:opacity-70 disabled:opacity-50"
            >
              <Text className="text-axia-green text-lg font-primaryBold">Cancelar</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CarEditForm;
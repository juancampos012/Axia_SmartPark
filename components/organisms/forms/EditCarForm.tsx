import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Input from '../../atoms/Input';
import useEditCarForm from '../../../hooks/useEditCarForm';

interface EditCarFormProps {
  carId: string;
  onSuccess?: () => void;
}

export default function EditCarForm({ carId, onSuccess }: EditCarFormProps) {
  const {
    control,
    errors,
    isSubmitting,
    type,
    engineType,
    getPlatePlaceholder,
    handleSubmit,
    handleCancel,
    setType,
    setEngineType,
  } = useEditCarForm({ carId, onSuccess });

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full">
        {/* Marca */}
        <Controller
          control={control}
          name="brand"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Input
                placeholder="Marca (Ej: Toyota)"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                leftIcon={<Ionicons name="car-sport" size={20} color="#6B7280" />}
              />
              {errors.brand && (
                <Text className="text-red-400 text-xs ml-1 mt-1">{errors.brand?.message}</Text>
              )}
            </View>
          )}
        />

        {/* Modelo */}
        <Controller
          control={control}
          name="model"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Input
                placeholder="Modelo (Ej: Corolla)"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                leftIcon={<Ionicons name="construct" size={20} color="#6B7280" />}
              />
              {errors.model && (
                <Text className="text-red-400 text-xs ml-1 mt-1">{errors.model?.message}</Text>
              )}
            </View>
          )}
        />

        {/* Tipo y motor (reuse AddCar style) */}
        <View className="mb-6">
          <Text className="text-white/80 text-sm font-primary mb-3 ml-1">Tipo de vehículo</Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { value } }) => (
              <View>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setType('CAR')}
                    className={`flex-1 rounded-xl border ${
                      value === 'CAR' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'
                    } px-4 py-3 flex-row items-center justify-center`}
                  >
                    <Ionicons name="car-sport" size={20} color={value === 'CAR' ? '#FFF' : '#9CA3AF'} style={{ marginRight: 8 }} />
                    <Text className={`${value === 'CAR' ? 'text-white' : 'text-white/60'} font-primaryBold`}>Carro</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setType('MOTORCYCLE')}
                    className={`flex-1 rounded-xl border ${
                      value === 'MOTORCYCLE' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'
                    } px-4 py-3 flex-row items-center justify-center`}
                  >
                    <Ionicons name="bicycle" size={20} color={value === 'MOTORCYCLE' ? '#FFF' : '#9CA3AF'} style={{ marginRight: 8 }} />
                    <Text className={`${value === 'MOTORCYCLE' ? 'text-white' : 'text-white/60'} font-primaryBold`}>Moto</Text>
                  </Pressable>
                </View>
                {errors.type && <Text className="text-red-400 text-xs mt-2 ml-1">{errors.type?.message}</Text>}
              </View>
            )}
          />
        </View>

        <View className="mb-6">
          <Text className="text-white/80 text-sm font-primary mb-3 ml-1">Tipo de motor</Text>
          <Controller
            control={control}
            name="engineType"
            render={({ field: { value } }) => (
              <View>
                <View className="flex-row gap-3">
                  <Pressable onPress={() => setEngineType('GASOLINE')} className={`flex-1 rounded-xl border ${value === 'GASOLINE' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-3 py-3`}>
                    <View className="items-center">
                      <FontAwesome5 name="gas-pump" size={24} color={value === 'GASOLINE' ? '#FFF' : '#9CA3AF'} />
                      <Text className={`text-xs mt-1 ${value === 'GASOLINE' ? 'text-white' : 'text-white/60'} font-primary`}>Gasolina</Text>
                    </View>
                  </Pressable>

                  <Pressable onPress={() => setEngineType('ELECTRIC')} className={`flex-1 rounded-xl border ${value === 'ELECTRIC' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-3 py-3`}>
                    <View className="items-center">
                      <MaterialIcons name="electric-car" size={24} color={value === 'ELECTRIC' ? '#FFF' : '#9CA3AF'} />
                      <Text className={`text-xs mt-1 ${value === 'ELECTRIC' ? 'text-white' : 'text-white/60'} font-primary`}>Eléctrico</Text>
                    </View>
                  </Pressable>

                  <Pressable onPress={() => setEngineType('HYBRID')} className={`flex-1 rounded-xl border ${value === 'HYBRID' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-3 py-3`}>
                    <View className="items-center">
                      <FontAwesome5 name="plug" size={24} color={value === 'HYBRID' ? '#FFF' : '#9CA3AF'} />
                      <Text className={`text-xs mt-1 ${value === 'HYBRID' ? 'text-white' : 'text-white/60'} font-primary`}>Híbrido</Text>
                    </View>
                  </Pressable>
                </View>
                {errors.engineType && <Text className="text-red-400 text-xs mt-2 ml-1">{errors.engineType?.message}</Text>}
              </View>
            )}
          />
        </View>

        {/* Color */}
        <Controller control={control} name="color" render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Input placeholder="Color (Ej: Blanco)" value={value} onChangeText={onChange} autoCapitalize="words" leftIcon={<Ionicons name="color-palette" size={20} color="#6B7280" />} />
            {errors.color && <Text className="text-red-400 text-xs ml-1 mt-1">{errors.color?.message}</Text>}
          </View>
        )} />

        <Controller control={control} name="plate" render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Input placeholder={getPlatePlaceholder()} value={value} onChangeText={(text) => onChange(text.toUpperCase())} autoCapitalize="characters" leftIcon={<Ionicons name="document-text" size={20} color="#6B7280" />} />
            {errors.plate && <Text className="text-red-400 text-xs ml-1 mt-1">{errors.plate?.message}</Text>}
          </View>
        )} />

        <Pressable disabled={isSubmitting} onPress={handleSubmit} className="mt-6 w-full rounded-2xl bg-axia-green shadow-elevated disabled:opacity-50" android_ripple={{ color: '#004d3b' }}>
          <View className="h-14 rounded-2xl items-center justify-center">
            <Text className="text-white text-lg font-semibold tracking-wide">{isSubmitting ? 'Guardando...' : 'Guardar cambios'}</Text>
          </View>
        </Pressable>

        <Pressable onPress={handleCancel} className="mt-4 active:opacity-70" disabled={isSubmitting}>
          <Text className="text-axia-gray text-center text-base font-primary">Cancelar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useParkingForm } from '../../../hooks/useParkingForm';

const EditParkingScreen = () => {
  const router = useRouter();
  
  const {
    loading,
    saving,
    name,
    setName,
    address,
    setAddress,
    description,
    setDescription,
    schedule,
    setSchedule,
    hourlyCarRate,
    setHourlyCarRate,
    hourlyMotorcycleRate,
    setHourlyMotorcycleRate,
    dailyRate,
    setDailyRate,
    monthlyRate,
    setMonthlyRate,
    status,
    setStatus,
    handleSave,
    formErrors,
  } = useParkingForm(
    () => {
      router.replace({
        pathname: '/(tabs)/parkings', 
        params: { refresh: Date.now().toString() } 
      });
    }, 
    () => router.back()
  );

  const statuses = [
    { value: 'OPEN' as const, label: 'Abierto', color: 'bg-green-500' },
    { value: 'CLOSED' as const, label: 'Cerrado', color: 'bg-red-500' },
    { value: 'FULL' as const, label: 'Lleno', color: 'bg-orange-500' },
    { value: 'MAINTENANCE' as const, label: 'Mantenimiento', color: 'bg-yellow-500' },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-axia-gray text-sm font-primary mt-4">Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-axia-gray/20">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="text-white text-lg font-primaryBold">
            Editar Parqueadero
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6 space-y-4">
            {/* Información General */}
            <View className="mb-4">
              <Text className="text-white text-lg font-primaryBold mb-4">
                Información General
              </Text>

              <View className="space-y-4">
                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">
                    Nombre del Parqueadero
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ej: Parqueadero Central"
                    placeholderTextColor="#6B7280"
                    className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
                  />
                  {formErrors?.name ? (
                    <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.name}</Text>
                  ) : null}
                </View>

                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">Dirección</Text>
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Calle 123 #45-67"
                    placeholderTextColor="#6B7280"
                    multiline
                    numberOfLines={2}
                    className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
                  />
                  {formErrors?.address ? (
                    <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.address}</Text>
                  ) : null}
                </View>

                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">
                    Descripción (Opcional)
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe el parqueadero..."
                    placeholderTextColor="#6B7280"
                    multiline
                    numberOfLines={3}
                    className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
                  />
                </View>

                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">Horario</Text>
                  <TextInput
                    value={schedule}
                    onChangeText={setSchedule}
                    placeholder="Ej: Lunes a Viernes 7:00 AM - 10:00 PM"
                    placeholderTextColor="#6B7280"
                    className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
                  />
                  {formErrors?.schedule ? (
                    <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.schedule}</Text>
                  ) : null}
                </View>
              </View>
            </View>

            {/* Tarifas */}
            <View className="mb-4">
              <Text className="text-white text-lg font-primaryBold mb-4">Tarifas</Text>

              <View className="space-y-4">
                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">
                    Tarifa por Hora - Carro
                  </Text>
                  <View className="flex-row items-center bg-axia-darkGray rounded-xl px-4 py-3">
                    <Text className="text-axia-gray font-primary mr-2">$</Text>
                    <TextInput
                      value={hourlyCarRate}
                      onChangeText={setHourlyCarRate}
                      placeholder="5000"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                      className="flex-1 text-white font-primary"
                    />
                    {formErrors?.hourlyCarRate ? (
                      <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.hourlyCarRate}</Text>
                    ) : null}
                  </View>
                </View>

                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">
                    Tarifa por Hora - Moto
                  </Text>
                  <View className="flex-row items-center bg-axia-darkGray rounded-xl px-4 py-3">
                    <Text className="text-axia-gray font-primary mr-2">$</Text>
                    <TextInput
                      value={hourlyMotorcycleRate}
                      onChangeText={setHourlyMotorcycleRate}
                      placeholder="2000"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                      className="flex-1 text-white font-primary"
                    />
                    {formErrors?.hourlyMotorcycleRate ? (
                      <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.hourlyMotorcycleRate}</Text>
                    ) : null}
                  </View>
                </View>

                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">
                    Tarifa Diaria (Opcional)
                  </Text>
                  <View className="flex-row items-center bg-axia-darkGray rounded-xl px-4 py-3">
                    <Text className="text-axia-gray font-primary mr-2">$</Text>
                    <TextInput
                      value={dailyRate}
                      onChangeText={setDailyRate}
                      placeholder="30000"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                      className="flex-1 text-white font-primary"
                    />
                    {formErrors?.dailyRate ? (
                      <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.dailyRate}</Text>
                    ) : null}
                  </View>
                </View>

                <View>
                  <Text className="text-white text-sm font-primaryBold mb-2">
                    Tarifa Mensual (Opcional)
                  </Text>
                  <View className="flex-row items-center bg-axia-darkGray rounded-xl px-4 py-3">
                    <Text className="text-axia-gray font-primary mr-2">$</Text>
                    <TextInput
                      value={monthlyRate}
                      onChangeText={setMonthlyRate}
                      placeholder="500000"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                      className="flex-1 text-white font-primary"
                    />
                    {formErrors?.monthlyRate ? (
                      <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.monthlyRate}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>

            {/* Estado */}
            <View className="mb-4">
              <Text className="text-white text-lg font-primaryBold mb-4">Estado</Text>
              <View className="bg-axia-darkGray rounded-xl overflow-hidden">
                {statuses.map((s, index) => (
                  <Pressable
                    key={s.value}
                    onPress={() => setStatus(s.value)}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      index < statuses.length - 1 ? 'border-b border-axia-gray/20' : ''
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className={`w-3 h-3 rounded-full ${s.color} mr-3`} />
                      <Text className="text-white font-primary">{s.label}</Text>
                    </View>
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        status === s.value
                          ? 'border-axia-green bg-axia-green'
                          : 'border-axia-gray'
                      }`}
                    >
                      {status === s.value && (
                        <Ionicons name="checkmark" size={14} color="#000000" />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Botón de Guardar */}
        <View className="px-6 py-4 border-t border-axia-gray/20">
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`bg-axia-green py-4 rounded-xl flex-row items-center justify-center ${
              saving ? 'opacity-50' : 'active:scale-98'
            }`}
          >
            {saving ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#000000" />
                <Text className="text-axia-black font-primaryBold ml-2">
                  Guardar Cambios
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditParkingScreen;

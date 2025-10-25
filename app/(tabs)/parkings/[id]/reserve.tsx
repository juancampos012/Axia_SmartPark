import React from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Components
import VehicleSelection from "../../../../components/organisms/parking/VehicleSelection";
import FloorSelection from "../../../../components/organisms/parking/FloorSelection";
import ReservationForm from "../../../../components/organisms/forms/ReservationForm";
import DateTimeModal from "../../../../components/molecules/parking/DateTimeModal";
import { DateTimeSelector } from "../../../../components/atoms/DateTimeSelector";
import Button from "../../../../components/atoms/Button";
import { useReserveScreen } from "../../../../hooks/useReserveScreen";

const Reserve = () => {
  const {
    // Estados de vehículos
    vehicles,
    selectedVehicle,
    loadingVehicles,
    errorVehicles,
    showVehiclePicker,
    setShowVehiclePicker,
    setSelectedVehicle,
    
    // Estados de fecha/hora
    selectedDate,
    startTime,
    endTime,
    openModal,
    setOpenModal,
    
    // Estados de selección
    selectedSpot,
    selectedFloor,
    loading,
    
    // Datos del parking
    parking,
    transformedParkingData,
    
    // Valores calculados
    totalHours,
    totalPrice,
    isValidReservation,
    
    // Funciones helper
    formatDate,
    formatTime,
    
    // Handlers
    handleSpotPress,
    handleDateTimeChange,
    handleFloorSelect,
    handleReserve,
    handleGoBack,
    handleAddVehicle,
  } = useReserveScreen();
  if (!parking) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <View className="items-center px-6">
          <Ionicons name="warning-outline" size={48} color="#6B7280" />
          <Text className="text-white text-lg font-primaryBold mt-4 text-center">
            No se pudo cargar la información del estacionamiento
          </Text>
          <Button 
            title="Volver" 
            onPress={handleGoBack} 
            variant="secondary" 
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loadingVehicles) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-white mt-2">Cargando tus vehículos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorVehicles) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="warning-outline" size={48} color="#6B7280" />
          <Text className="text-white text-center mt-4">{errorVehicles}</Text>
          <Button 
            title="Reintentar" 
            onPress={handleGoBack} 
            variant="secondary" 
          />
        </View>
      </SafeAreaView>
    );
  }

  if (vehicles.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="car-outline" size={48} color="#6B7280" />
          <Text className="text-white text-lg font-primaryBold mt-4 text-center">
            No tienes vehículos registrados
          </Text>
          <Text className="text-axia-gray text-center mt-2 mb-6">
            Para realizar una reserva, primero necesitas agregar un vehículo a tu cuenta.
          </Text>
          <Button 
            title="Agregar Vehículo" 
            onPress={handleAddVehicle} 
            variant="primary" 
          />
        </View>
      </SafeAreaView>
    );
  }

  // Render principal
  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      {loading && (
        <View className="absolute inset-0 bg-black/50 z-50 justify-center items-center">
          <View className="bg-axia-darkGray rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-white font-primaryBold mt-4">Preparando reserva...</Text>
          </View>
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          <View className="mb-6">
            <Text className="text-white text-2xl font-primaryBold text-center">
              Reservar Espacio
            </Text>
            <Text className="text-axia-gray text-center mt-2">
              {parking?.name ?? ""} - {parking?.address ?? ""}
            </Text>
          </View>

          <VehicleSelection
            selectedVehicle={selectedVehicle}
            vehicles={vehicles}
            onVehicleSelect={setSelectedVehicle}
            showPicker={showVehiclePicker}
            onShowPicker={setShowVehiclePicker}
          />

          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6 mt-4">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Fecha y Horario
            </Text>

            <DateTimeSelector
              label="Fecha"
              value={formatDate(selectedDate)}
              icon="calendar"
              onPress={() => setOpenModal("date")}
              accessibilityLabel="Seleccionar fecha de reserva"
            />

            <DateTimeSelector
              label="Hora inicio"
              value={formatTime(startTime)}
              icon="time"
              onPress={() => setOpenModal("start")}
              accessibilityLabel="Seleccionar hora de inicio"
            />

            <DateTimeSelector
              label="Hora fin"
              value={formatTime(endTime)}
              icon="time"
              onPress={() => setOpenModal("end")}
              accessibilityLabel="Seleccionar hora de fin"
            />

            <View className={`rounded-lg p-3 mt-3 ${
              isValidReservation ? 'bg-axia-green/10' : 'bg-yellow-500/10'
            }`}>
              <Text className={`font-primaryBold text-center ${
                isValidReservation ? 'text-axia-green' : 'text-yellow-500'
              }`}>
                Duración: {totalHours} hora{totalHours > 1 ? "s" : ""} • Total: COP {totalPrice.toLocaleString()}
                {!isValidReservation && ' • Verifica los horarios'}
              </Text>
            </View>
          </View>

          {(["date", "start", "end"] as ("date" | "start" | "end")[]).map((type) => (
            <DateTimeModal
              key={type}
              type={type}
              visible={openModal === type}
              onClose={() => setOpenModal(null)}
              onChange={handleDateTimeChange}
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
            />
          ))}

          <FloorSelection
            floors={transformedParkingData?.floors || []}
            selectedFloor={selectedFloor}
            selectedSpot={selectedSpot}
            selectedVehicle={selectedVehicle}
            onFloorSelect={handleFloorSelect}
            onSpotPress={handleSpotPress}
          />

          {selectedSpot && (
            <ReservationForm
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
              totalHours={totalHours}
              totalPrice={totalPrice}
              isValidReservation={isValidReservation}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          )}

          <Button
            title={selectedSpot ? "Continuar al Pago" : "Selecciona un espacio"}
            onPress={handleReserve}
            variant={selectedSpot ? "primary" : "secondary"}
            size="large"
            className="mt-4 mb-6 shadow-lg shadow-axia-green/25"
            disabled={!selectedSpot || !selectedVehicle || !isValidReservation || loading}
          />

          <View className="bg-axia-darkGray/50 rounded-2xl p-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#10B981" />
              <Text className="text-white font-primaryBold ml-2">
                Información importante
              </Text>
            </View>
            <Text className="text-axia-gray text-sm font-primary leading-5">
              • Tu espacio estará reservado de {formatTime(startTime)} a{" "}
              {formatTime(endTime)} el {formatDate(selectedDate)}{"\n"}
              • El pago se procesa de forma segura{"\n"}
              • Puedes cancelar hasta 2 horas antes sin cargo
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reserve;
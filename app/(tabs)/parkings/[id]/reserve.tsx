import React, { useState, useMemo, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Modal, Platform,Alert, ActivityIndicator, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../../../components/atoms/Button";
import ParkingSpotGrid from "../../../../components/molecules/ParkingSpotGrid";
import VehiclePickerModal from "../../../../components/molecules/VehiclePickerModal";
import { DateTimeSelector } from "../../../../components/atoms/DateTimeSelector";
import { FloorSelector } from "../../../../components/atoms/FloorSelector";
import { ReservationSummary } from "../../../../components/atoms/ReservationSummary";

// Types
interface ParkingSpot {
  id: string;
  number: string;
  status: "available" | "occupied" | "reserved" | "maintenance";
  type: "car" | "motorcycle" | "disabled";
  floor: number;
}

interface Floor {
  id: string;
  number: number;
  name: string;
  totalSpots: number;
  availableSpots: number;
  spots: ParkingSpot[];
}

interface Parking {
  id: string;
  name: string;
  address: string;
  hourlyRate: number;
  hourlyCarRate?: number;
  hourlyMotorcycleRate?: number;
  floors: Floor[];
  rating: number;
  features: string[];
}

interface Vehicle {
  id: string;
  licensePlate: string;
  type: "car" | "motorcycle";
  model: string;
  carBrand: string;
}

// Mock vehicles data
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    licensePlate: "ABC123",
    type: "car",
    model: "Corolla",
    carBrand: "Toyota",
  },
  {
    id: "2",
    licensePlate: "XYZ789",
    type: "motorcycle",
    model: "Ninja 400",
    carBrand: "Kawasaki",
  },
];

const Reserve = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    return date;
  });
  const [startTime, setStartTime] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    return date;
  });
  const [endTime, setEndTime] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 2, 0, 0, 0);
    return date;
  });
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(MOCK_VEHICLES[0]);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Parse parking data from params
  const parking = useMemo(() => {
    try {
      return params.data ? JSON.parse(params.data as string) : null;
    } catch (error) {
      console.error('Error parsing parking data:', error);
      return null;
    }
  }, [params.data]);

  // Early return if no parking data
  if (!parking) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <Text className="text-white text-lg text-center mb-4">
          No se pudo cargar la información del estacionamiento
        </Text>
        <Button 
          title="Volver" 
          onPress={() => router.back()} 
          variant="secondary" 
        />
      </SafeAreaView>
    );
  }

  const currentFloor = parking.floors?.find((f: Floor) => f.number === selectedFloor);

  // Filtrar espacios según el tipo de vehículo seleccionado
  const filteredSpots = useMemo(() => {
    if (!currentFloor?.spots) return [];
    
    if (selectedVehicle?.type === "motorcycle") {
      return currentFloor.spots.filter((spot: ParkingSpot) => 
        spot.type === "motorcycle" || spot.type === "disabled"
      );
    } else {
      return currentFloor.spots.filter((spot: ParkingSpot) => 
        spot.type === "car" || spot.type === "disabled"
      );
    }
  }, [currentFloor, selectedVehicle]);

  // Format functions
  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-ES", { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      weekday: "long"
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("es-ES", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

  // Calculate total hours and price
  const { totalHours, totalPrice, hourlyRate } = useMemo(() => {
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const totalHours = Math.max(hours, 1);
    
    let rate = 3000;
    
    if (selectedVehicle?.type === "motorcycle") {
      rate = parking.hourlyMotorcycleRate || parking.hourlyRate || 3000;
    } else {
      rate = parking.hourlyCarRate || parking.hourlyRate || 3000;
    }
    
    const totalPrice = rate * totalHours;
    
    return { totalHours, totalPrice, hourlyRate: rate };
  }, [startTime, endTime, selectedVehicle, parking]);

  // Validation
  const isValidReservation = useMemo(() => {
    const now = new Date();
    const reservationStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes()
    );
    
    const reservationEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      endTime.getHours(),
      endTime.getMinutes()
    );
    
    return reservationStart > now && reservationEnd > reservationStart;
  }, [selectedDate, startTime, endTime]);

  // Event handlers
  const handleSpotPress = useCallback((spot: ParkingSpot) => {
    if (spot.status === "available") {
      setSelectedSpot(spot);
    } else {
      Alert.alert(
        "Espacio no disponible",
        `El espacio ${spot.number} no está disponible en este momento.`
      );
    }
  }, []);

  const handleDateTimeChange = useCallback((type: string, selected: Date) => {
    if (type === "date") {
      setSelectedDate(selected);
    } else if (type === "start") {
      setStartTime(selected);
      const newEndTime = new Date(selected);
      newEndTime.setHours(selected.getHours() + 1);
      setEndTime(newEndTime);
    } else {
      setEndTime(selected);
    }
  }, []);

  const handleFloorSelect = useCallback((floorNumber: number) => {
    setSelectedFloor(floorNumber);
    setSelectedSpot(null);
  }, []);

  const DateTimeModal = ({ type, visible, onClose }: { 
    type: string; 
    visible: boolean; 
    onClose: () => void;
  }) => {
    const [tempValue, setTempValue] = useState(() => {
      if (type === "date") return selectedDate;
      if (type === "start") return startTime;
      return endTime;
    });

    const handleConfirm = () => {
      if (tempValue) {
        handleDateTimeChange(type, tempValue);
      }
      onClose();
    };

    return (
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/70 items-center justify-center p-4">
          <View className="bg-axia-darkGray rounded-2xl p-6 w-full max-w-md">
            <Text className="text-white text-center font-primaryBold mb-4 text-lg">
              {type === "date"
                ? "Selecciona una fecha"
                : type === "start"
                ? "Hora de inicio"
                : "Hora de fin"}
            </Text>
            
            <DateTimePicker
              value={tempValue}
              mode={type === "date" ? "date" : "time"}
              display="spinner"
              minimumDate={type === "date" ? new Date() : undefined}
              onChange={(event, selected) => {
                if (selected) {
                  setTempValue(selected);
                }
              }}
              style={{ height: Platform.OS === "ios" ? 200 : 150 }}
              textColor="#FFFFFF"
            />
            
            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={onClose}
                className="flex-1 bg-axia-gray/30 rounded-xl py-3 active:scale-95"
                accessibilityLabel="Cancelar selección"
                accessibilityRole="button"
              >
                <Text className="text-white text-center font-primaryBold text-lg">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                className="flex-1 bg-axia-green rounded-xl py-3 active:scale-95"
                accessibilityLabel="Confirmar selección"
                accessibilityRole="button"
              >
                <Text className="text-axia-black text-center font-primaryBold text-lg">
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleReserve = async () => {
    if (!selectedSpot) {
      Alert.alert("Selecciona un espacio", "Por favor elige un espacio disponible para reservar");
      return;
    }

    if (!selectedVehicle) {
      Alert.alert("Selecciona un vehículo", "Por favor elige un vehículo para la reserva");
      return;
    }

    if (!isValidReservation) {
      Alert.alert("Horario inválido", "La fecha y hora de reserva deben ser futuras y la hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    try {
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const reservationData = {
        id: `res_${Date.now()}`,
        parkingId: parking.id,
        parkingSpotId: selectedSpot.id,
        vehicleId: selectedVehicle.id,
        startTime: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          startTime.getHours(),
          startTime.getMinutes()
        ).toISOString(),
        endTime: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          endTime.getHours(),
          endTime.getMinutes()
        ).toISOString(),
        status: "CONFIRMED",
        totalAmount: totalPrice,
        createdAt: new Date().toISOString(),
      };

      router.push({
        pathname: `/parkings/${parking.id}/reserve/confirm`,
        params: { 
          reservationId: reservationData.id,
          data: JSON.stringify({
            ...reservationData,
            parkingName: parking.name,
            address: parking.address,
            spotNumber: selectedSpot.number,
            floor: selectedFloor,
            hours: totalHours,
            totalPrice: totalPrice,
            hourlyRate: hourlyRate,
            vehicle: selectedVehicle,
            features: parking.features
          })
        }
      });

    } catch (error: any) {
      console.error("Error creating reservation:", error);
      Alert.alert(
        "Error al reservar",
        "No se pudo completar la reserva. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      {/* Loading Overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/50 z-50 justify-center items-center">
          <View className="bg-axia-darkGray rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-white font-primaryBold mt-4">Creando reserva...</Text>
          </View>
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-white text-2xl font-primaryBold text-center">
              Reservar Espacio
            </Text>
            <Text className="text-axia-gray text-center mt-2">
              {parking.name} - {parking.address}
            </Text>
          </View>

          {/* Vehicle Selection */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Vehículo
            </Text>
            
            <Pressable
              onPress={() => setShowVehiclePicker(true)}
              className="bg-axia-gray/30 rounded-xl p-4 flex-row justify-between items-center active:scale-95"
              accessibilityLabel="Seleccionar vehículo"
              accessibilityRole="button"
            >
              <View className="flex-row items-center">
                <Ionicons name="car-sport" size={20} color="#10B981" />
                <View className="ml-3">
                  <Text className="text-white font-primaryBold">
                    {selectedVehicle?.carBrand} {selectedVehicle?.model}
                  </Text>
                  <Text className="text-axia-gray text-sm font-primary">
                    {selectedVehicle?.licensePlate} • {selectedVehicle?.type === "car" ? "Carro" : "Moto"}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </Pressable>
          </View>

          {/* Date & Time Selection */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
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

            {/* Duration Summary */}
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

          {/* Date/Time Modals */}
          {["date", "start", "end"].map((type) => (
            <DateTimeModal
              key={type}
              type={type}
              visible={openModal === type}
              onClose={() => setOpenModal(null)}
            />
          ))}

          {/* Floor Selection */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Seleccionar Piso
            </Text>
            
            <FloorSelector
              floors={parking.floors || []}
              selectedFloor={selectedFloor}
              onFloorSelect={handleFloorSelect}
            />

            {/* Parking Spot Grid */}
            {currentFloor && (
              <View className="mt-4">
                <Text className="text-white font-primaryBold mb-4 text-center">
                  Piso {currentFloor.number} - {filteredSpots.filter((spot: ParkingSpot) => spot.status === 'available').length} espacios disponibles para {selectedVehicle?.type === 'car' ? 'carros' : 'motos'}
                </Text>

                <View className="bg-axia-black/50 rounded-xl p-4 min-h-80">
                  {filteredSpots.length > 0 ? (
                    <ParkingSpotGrid
                      spots={filteredSpots}
                      selectedSpot={selectedSpot}
                      onSpotPress={handleSpotPress}
                    />
                  ) : (
                    <View className="items-center justify-center py-12">
                      <Ionicons
                        name="alert-circle-outline"
                        size={48}
                        color="#6B7280"
                      />
                      <Text className="text-axia-gray text-lg font-primary mt-4 text-center">
                        No hay espacios {selectedVehicle?.type === 'car' ? 'para carros' : 'para motos'} en este piso
                      </Text>
                    </View>
                  )}
                </View>

                {/* Legend */}
                <View className="flex-row flex-wrap justify-center gap-4 mt-4 mb-4">
                  {[
                    { color: "#10B981", label: "Disponible" },
                    { color: "#EF4444", label: "Ocupado" },
                    { color: "#F59E0B", label: "Reservado" },
                    { color: "#6B7280", label: "Mantenimiento" },
                  ].map((item, index) => (
                    <View key={index} className="flex-row items-center">
                      <View
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <Text className="text-axia-gray text-xs">{item.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Informational Note */}
                <View className="bg-axia-darkGray/30 rounded-lg p-3">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="information-circle"
                      size={16}
                      color="#6B7280"
                      className="mt-0.5 mr-2"
                    />
                    <Text className="text-axia-gray text-xs font-primary flex-1">
                      Mostrando solo espacios para {selectedVehicle?.type === 'car' ? 'carros' : 'motos'}. Los espacios para discapacitados están disponibles para ambos tipos de vehículos.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Reservation Summary */}
          {selectedSpot && (
            <ReservationSummary
              selectedSpot={selectedSpot}
              selectedFloor={selectedFloor}
              selectedVehicle={selectedVehicle}
              selectedDate={selectedDate}
              startTime={startTime}
              endTime={endTime}
              totalHours={totalHours}
              hourlyRate={hourlyRate}
              totalPrice={totalPrice}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          )}

          {/* Reserve Button */}
          <Button
            title={selectedSpot ? "Confirmar Reserva" : "Selecciona un espacio"}
            onPress={handleReserve}
            variant={selectedSpot ? "primary" : "secondary"}
            size="large"
            className="mb-6 shadow-lg shadow-axia-green/25"
            disabled={!selectedSpot || !selectedVehicle || !isValidReservation || loading}
          />

          {/* Important Information */}
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
              • Puedes cancelar hasta 30 minutos antes{"\n"}
              • El pago se realiza al llegar al estacionamiento
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Vehicle Picker Modal */}
      <VehiclePickerModal
        visible={showVehiclePicker}
        vehicles={MOCK_VEHICLES}
        selectedVehicle={selectedVehicle}
        onSelect={setSelectedVehicle}
        onClose={() => setShowVehiclePicker(false)}
      />
    </SafeAreaView>
  );
};

export default Reserve;
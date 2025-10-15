import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, ScrollView, Text, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fetchMyVehicles } from '../../../../libs/vehicles';
import { createReservation } from '../../../../libs/reservations';

// Components
import VehicleSelection from "../../../../components/organisms/parking/VehicleSelection";
import FloorSelection from "../../../../components/organisms/parking/FloorSelection";
import ReservationForm from "../../../../components/organisms/forms/ReservationForm";
import DateTimeModal from "../../../../components/molecules/parking/DateTimeModal";
import { DateTimeSelector } from "../../../../components/atoms/DateTimeSelector";
import Button from "../../../../components/atoms/Button";
import { Vehicle } from "../../../../interfaces/vehicle";

// Types - MOVER LAS INTERFACES FUERA DEL COMPONENTE
interface ParkingSpot {
  id: string;
  number: string;
  status: "available" | "occupied" | "reserved" | "maintenance";
  type: "car" | "motorcycle" | "disabled";
  floor: number;
}

interface ParkingFloor {
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
  hourlyCarRate: number;
  hourlyMotorcycleRate: number;
  dailyRate: number;
  monthlyRate: number;
  floors: number;
  totalCapacity: number;
  availableSpots: number;
  status: 'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE';
  schedule: string;
  description: string;
  features: string[];
  parkingFloors: any[];
  parkingSpots: any[];
}

const Reserve = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ parkingData?: string }>();

  // TODOS LOS HOOKS PRIMERO - sin returns tempranos entre ellos
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [errorVehicles, setErrorVehicles] = useState<string | null>(null);
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
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper functions - deben estar definidas antes de los useMemo
  const mapSpotStatus = (status: string): "available" | "occupied" | "reserved" | "maintenance" => {
    switch (status) {
      case 'AVAILABLE': return 'available';
      case 'OCCUPIED': return 'occupied';
      case 'RESERVED': return 'reserved';
      case 'MAINTENANCE': return 'maintenance';
      default: return 'available';
    }
  };

  const mapSpotType = (spotType: string): "car" | "motorcycle" | "disabled" => {
    switch (spotType) {
      case 'STANDARD': return 'car';
      case 'ELECTRIC': return 'car';
      case 'HANDICAPPED': return 'disabled';
      case 'MOTORCYCLE': return 'motorcycle';
      default: return 'car';
    }
  };

  // Cargar vehículos del usuario
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoadingVehicles(true);
        setErrorVehicles(null);
        const userVehicles = await fetchMyVehicles();
        setVehicles(userVehicles);
        if (userVehicles.length > 0) {
          setSelectedVehicle(userVehicles[0]);
        }
      } catch (error: any) {
        console.error('Error cargando vehículos:', error);
        setErrorVehicles(error.message || 'No se pudieron cargar tus vehículos');
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, []);

  // Parse parking data from params
  const parking = useMemo((): Parking | null => {
    try {
      return params.parkingData ? JSON.parse(params.parkingData as string) : null;
    } catch (error) {
      console.error('Error parsing parking data:', error);
      return null;
    }
  }, [params.parkingData]);

  const transformedParkingData = useMemo(() => {
    if (!parking) return null;

    const floors: ParkingFloor[] = parking.parkingFloors?.map(floor => {
      const floorSpots = parking.parkingSpots?.filter(spot => spot.floorId === floor.id) || [];
      
      const transformedSpots: ParkingSpot[] = floorSpots.map(spot => ({
        id: spot.id,
        number: spot.spotNumber,
        status: mapSpotStatus(spot.status),
        type: mapSpotType(spot.spotType),
        floor: floor.floorNumber
      }));

      const availableSpots = transformedSpots.filter(spot => spot.status === "available").length;

      return {
        id: floor.id,
        number: floor.floorNumber,
        name: floor.name || `Piso ${floor.floorNumber}`,
        totalSpots: transformedSpots.length,
        availableSpots: availableSpots,
        spots: transformedSpots
      };
    }) || [];

    return {
      ...parking,
      floors: floors,
      features: parking.features || []
    };
  }, [parking]);

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
    
    let rate = parking?.hourlyCarRate || 3000;
    
    if (selectedVehicle?.type === "motorcycle") {
      rate = parking?.hourlyMotorcycleRate || 2000;
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
  const handleSpotPress = useCallback((spot: any) => {
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

  // AHORA LOS RETURNS TEMPRANOS - después de todos los Hooks
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
            onPress={() => router.back()} 
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
            onPress={() => window.location.reload()} 
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
            onPress={() => router.push('/vehicles/add')} 
            variant="primary" 
          />
        </View>
      </SafeAreaView>
    );
  }

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

      // Crear las fechas completas combinando fecha seleccionada con horas
      const reservationStartTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes(),
        0
      );

      const reservationEndTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes(),
        0
      );

      // Función helper para formatear fechas (MM/DD/YYYY)
      const formatDate = (date: Date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

      // Función helper para formatear horas (12h format)
      const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes} ${ampm}`;
      };

      // Preparar datos completos para el flujo de pago
      // IMPORTANTE: Estos datos se usarán en payment/method.tsx para crear la reservación + pago
      const reservationPaymentData = {
        // Datos para crear la reservación en el backend
        parkingSpotId: selectedSpot.id, // REQUERIDO
        vehicleId: selectedVehicle.id,   // REQUERIDO
        startTime: reservationStartTime.toISOString(), // REQUERIDO (ISO string)
        endTime: reservationEndTime.toISOString(),     // REQUERIDO (ISO string)
        totalAmount: totalPrice, //  REQUERIDO para el pago
        
        // Datos para mostrar en la UI de pago
        parkingId: parking?.id,
        parkingName: parking?.name || 'Parqueadero',
        address: parking?.address || '',
        spotNumber: selectedSpot.number,
        date: formatDate(selectedDate),
        startTimeFormatted: formatTime(reservationStartTime),
        endTimeFormatted: formatTime(reservationEndTime),
        duration: `${totalHours} hora${totalHours > 1 ? 's' : ''}`,
        hourlyRate: totalPrice / totalHours,
        
        // Datos opcionales del usuario (si los necesitas)
        guestName: undefined, // Puedes agregar un campo para esto
        guestContact: undefined
      };

      console.log('Datos de reservación para pago:', reservationPaymentData);

      // Navegar a la pantalla de método de pago
      router.push({
        pathname: '/(tabs)/reservations/payment/method',
        params: {
          reservationData: JSON.stringify(reservationPaymentData)
        }
      });
    } catch (error: any) {
      console.error('Error al preparar la reserva:', error);
      Alert.alert('Error', 'No se pudo procesar la reserva. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

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
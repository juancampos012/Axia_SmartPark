import { useState, useMemo, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchMyVehicles } from '../libs/vehicles';
import { Vehicle } from '../interfaces/vehicle';

// Types
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

export const useReserveScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ parkingData?: string }>();

  // Estados de vehículos
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [errorVehicles, setErrorVehicles] = useState<string | null>(null);

  // Estados de fecha y hora
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

  // Estados de selección
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper functions para mapeo de estados
  const mapSpotStatus = useCallback((status: string): "available" | "occupied" | "reserved" | "maintenance" => {
    switch (status) {
      case 'AVAILABLE': return 'available';
      case 'OCCUPIED': return 'occupied';
      case 'RESERVED': return 'reserved';
      case 'MAINTENANCE': return 'maintenance';
      default: return 'available';
    }
  }, []);

  const mapSpotType = useCallback((spotType: string): "car" | "motorcycle" | "disabled" => {
    switch (spotType) {
      case 'STANDARD': return 'car';
      case 'ELECTRIC': return 'car';
      case 'HANDICAPPED': return 'disabled';
      case 'MOTORCYCLE': return 'motorcycle';
      default: return 'car';
    }
  }, []);

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

  // Transformar datos del parking
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
  }, [parking, mapSpotStatus, mapSpotType]);

  // Format functions
  const formatDate = useCallback((d: Date) =>
    d.toLocaleDateString("es-ES", { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      weekday: "long"
    }), []);

  const formatTime = useCallback((d: Date) =>
    d.toLocaleTimeString("es-ES", { 
      hour: "2-digit", 
      minute: "2-digit" 
    }), []);

  // Calculate total hours and price
  const { totalHours, totalPrice, hourlyRate } = useMemo(() => {
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const calculatedHours = Math.max(hours, 1);
    
    let rate = parking?.hourlyCarRate || 3000;
    
    if (selectedVehicle?.type === "motorcycle") {
      rate = parking?.hourlyMotorcycleRate || 2000;
    }
    
    const price = rate * calculatedHours;
    
    return { totalHours: calculatedHours, totalPrice: price, hourlyRate: rate };
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

  const handleReserve = useCallback(async () => {
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
      const formatDateForPayment = (date: Date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

      // Función helper para formatear horas (12h format)
      const formatTimeForPayment = (date: Date) => {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes} ${ampm}`;
      };

      // Preparar datos completos para el flujo de pago
      const reservationPaymentData = {
        // Datos para crear la reservación en el backend
        parkingSpotId: selectedSpot.id,
        vehicleId: selectedVehicle.id,
        startTime: reservationStartTime.toISOString(),
        endTime: reservationEndTime.toISOString(),
        totalAmount: totalPrice,
        
        // Datos para mostrar en la UI de pago
        parkingId: parking?.id,
        parkingName: parking?.name || 'Parqueadero',
        address: parking?.address || '',
        spotNumber: selectedSpot.number,
        date: formatDateForPayment(selectedDate),
        startTimeFormatted: formatTimeForPayment(reservationStartTime),
        endTimeFormatted: formatTimeForPayment(reservationEndTime),
        duration: `${totalHours} hora${totalHours > 1 ? 's' : ''}`,
        hourlyRate: totalPrice / totalHours,
        
        // Datos opcionales del usuario
        guestName: undefined,
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
  }, [selectedSpot, selectedVehicle, isValidReservation, selectedDate, startTime, endTime, totalHours, totalPrice, parking, router]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleAddVehicle = useCallback(() => {
    router.push('/vehicles/add');
  }, [router]);

  return {
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
    hourlyRate,
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
  };
};

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useReservationsHistory } from './useReservationsHistory';
import { ReservationStatus, ReservationWithRelations } from '../interfaces/reservation';

interface Reservation {
  id: string;
  parkingName: string;
  address: string;
  time: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  spot?: string;
}

// Helper para formatear hora
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

// Helper para convertir ReservationWithRelations a Reservation local
const transformReservation = (res: ReservationWithRelations): Reservation => {
  const startTime = new Date(res.startTime);
  const endTime = new Date(res.endTime);
  
  const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;
  const dateStr = `${(startTime.getMonth() + 1).toString().padStart(2, '0')}/${startTime.getDate().toString().padStart(2, '0')}/${startTime.getFullYear()}`;
  
  let status: 'active' | 'completed' | 'cancelled' = 'active';
  if (res.status === ReservationStatus.COMPLETED) status = 'completed';
  else if (res.status === ReservationStatus.CANCELED) status = 'cancelled';
  else if (res.status === ReservationStatus.CONFIRMED || res.status === ReservationStatus.PENDING) status = 'active';
  
  return {
    id: res.id,
    parkingName: res.parkingSpot?.parking?.name || 'Parqueadero',
    address: res.parkingSpot?.parking?.address || 'Dirección no disponible',
    time: timeStr,
    date: dateStr,
    status,
    spot: res.parkingSpot?.spotNumber ? `Puesto ${res.parkingSpot.spotNumber}` : undefined
  };
};

export const useReservationsScreen = () => {
  const router = useRouter();
  
  // Usar el hook de historial de reservas
  const {
    reservations,
    loading,
    refreshing,
    stats,
    handleRefresh,
  } = useReservationsHistory();

  // Estados locales transformados
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [reservationHistory, setReservationHistory] = useState<Reservation[]>([]);

  // Transformar y separar reservaciones cuando cambien
  useEffect(() => {
    console.log('🔄 useReservationsScreen - reservations changed:', reservations?.length);
    
    // Verificar que reservations esté definido y sea un array
    if (reservations && Array.isArray(reservations) && reservations.length > 0) {
      console.log('✅ Procesando reservaciones:', reservations.length);
      
      // Encontrar la última reservación pendiente/confirmada (más reciente)
      const activeRes = reservations
        .filter(r => r.status === ReservationStatus.PENDING || r.status === ReservationStatus.CONFIRMED)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0];
      
      console.log('🎯 Reservación activa encontrada:', activeRes?.id);
      setCurrentReservation(activeRes ? transformReservation(activeRes) : null);
      
      // Historial: TODAS las reservas (sin importar el estado)
      // Ordenadas por fecha más reciente primero
      const historyRes = reservations
        .map(transformReservation)
        .sort((a, b) => {
          // Convertir fechas de string MM/DD/YYYY a Date
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      
      console.log('📋 Total en historial:', historyRes.length);
      setReservationHistory(historyRes);
    } else {
      console.log('⚠️ No hay reservaciones o array vacío');
      setCurrentReservation(null);
      setReservationHistory([]);
    }
  }, [reservations]);

  // Funciones helper para obtener información del estado
  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'completed':
        return 'Finalizada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'completed':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'flash';
      case 'completed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  }, []);

  // Handlers
  const handleReservationPress = useCallback((reservation: Reservation) => {
    router.push({
      pathname: `/reservations/${reservation.id}`,
      params: { data: JSON.stringify(reservation) },
    });
  }, [router]);

  const handleNewReservation = useCallback(() => {
    router.push('/(tabs)/parkings');
  }, [router]);

  // Valores computados
  const hasActiveReservation = useMemo(() => !!currentReservation, [currentReservation]);
  const totalHistoryCount = useMemo(() => reservationHistory.length, [reservationHistory]);

  return {
    // Estados
    currentReservation,
    reservationHistory,
    hasActiveReservation,
    totalHistoryCount,
    loading,
    refreshing,
    stats,
    
    // Funciones helper
    getStatusText,
    getStatusColor,
    getStatusIcon,
    
    // Handlers
    handleReservationPress,
    handleNewReservation,
    handleRefresh,
  };
};

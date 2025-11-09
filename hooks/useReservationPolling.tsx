import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { fetchReservationById } from '../libs/reservations';
import { ReservationWithRelations, ReservationStatus } from '../interfaces/reservation';

interface UseReservationPollingOptions {
  reservationId: string;
  initialData?: ReservationWithRelations;
  enabled?: boolean;
  interval?: number; // Intervalo en milisegundos
  onStatusChange?: (newStatus: ReservationStatus, oldStatus: ReservationStatus) => void;
}

/**
 * Hook para hacer polling de una reservación y detectar cambios de estado
 * Optimizado para no hacer demasiadas peticiones:
 * - Solo hace polling si la reserva está PENDING
 * - Pausa el polling cuando la app está en background
 * - Aumenta el intervalo progresivamente para reservas que llevan tiempo PENDING
 */
export const useReservationPolling = ({
  reservationId,
  initialData,
  enabled = true,
  interval = 15000, // 15 segundos por defecto
  onStatusChange,
}: UseReservationPollingOptions) => {
  const [reservation, setReservation] = useState<ReservationWithRelations | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const pollCountRef = useRef(0);
  const lastStatusRef = useRef<ReservationStatus | null>(initialData?.status || null);

  /**
   * Calcular intervalo dinámico basado en cuántas veces hemos hecho polling
   * Esto evita sobrecarga del servidor para reservas que llevan mucho tiempo PENDING
   */
  const getDynamicInterval = useCallback(() => {
    const count = pollCountRef.current;
    
    // Primeros 5 polls: 15 segundos
    if (count < 5) return interval;
    
    // 5-10 polls: 30 segundos
    if (count < 10) return interval * 2;
    
    // 10-20 polls: 1 minuto
    if (count < 20) return interval * 4;
    
    // Más de 20 polls: 2 minutos
    return interval * 8;
  }, [interval]);

  /**
   * Cargar datos de la reservación
   */
  const loadReservation = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const data = await fetchReservationById(reservationId);
      
      // Detectar cambio de estado
      if (lastStatusRef.current && lastStatusRef.current !== data.status) {
        console.log(`🔄 Estado cambió de ${lastStatusRef.current} a ${data.status}`);
        onStatusChange?.(data.status, lastStatusRef.current);
      }

      lastStatusRef.current = data.status;
      setReservation(data);
      pollCountRef.current++;

      return data;
    } catch (err: any) {
      console.error('❌ Error loading reservation:', err);
      setError(err.message || 'Error al cargar la reservación');
      return null;
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [reservationId, onStatusChange]);

  /**
   * Iniciar polling
   */
  const startPolling = useCallback(() => {
    if (!enabled || !reservationId) return;

    // Limpiar intervalo anterior si existe
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    console.log('🔄 Iniciando polling para reservación:', reservationId);
    setIsPolling(true);

    // Función de polling
    const poll = async () => {
      // Solo hacer polling si la app está activa
      if (appState.current !== 'active') {
        console.log('⏸️ App en background, pausando polling');
        return;
      }

      const data = await loadReservation(true);

      // Detener polling si la reserva ya no está PENDING
      if (data && data.status !== ReservationStatus.PENDING) {
        console.log('✅ Reserva confirmada/cancelada, deteniendo polling');
        stopPolling();
        return;
      }

      // Reprogramar con intervalo dinámico
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      const nextInterval = getDynamicInterval();
      console.log(`⏱️ Siguiente polling en ${nextInterval / 1000}s (poll #${pollCountRef.current})`);
      
      pollingIntervalRef.current = setInterval(poll, nextInterval);
    };

    // Ejecutar primera carga
    poll();
  }, [enabled, reservationId, loadReservation, getDynamicInterval]);

  /**
   * Detener polling
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
    console.log('⏹️ Polling detenido');
  }, []);

  /**
   * Refrescar manualmente
   */
  const refresh = useCallback(async () => {
    pollCountRef.current = 0; // Reset contador para volver a intervalos cortos
    await loadReservation(false);
    
    // Reiniciar polling si debe estar activo
    if (enabled && reservation?.status === ReservationStatus.PENDING) {
      startPolling();
    }
  }, [loadReservation, enabled, reservation, startPolling]);

  /**
   * Manejar cambios de estado de la app (background/foreground)
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const prevState = appState.current;
      appState.current = nextAppState;

      console.log(`📱 App state: ${prevState} → ${nextAppState}`);

      // Si volvemos al foreground y debería estar haciendo polling
      if (prevState !== 'active' && nextAppState === 'active') {
        if (enabled && reservation?.status === ReservationStatus.PENDING) {
          console.log('📱 App en foreground, reanudando polling');
          refresh(); // Refrescar inmediatamente al volver
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [enabled, reservation, refresh]);

  /**
   * Iniciar/detener polling según el estado de la reserva
   */
  useEffect(() => {
    if (!enabled || !reservationId) {
      stopPolling();
      return;
    }

    // Cargar datos iniciales si no los tenemos
    if (!reservation) {
      loadReservation(false).then(data => {
        // Iniciar polling solo si está PENDING
        if (data && data.status === ReservationStatus.PENDING) {
          startPolling();
        }
      });
    } else {
      // Si la reserva está PENDING, iniciar polling
      if (reservation.status === ReservationStatus.PENDING) {
        startPolling();
      } else {
        stopPolling();
      }
    }

    // Cleanup
    return () => {
      stopPolling();
    };
  }, [enabled, reservationId, reservation?.status]);

  return {
    reservation,
    loading,
    error,
    isPolling,
    refresh,
    stopPolling,
    startPolling,
  };
};

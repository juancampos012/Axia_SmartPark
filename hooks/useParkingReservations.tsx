import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import {
  ReservationWithRelations,
  ReservationSearchResult,
  ReservationStatus
} from '../interfaces/reservation';
import { fetchReservationsByParking } from '../libs/reservations';
import { useAuth } from '../context/AuthContext';

interface UseParkingReservationsProps {
  pageSize?: number;
  initialStatus?: string | string[];
}

/**
 * Hook para manejar las reservas del parqueadero (Admin/Operator)
 * Usa paginación y FlatList-ready data
 */
export const useParkingReservations = ({
  pageSize = 20,
  initialStatus
}: UseParkingReservationsProps = {}) => {
  const { parkingId } = useAuth();
  const [reservations, setReservations] = useState<ReservationWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filtros
  const [statusFilter, setStatusFilter] = useState<string | string[] | undefined>(initialStatus);

  /**
   * Cargar reservaciones del parqueadero
   */
  const loadReservations = useCallback(async (
    page: number = 1, 
    refresh: boolean = false,
    append: boolean = false
  ) => {
    if (!parkingId) {
      console.warn('⚠️ useParkingReservations - No parkingId available');
      setReservations([]);
      return;
    }

    try {
      if (refresh) {
        setRefreshing(true);
      } else if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('📋 Loading parking reservations:', { parkingId, page, statusFilter });

      const result: ReservationSearchResult = await fetchReservationsByParking(
        parkingId,
        page,
        pageSize,
        statusFilter ? { status: statusFilter } : undefined
      );

      if (!result || !Array.isArray(result.reservations)) {
        console.warn('⚠️ Invalid response format from fetchReservationsByParking:', result);
        if (!append) {
          setReservations([]);
        }
        setCurrentPage(1);
        setTotalPages(1);
        setTotalCount(0);
        setHasMore(false);
        return;
      }

      console.log('✅ Reservations loaded:', {
        count: result.reservations.length,
        total: result.total,
        page: result.currentPage
      });

      if (refresh || !append) {
        // Reemplazar datos (refresh o primera carga)
        setReservations(result.reservations);
      } else {
        // Agregar al final (scroll infinito)
        setReservations(prev => [...prev, ...result.reservations]);
      }

      setCurrentPage(result.currentPage || page);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.total || 0);
      setHasMore(result.hasNextPage || false);

    } catch (err: any) {
      console.error('❌ Error loading parking reservations:', err);
      setError(err.message || 'Error al cargar las reservaciones');
      if (!append) {
        setReservations([]);
      }
      Alert.alert('Error', err.message || 'Error al cargar las reservaciones del parqueadero');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [parkingId, statusFilter, pageSize]);

  /**
   * Refrescar datos (pull to refresh)
   */
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    loadReservations(1, true, false);
  }, [loadReservations]);

  /**
   * Cargar más (scroll infinito para FlatList)
   */
  const loadMore = useCallback(() => {
    if (!loadingMore && !loading && !refreshing && hasMore && parkingId) {
      console.log('📋 Loading more reservations - page:', currentPage + 1);
      loadReservations(currentPage + 1, false, true);
    }
  }, [loadingMore, loading, refreshing, hasMore, currentPage, parkingId, loadReservations]);

  /**
   * Actualizar filtro de estado
   */
  const updateStatusFilter = useCallback((newStatus: string | string[] | undefined) => {
    console.log('🔄 Updating status filter:', newStatus);
    setStatusFilter(newStatus);
    setCurrentPage(1);
    // loadReservations se llamará automáticamente por el efecto
  }, []);

  /**
   * Cargar al enfocar la pantalla
   */
  useFocusEffect(
    useCallback(() => {
      if (parkingId) {
        console.log('🔄 useParkingReservations - Screen focused, loading reservations');
        loadReservations(1, false, false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parkingId, statusFilter]) // Recargar cuando cambie parkingId o statusFilter
  );

  return {
    // Data
    reservations,
    loading,
    refreshing,
    loadingMore,
    error,
    
    // Paginación
    currentPage,
    totalPages,
    totalCount,
    hasMore,
    
    // Filtros
    statusFilter,
    updateStatusFilter,
    
    // Acciones
    handleRefresh,
    loadMore,
    reload: () => loadReservations(1, false, false),
  };
};

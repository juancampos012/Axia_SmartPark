import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import {
  ReservationWithRelations,
  ReservationSearchResult,
  ReservationStatus,
  ReservationSearchFilters
} from '../interfaces/reservation';
import {
  fetchMyReservations,
  fetchMyReservationStats,
  cancelReservation
} from '../libs/reservations';

interface UseReservationsHistoryProps {
  initialFilters?: ReservationSearchFilters;
  pageSize?: number;
}

export const useReservationsHistory = ({
  initialFilters,
  pageSize = 20
}: UseReservationsHistoryProps = {}) => {
  const [reservations, setReservations] = useState<ReservationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filtros
  const [filters, setFilters] = useState<ReservationSearchFilters>(initialFilters || {});

  // Estadísticas
  const [stats, setStats] = useState<{
    active: number;
    completed: number;
    canceled: number;
    total: number;
  } | null>(null);

  /**
   * Cargar reservaciones
   */
  const loadReservations = useCallback(async (page: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result: ReservationSearchResult = await fetchMyReservations(page, pageSize, filters);

      // Validar que result tenga la estructura esperada
      if (!result || !Array.isArray(result.reservations)) {
        console.warn(' Invalid response format from fetchMyReservations:', result);
        setReservations([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalCount(0);
        setHasMore(false);
        return;
      }


      if (refresh || page === 1) {
        setReservations(result.reservations);
      } else {
        // Agregar al final para carga infinita
        setReservations(prev => [...prev, ...result.reservations]);
      }

      setCurrentPage(result.currentPage || page);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.total || 0);
      setHasMore(result.hasNextPage || false);

    } catch (err: any) {
      console.error('Error loading reservations:', err);
      setError(err.message || 'Error al cargar las reservaciones');
      setReservations([]); // Asegurar que sea un array vacío en caso de error
      Alert.alert('Error', err.message || 'Error al cargar las reservaciones');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, pageSize]);

  /**
   * Cargar estadísticas
   */
  const loadStats = useCallback(async () => {
    try {
      const statsData = await fetchMyReservationStats();
      setStats({
        active: statsData.activeReservations,
        completed: statsData.completedReservations,
        canceled: statsData.canceledReservations,
        total: statsData.totalReservations
      });
    } catch (err: any) {
      console.error('Error loading stats:', err);
    }
  }, []);

  /**
   * Refrescar datos
   */
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    loadReservations(1, true);
    loadStats();
  }, [loadReservations, loadStats]);

  /**
   * Cargar más (paginación infinita)
   */
  const loadMore = useCallback(() => {
    if (!loading && !refreshing && hasMore) {
      loadReservations(currentPage + 1);
    }
  }, [loading, refreshing, hasMore, currentPage, loadReservations]);

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters: ReservationSearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  /**
   * Cancelar una reservación
   */
  const handleCancelReservation = useCallback(async (reservationId: string, reason?: string) => {
    try {
      await cancelReservation(reservationId, reason);
      Alert.alert('Éxito', 'Reservación cancelada exitosamente');
      handleRefresh();
    } catch (err: any) {
      console.error('Error canceling reservation:', err);
      Alert.alert('Error', err.message || 'Error al cancelar la reservación');
    }
  }, [handleRefresh]);

  /**
   * Filtrar por estado
   */
  const filterByStatus = useCallback((status?: ReservationStatus | ReservationStatus[]) => {
    updateFilters({ ...filters, status });
  }, [filters, updateFilters]);

  /**
   * Filtrar reservas activas (PENDING o CONFIRMED)
   */
  const filterActive = useCallback(() => {
    filterByStatus([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]);
  }, [filterByStatus]);

  /**
   * Filtrar reservas completadas
   */
  const filterCompleted = useCallback(() => {
    filterByStatus(ReservationStatus.COMPLETED);
  }, [filterByStatus]);

  /**
   * Filtrar reservas canceladas
   */
  const filterCanceled = useCallback(() => {
    filterByStatus(ReservationStatus.CANCELED);
  }, [filterByStatus]);

  /**
   * Mostrar todas las reservas
   */
  const filterAll = useCallback(() => {
    updateFilters({});
  }, [updateFilters]);

  /**
   * Efecto inicial
   */
  useEffect(() => {
    loadReservations(1);
    loadStats();
  }, [filters]); // Se recarga cuando cambian los filtros

  /**
   * Recargar cuando la pantalla obtiene foco
   */
  useFocusEffect(
    React.useCallback(() => {
      console.log('Reservations screen focused - reloading data');
      loadReservations(currentPage, true);
      loadStats();
    }, [loadReservations, loadStats, currentPage])
  );

  return {
    // Datos
    reservations,
    loading,
    refreshing,
    error,
    
    // Paginación
    currentPage,
    totalPages,
    totalCount,
    hasMore,
    
    // Estadísticas
    stats,
    
    // Acciones
    handleRefresh,
    loadMore,
    updateFilters,
    handleCancelReservation,
    
    // Filtros rápidos
    filterByStatus,
    filterActive,
    filterCompleted,
    filterCanceled,
    filterAll,
    
    // Estado actual de filtros
    currentFilters: filters,
  };
};

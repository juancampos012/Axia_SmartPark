import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  PaymentWithRelations,
  PaymentSearchResult,
  PaymentStatus,
  PaymentMethod,
  PaymentSearchFilters,
  UserPaymentStats
} from '../interfaces/payment';
import {
  fetchMyPayments,
  fetchPaymentById,
  fetchMyPaymentStats
} from '../libs/payments';

interface UsePaymentHistoryProps {
  initialFilters?: PaymentSearchFilters;
  pageSize?: number;
}

export const usePaymentHistory = ({
  initialFilters,
  pageSize = 20
}: UsePaymentHistoryProps = {}) => {
  const [payments, setPayments] = useState<PaymentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filtros
  const [filters, setFilters] = useState<PaymentSearchFilters>(initialFilters || {});

  // Estadísticas
  const [stats, setStats] = useState<UserPaymentStats | null>(null);

  /**
   * Cargar pagos
   */
  const loadPayments = useCallback(async (page: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result: PaymentSearchResult = await fetchMyPayments(page, pageSize, filters);

      if (refresh || page === 1) {
        setPayments(result.payments);
      } else {
        // Agregar al final para carga infinita
        setPayments(prev => [...prev, ...result.payments]);
      }

      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalCount(result.total);
      setHasMore(result.hasNextPage);

    } catch (err: any) {
      console.error('Error loading payments:', err);
      setError(err.message || 'Error al cargar los pagos');
      Alert.alert('Error', err.message || 'Error al cargar los pagos');
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
      const statsData = await fetchMyPaymentStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading payment stats:', err);
    }
  }, []);

  /**
   * Cargar un pago individual por ID
   */
  const loadPaymentById = useCallback(async (paymentId: string): Promise<PaymentWithRelations | null> => {
    try {
      const payment = await fetchPaymentById(paymentId);
      return payment;
    } catch (err: any) {
      console.error('Error loading payment:', err);
      Alert.alert('Error', err.message || 'Error al cargar el pago');
      return null;
    }
  }, []);

  /**
   * Refrescar datos
   */
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    loadPayments(1, true);
    loadStats();
  }, [loadPayments, loadStats]);

  /**
   * Cargar más (paginación infinita)
   */
  const loadMore = useCallback(() => {
    if (!loading && !refreshing && hasMore) {
      loadPayments(currentPage + 1);
    }
  }, [loading, refreshing, hasMore, currentPage, loadPayments]);

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters: PaymentSearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  /**
   * Filtrar por estado
   */
  const filterByStatus = useCallback((status?: PaymentStatus) => {
    updateFilters({ ...filters, status });
  }, [filters, updateFilters]);

  /**
   * Filtrar pagos exitosos
   */
  const filterSuccessful = useCallback(() => {
    filterByStatus(PaymentStatus.SUCCESSFUL);
  }, [filterByStatus]);

  /**
   * Filtrar pagos fallidos
   */
  const filterFailed = useCallback(() => {
    filterByStatus(PaymentStatus.FAILED);
  }, [filterByStatus]);

  /**
   * Filtrar pagos pendientes
   */
  const filterPending = useCallback(() => {
    filterByStatus(PaymentStatus.PENDING);
  }, [filterByStatus]);

  /**
   * Filtrar por método de pago
   */
  const filterByMethod = useCallback((method?: PaymentMethod) => {
    updateFilters({ ...filters, paymentMethod: method });
  }, [filters, updateFilters]);

  /**
   * Filtrar tarjetas de crédito
   */
  const filterCreditCard = useCallback(() => {
    filterByMethod(PaymentMethod.CREDIT_CARD);
  }, [filterByMethod]);

  /**
   * Filtrar tarjetas de débito
   */
  const filterDebitCard = useCallback(() => {
    filterByMethod(PaymentMethod.DEBIT_CARD);
  }, [filterByMethod]);

  /**
   * Filtrar efectivo
   */
  const filterCash = useCallback(() => {
    filterByMethod(PaymentMethod.CASH);
  }, [filterByMethod]);

  /**
   * Mostrar todos los pagos
   */
  const filterAll = useCallback(() => {
    updateFilters({});
  }, [updateFilters]);

  /**
   * Formato de monto
   */
  const formatAmount = useCallback((amount: number): string => {
    return `$${amount.toLocaleString('es-CO')}`;
  }, []);

  /**
   * Obtener texto de estado
   */
  const getStatusText = useCallback((status: PaymentStatus): string => {
    const statusMap = {
      [PaymentStatus.SUCCESSFUL]: 'Exitoso',
      [PaymentStatus.FAILED]: 'Fallido',
      [PaymentStatus.PENDING]: 'Pendiente',
    };
    return statusMap[status] || status;
  }, []);

  /**
   * Obtener color de estado
   */
  const getStatusColor = useCallback((status: PaymentStatus): string => {
    const colorMap = {
      [PaymentStatus.SUCCESSFUL]: 'text-green-500',
      [PaymentStatus.FAILED]: 'text-red-500',
      [PaymentStatus.PENDING]: 'text-yellow-500',
    };
    return colorMap[status] || 'text-gray-500';
  }, []);

  /**
   * Obtener texto de método de pago
   */
  const getMethodText = useCallback((method: PaymentMethod): string => {
    const methodMap = {
      [PaymentMethod.CREDIT_CARD]: 'Tarjeta de Crédito',
      [PaymentMethod.DEBIT_CARD]: 'Tarjeta de Débito',
      [PaymentMethod.CASH]: 'Efectivo',
    };
    return methodMap[method] || method;
  }, []);

  /**
   * Efecto inicial
   */
  useEffect(() => {
    loadPayments(1);
    loadStats();
  }, [filters]); // Se recarga cuando cambian los filtros

  return {
    // Datos
    payments,
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
    loadPaymentById,
    
    // Filtros rápidos - Estado
    filterByStatus,
    filterSuccessful,
    filterFailed,
    filterPending,
    
    // Filtros rápidos - Método
    filterByMethod,
    filterCreditCard,
    filterDebitCard,
    filterCash,
    
    // Filtros generales
    filterAll,
    
    // Utilidades
    formatAmount,
    getStatusText,
    getStatusColor,
    getMethodText,
    
    // Estado actual de filtros
    currentFilters: filters,
  };
};

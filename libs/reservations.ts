// libs/reservations.ts
import { http } from './http-client';
import {
  ReservationWithRelations,
  ReservationSearchResult,
  UserReservationStats,
  ReservationSearchFilters
} from '../interfaces/reservation';

export interface CreateReservationData {
  parkingSpotId: string;
  vehicleId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  guestName?: string;
  guestContact?: string;
}

export interface ReservationResponse {
  id: string;
  userId: string;
  parkingSpotId: string;
  vehicleId: string;
  guestName?: string | null;
  guestContact?: string | null;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  updatedAt: string;
}

// Crear una reserva
export async function createReservation(reservationData: CreateReservationData): Promise<ReservationResponse> {
  try {
    const result = await http.post('/reservations', reservationData);
    return result.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

// Verificar disponibilidad de un espacio
export async function checkSpotAvailability(
  parkingSpotId: string, 
  startTime: string, 
  endTime: string
): Promise<{ isAvailable: boolean; conflicts: any[] }> {
  try {
    const result = await http.post('/reservations/availability', { 
      parkingSpotId, 
      startTime, 
      endTime 
    });
    return result.data;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
}

/**
 * Obtener mis reservaciones con paginación y filtros
 */
export async function fetchMyReservations(
  page: number = 1,
  limit: number = 20,
  filters?: ReservationSearchFilters
): Promise<ReservationSearchResult> {
  try {
    // Construir query params
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Agregar filtros si existen
    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          params.append('filters[status]', filters.status.join(','));
        } else {
          params.append('filters[status]', filters.status);
        }
      }
      if (filters.startDate) params.append('filters[startDate]', filters.startDate);
      if (filters.endDate) params.append('filters[endDate]', filters.endDate);
      if (filters.parkingId) params.append('filters[parkingId]', filters.parkingId);
    }

    const url = `/reservations/my?${params.toString()}`;
    
    const result = await http.get(url);

    console.log('API Response structure:', { 
      hasData: !!result.data,
      hasDataData: !!result.data?.data,
      hasPagination: !!result.data?.pagination 
    });

    // Adaptar la respuesta del backend al formato esperado
    const apiData = result.data;
    const adaptedResult: ReservationSearchResult = {
      reservations: apiData.data || [],
      total: apiData.pagination?.total || 0,
      totalPages: apiData.pagination?.pages || 1,
      currentPage: apiData.pagination?.page || page,
      hasNextPage: apiData.pagination?.hasNext || false,
      hasPreviousPage: apiData.pagination?.hasPrev || false,
    };

    console.log('Reservations adapted:', {
      count: adaptedResult.reservations.length,
      total: adaptedResult.total,
      page: adaptedResult.currentPage
    });

    return adaptedResult;
  } catch (error) {
    console.error('Error fetchMyReservations:', error);
    throw error;
  }
}

/**
 * Obtener una reservación por ID
 */
export async function fetchReservationById(reservationId: string): Promise<ReservationWithRelations> {
  try {
    const result = await http.get(`/reservations/${reservationId}`);
    return result.data;
  } catch (error) {
    console.error('Error fetchReservationById:', error);
    throw error;
  }
}

/**
 * Obtener estadísticas de mis reservaciones
 */
export async function fetchMyReservationStats(): Promise<UserReservationStats> {
  try {
    const result = await http.get('/reservations/my/stats');
    return result.data;
  } catch (error) {
    console.error('Error fetchMyReservationStats:', error);
    throw error;
  }
}

/**
 * Cancelar una reservación
 */
export async function cancelReservation(
  reservationId: string,
  reason?: string
): Promise<ReservationResponse> {
  try {
    const result = await http.patch(`/reservations/${reservationId}/cancel`, { reason });
    return result.data;
  } catch (error) {
    console.error('Error cancelReservation:', error);
    throw error;
  }
}

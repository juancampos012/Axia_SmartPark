// libs/reservations.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth';
import {
  ReservationWithRelations,
  ReservationSearchResult,
  UserReservationStats,
  ReservationSearchFilters
} from '../interfaces/reservation';
// import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

// const API_BASE_URL = ENV_API_BASE_URL || 'https://api.axiasmartpark.lat/api';
const API_BASE_URL = "https://api.axiasmartpark.lat/api";
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

// Wrapper para requests autenticados
async function authenticatedRequest(endpoint: string, options: RequestInit = {}) {
  let accessToken = await AsyncStorage.getItem('accessToken');
  const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
  
  if (!accessToken || !storedRefreshToken) {
    throw new Error('No authentication tokens found');
  }

  const makeRequest = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    return response;
  };

  // Primer intento
  let response = await makeRequest(accessToken);

  // Si token expiró, hacer refresh
  if (response.status === 401) {
    try {
      console.log('Token expired, refreshing...');
      const newTokens = await refreshToken();
      accessToken = newTokens.accessToken;
      
      // Reintentar con nuevo token
      response = await makeRequest(accessToken);
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Error ${response.status}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  return response;
}

// Crear una reserva
export async function createReservation(reservationData: CreateReservationData): Promise<ReservationResponse> {
  try {
    const response = await authenticatedRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error creating reservation');
    }

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
    const response = await authenticatedRequest('/reservations/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parkingSpotId, startTime, endTime }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error checking availability');
    }

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
    
    const response = await authenticatedRequest(url);
    const result = await response.json();

    console.log('API Response structure:', { 
      hasData: !!result.data,
      hasDataData: !!result.data?.data,
      hasPagination: !!result.data?.pagination 
    });

    if (!result.success) {
      throw new Error(result.message || 'Error obteniendo reservaciones');
    }

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
    const response = await authenticatedRequest(`/reservations/${reservationId}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error obteniendo reservación');
    }

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
    const response = await authenticatedRequest('/reservations/my/stats');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error obteniendo estadísticas');
    }

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
    const response = await authenticatedRequest(`/reservations/${reservationId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error cancelando reservación');
    }

    return result.data;
  } catch (error) {
    console.error('Error cancelReservation:', error);
    throw error;
  }
}

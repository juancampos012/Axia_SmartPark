// libs/reservations.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';

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
    const response = await authenticatedRequest('/availability', {
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

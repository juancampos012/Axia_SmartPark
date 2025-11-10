// libs/dashboard.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const API_BASE_URL = ENV_API_BASE_URL || "https://api.axiasmartpark.lat/api";
// const API_BASE_URL = "https://api.axiasmartpark.lat/api"; // Hardcoded (usar solo en emergencias)

export interface DashboardStats {
  user: {
    id: string;
    name: string;
    email: string;
    memberSince: string;
  };
  reservations: {
    total: number;
    active: number;
    completed: number;
    canceled: number;
    pending: number;
  };
  usage: {
    totalHoursParked: number;
    averageHoursPerReservation: number;
  };
  payments: {
    totalSpent: number;
    totalPayments: number;
    averagePerReservation: number;
  };
  vehicles: {
    count: number;
  };
  favoriteParking: {
    parkingId: string;
    parkingName: string;
    reservationCount: number;
  } | null;
  monthlyUsage: {
    month: string;
    reservations: number;
    hours: number;
  }[];
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

/**
 * Obtener estadísticas del dashboard del usuario actual
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await authenticatedRequest('/users/me/dashboard-stats');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error obteniendo estadísticas del dashboard');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetchDashboardStats:', error);
    throw error;
  }
}

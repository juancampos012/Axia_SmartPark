import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth'; 
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';
// const API_BASE_URL = "https://api.axiasmartpark.lat/api";

export async function fetchMyVehicles() {
  try {
    let accessToken = await AsyncStorage.getItem('accessToken');
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!accessToken || !storedRefreshToken) {
      throw new Error('No authentication tokens found');
    }

    const makeRequest = async (currentToken: string) => {
      const response = await fetch(`${API_BASE_URL}/vehicles/my`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    };

    // Primer intento con el token actual
    let response = await makeRequest(accessToken);

    // Si el token expiró (401), intentar refresh
    if (response.status === 401) {
      try {
        console.log('Token expirado, intentando refresh...');
        const newTokens = await refreshToken();
        accessToken = newTokens.accessToken;
        
        // Reintentar la request con el nuevo token
        response = await makeRequest(accessToken);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Si el refresh falla, limpiar tokens y lanzar error
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

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

export type VehicleTypeUpper = 'CAR' | 'MOTORCYCLE';
export type EngineType = 'GASOLINE' | 'ELECTRIC' | 'HYBRID';

export interface CreateVehicleDTO {
  type: VehicleTypeUpper; 
  licensePlate: string;   
  model: string;
  carBrand: string;
  color: string;
  engineType?: EngineType;
}

// Create a new vehicle for the authenticated user
export async function createVehicle(body: CreateVehicleDTO) {
  try {
    let accessToken = await AsyncStorage.getItem('accessToken');
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

    if (!accessToken || !storedRefreshToken) {
      throw new Error('No authentication tokens found');
    }

    // Helper to perform the POST request
    const makeRequest = async (currentToken: string) => {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response;
    };

    // First attempt
    let response = await makeRequest(accessToken);

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      try {
        const newTokens = await refreshToken();
        accessToken = newTokens.accessToken;
        response = await makeRequest(accessToken);
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
        throw new Error('Session expired. Please login again.');
      }
    }

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Error ${response.status}`;
      try {
        const errorData = errorText ? JSON.parse(errorText) : {};
        // Prefer backend message if present
        errorMessage = errorData.message || errorMessage;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(', ');
        }
      } catch {
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    // Backend envelope: { success, message, data }
    return result.data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}
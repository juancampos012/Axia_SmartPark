import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth'; 
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';

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
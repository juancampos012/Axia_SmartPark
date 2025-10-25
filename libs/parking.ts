import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
import { Parking, ParkingDetail, ParkingResponse } from '../interfaces/parking';

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';
// const API_BASE_URL = "https://api.axiasmartpark.lat/api";

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

// Obtener todos los parkings
export async function fetchAllParkings(): Promise<Parking[]> {
  try {
    const response = await authenticatedRequest('/parking');
    const result: ParkingResponse = await response.json();
    
    if (!result.success || !result.data || !result.data.results) {
      throw new Error('Invalid response format from server');
    }
    
    const transformedParkings: Parking[] = result.data.results.map(item => {
      const parking = item.parking;
      
      return {
        id: parking.id,
        name: parking.name,
        address: parking.address,
        latitude: parking.latitude,
        longitude: parking.longitude,
        actualCapacity: parking.actualCapacity,
        totalCapacity: parking.totalCapacity,
        floors: parking.floors,
        hourlyCarRate: parking.hourlyCarRate,
        hourlyMotorcycleRate: parking.hourlyMotorcycleRate,
        dailyRate: parking.dailyRate,
        monthlyRate: parking.monthlyRate,
        schedule: parking.schedule,
        status: parking.status,
        availableSpots: item.availability.availableSpots,
        totalSpots: parking.totalCapacity,
        distance: item.distance !== null ? item.distance : Math.random() * 2 + 0.5,
        rating: item.rating.average,
        ratingCount: item.rating.count,
        description: parking.description,
        image: 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
        features: getFeaturesFromParking(parking),
        isFavorite: false,
        parkingFloors: parking.parkingFloors || [],
        parkingSpots: parking.parkingSpots || []
      };
    });
    
    return transformedParkings;
  } catch (error) {
    console.error('Error fetching parkings:', error);
    throw error;
  }
}

// Obtener parkings cercanos
export async function fetchNearbyParkings(latitude: number, longitude: number, radius?: number): Promise<Parking[]> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      ...(radius && { radius: radius.toString() })
    });

    const response = await authenticatedRequest(`/parking/nearby?${params}`);
    const result: ParkingResponse = await response.json();
    
    if (!result.success || !result.data || !result.data.results) {
      throw new Error('Invalid response format from server');
    }
    
    return result.data.results.map(item => ({
      id: item.parking.id,
      name: item.parking.name,
      address: item.parking.address,
      latitude: item.parking.latitude,
      longitude: item.parking.longitude,
      actualCapacity: item.parking.actualCapacity,
      totalCapacity: item.parking.totalCapacity,
      floors: item.parking.floors,
      hourlyCarRate: item.parking.hourlyCarRate,
      hourlyMotorcycleRate: item.parking.hourlyMotorcycleRate,
      dailyRate: item.parking.dailyRate,
      monthlyRate: item.parking.monthlyRate,
      schedule: item.parking.schedule,
      status: item.parking.status,
      availableSpots: item.availability.availableSpots,
      totalSpots: item.parking.totalCapacity,
      distance: item.distance !== null ? item.distance : Math.random() * 2 + 0.5,
      rating: item.rating.average,
      ratingCount: item.rating.count,
      description: item.parking.description,
      image: 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
      features: getFeaturesFromParking(item.parking),
      isFavorite: false,
      parkingFloors: item.parking.parkingFloors || [],
      parkingSpots: item.parking.parkingSpots || []
    }));
  } catch (error) {
    console.error('Error fetching nearby parkings:', error);
    throw error;
  }
}

// Obtener un parqueadero por ID
export async function fetchParkingById(parkingId: string): Promise<Parking> {
  try {
    const response = await authenticatedRequest(`/parking/${parkingId}`);
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Invalid response format from server');
    }

    const parking = result.data.parking || result.data;
    const availability = result.data.availability || { availableSpots: 0, isAvailable: true };
    const rating = result.data.rating || { average: 0, count: 0 };
    const distance = result.data.distance ?? Math.random() * 2 + 0.5;

    const transformedParking: Parking = {
      id: parking.id,
      name: parking.name,
      address: parking.address,
      latitude: parking.latitude,
      longitude: parking.longitude,
      actualCapacity: parking.actualCapacity,
      totalCapacity: parking.totalCapacity,
      floors: parking.floors,
      hourlyCarRate: parking.hourlyCarRate,
      hourlyMotorcycleRate: parking.hourlyMotorcycleRate,
      dailyRate: parking.dailyRate,
      monthlyRate: parking.monthlyRate,
      schedule: parking.schedule,
      status: parking.status,
      availableSpots: availability.availableSpots ?? 0,
      totalSpots: parking.totalCapacity ?? 0,
      distance,
      rating: rating.average ?? 0,
      ratingCount: rating.count ?? 0,
      description: parking.description,
      image: 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
      features: getFeaturesFromParking(parking),
      isFavorite: false,
      parkingFloors: parking.parkingFloors || [],
      parkingSpots: parking.parkingSpots || [],
    };

    return transformedParking;
  } catch (error) {
    console.error(`Error fetching parking by ID (${parkingId}):`, error);
    throw error;
  }
}

// Función auxiliar para derivar features del parking
function getFeaturesFromParking(parking: ParkingDetail): string[] {
  const features: string[] = [];
  
  // Verificar si tiene spots eléctricos
  const hasElectricSpots = parking.parkingSpots?.some(spot => spot.spotType === 'ELECTRIC');
  if (hasElectricSpots) {
    features.push('Carga eléctrica');
  }
  
  // Verificar si tiene spots para discapacitados
  const hasHandicappedSpots = parking.parkingSpots?.some(spot => spot.spotType === 'HANDICAPPED');
  if (hasHandicappedSpots) {
    features.push('Accesible');
  }
  
  // Características básicas basadas en la información disponible
  features.push('Seguridad 24/7');
  features.push('Cámaras de vigilancia');
  
  if (parking.floors > 1) {
    features.push('Múltiples pisos');
  }
  
  return features;
}
import { http } from './http-client';
import { Parking, ParkingDetail, ParkingResponse } from '../interfaces/parking';

/**
 * Obtener todos los parqueaderos
 */
export async function fetchAllParkings(): Promise<Parking[]> {
  try {
    const result: ParkingResponse = await http.get('/parking');

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

/**
 * Obtener parqueaderos cercanos
 */
export async function fetchNearbyParkings(latitude: number, longitude: number, radius?: number): Promise<Parking[]> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      ...(radius && { radius: radius.toString() })
    });

    const result: ParkingResponse = await http.get(`/parking/nearby?${params}`);
    
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

/**
 * Obtener un parqueadero por ID
 */
export async function fetchParkingById(parkingId: string): Promise<Parking> {
  try {
    const result = await http.get(`/parking/${parkingId}`);

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

/**
 * Función auxiliar para derivar features del parking
 */
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
import { http, HttpError, API_BASE_URL } from './http-client';

/**
 * Convertir URL relativa a absoluta
 * Corrige URLs absolutas con dominio incorrecto (localhost o IPs locales)
 */
const makeAbsoluteUrl = (url: string | undefined | null): string | undefined => {
  if (!url) return url || undefined;
  
  // Obtener la base URL correcta sin el /api al final
  const baseUrl = API_BASE_URL.replace('/api', '');
  
  // Si ya es una URL absoluta
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Extraer solo la parte después de /uploads/
    const uploadsMatch = url.match(/\/uploads\/.+/);
    if (uploadsMatch) {
      return `${baseUrl}${uploadsMatch[0]}`;
    }
    return url;
  }
  
  // Si es relativa, agregar el dominio
  const relativePath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${relativePath}`;
};

/**
 * Tipos de datos para vehículos
 */
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

export interface UpdateVehicleDTO {
  type?: VehicleTypeUpper;
  licensePlate?: string;
  model?: string;
  carBrand?: string;
  color?: string;
  engineType?: EngineType | null;
}

/**
 * Obtener mis vehículos
 */
export async function fetchMyVehicles() {
  try {
    const result = await http.get('/vehicles/my');
    
    // Convertir las URLs de imágenes a absolutas
    const vehicles = result.data || [];
    return vehicles.map((vehicle: any) => ({
      ...vehicle,
      image: makeAbsoluteUrl(vehicle.image)
    }));
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

/**
 * Crear un nuevo vehículo
 */
export async function createVehicle(body: CreateVehicleDTO) {
  try {
    const result = await http.post('/vehicles', body);
    return result.data;
  } catch (error) {
    console.error('Error creating vehicle:', error);
    
    // Mejorar el mensaje de error si es posible
    if (error instanceof HttpError) {
      if (error.status === 409) {
        throw new Error('Ya existe un vehículo con esta placa');
      } else if (error.status === 400) {
        throw new Error(error.message || 'Datos del vehículo inválidos');
      }
    }
    
    throw error;
  }
}

/**
 * Eliminar un vehículo
 */
export async function deleteVehicle(vehicleId: string) {
  try {
    await http.delete(`/vehicles/${vehicleId}`);
    return { success: true, message: 'Vehículo eliminado correctamente' };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    
    // Manejar errores específicos del backend
    if (error instanceof HttpError) {
      const errorData = error.data;
      
      if (errorData?.code === 'ACTIVE_RESERVATIONS') {
        throw new Error('No se puede eliminar el vehículo porque tiene reservas activas. Cancela las reservas primero.');
      } else if (errorData?.code === 'VEHICLE_NOT_FOUND') {
        throw new Error('El vehículo no fue encontrado.');
      } else if (errorData?.code === 'UNAUTHORIZED_VEHICLE_ACCESS') {
        throw new Error('No tienes permisos para eliminar este vehículo.');
      }
    }
    
    throw error;
  }
}

/**
 * Actualizar un vehículo existente
 */
export async function updateVehicle(vehicleId: string, body: UpdateVehicleDTO) {
  try {
    const result = await http.put(`/vehicles/${vehicleId}`, body);
    
    // Convertir la URL de imagen a absoluta si existe
    const vehicle = result.data;
    if (vehicle?.image) {
      vehicle.image = makeAbsoluteUrl(vehicle.image);
    }
    
    return vehicle;
  } catch (error) {
    console.error('Error updating vehicle:', error);
    
    // Mejorar mensajes de error
    if (error instanceof HttpError) {
      if (error.status === 409) {
        throw new Error('Ya existe otro vehículo con esta placa');
      } else if (error.status === 404) {
        throw new Error('Vehículo no encontrado');
      } else if (error.status === 400) {
        throw new Error(error.message || 'Datos del vehículo inválidos');
      }
    }
    
    throw error;
  }
}
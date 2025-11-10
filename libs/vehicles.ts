import { http, HttpError } from './http-client';

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
    return result.data;
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
    return result.data;
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
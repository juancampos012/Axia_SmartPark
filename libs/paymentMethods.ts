/**
 * PAYMENT METHODS SERVICE
 * 
 * Servicio para manejar operaciones de métodos de pago con el backend.
 * Incluye tokenización segura y manejo de tarjetas.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
import { 
  PaymentMethodResponse,
  PaymentMethodWithStats,
  CreatePaymentMethodDTO,
  UpdatePaymentMethodDTO,
  SavedPaymentMethod
} from '../interfaces/paymentMethod';
import { ApiResponse } from '../interfaces/ApiTypes';

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Helper para obtener el token de autenticación
 */
const getAuthToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No hay sesión activa. Por favor inicia sesión.');
  }
  return token;
};

/**
 * Helper para manejar errores de la API
 */
const handleApiError = (error: any): never => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error.message) {
    throw new Error(error.message);
  }
  throw new Error('Error al comunicarse con el servidor');
};

/**
 * Crear un nuevo método de pago
 * POST /api/payment-methods
 */
export const createPaymentMethod = async (data: CreatePaymentMethodDTO): Promise<PaymentMethodResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result: ApiResponse<PaymentMethodResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al crear el método de pago');
    }

    if (!result.data) {
      throw new Error('No se recibió información del método de pago');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener todos los métodos de pago del usuario
 * GET /api/payment-methods
 */
export const getUserPaymentMethods = async (): Promise<PaymentMethodResponse[]> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<PaymentMethodResponse[]> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener los métodos de pago');
    }

    if (!result.data) {
      throw new Error('No se recibió información de los métodos de pago');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener el método de pago por defecto
 * GET /api/payment-methods/default
 */
export const getDefaultPaymentMethod = async (): Promise<PaymentMethodResponse | null> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods/default`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<PaymentMethodResponse | null> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener el método de pago por defecto');
    }

    // En este caso, result.data puede ser null si no hay método por defecto
    return result.data ?? null;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener un método de pago por ID
 * GET /api/payment-methods/:id
 */
export const getPaymentMethodById = async (id: string): Promise<PaymentMethodResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<PaymentMethodResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener el método de pago');
    }

    if (!result.data) {
      throw new Error('No se recibió información del método de pago');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener un método de pago con estadísticas
 * GET /api/payment-methods/:id/stats
 */
export const getPaymentMethodWithStats = async (id: string): Promise<PaymentMethodWithStats> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<PaymentMethodWithStats> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener el método de pago con estadísticas');
    }

    if (!result.data) {
      throw new Error('No se recibió información del método de pago con estadísticas');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Actualizar un método de pago
 * PUT /api/payment-methods/:id
 */
export const updatePaymentMethod = async (id: string, data: UpdatePaymentMethodDTO): Promise<PaymentMethodResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result: ApiResponse<PaymentMethodResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al actualizar el método de pago');
    }

    if (!result.data) {
      throw new Error('No se recibió información del método de pago actualizado');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Establecer un método de pago como predeterminado
 * PATCH /api/payment-methods/:id/set-default
 */
export const setDefaultPaymentMethod = async (id: string): Promise<PaymentMethodResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}/set-default`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<PaymentMethodResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al establecer el método de pago por defecto');
    }

    if (!result.data) {
      throw new Error('No se recibió información del método de pago actualizado');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Eliminar un método de pago (soft delete)
 * DELETE /api/payment-methods/:id
 */
export const deletePaymentMethod = async (id: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<void> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al eliminar el método de pago');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
import { 
  PaymentResponse,
  PaymentWithRelations,
  CreatePaymentDTO, 
  UpdatePaymentDTO, 
  PaymentSearchFilters,
  PaymentSearchResult,
  UserPaymentStats
} from '../interfaces/payment';
import { ApiResponse } from '../interfaces/ApiTypes';

// const API_BASE_URL = ENV_API_BASE_URL || 'https://api.axiasmartpark.lat/api';
const API_BASE_URL = "https://api.axiasmartpark.lat/api";

/**
 * Interfaz para crear reservación con pago en una transacción
 */
export interface CreateReservationWithPaymentDTO {
  // Datos de reservación
  parkingSpotId: string;
  vehicleId: string;
  guestName?: string;
  guestContact?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  
  // Datos de pago
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';
  paymentMethodId?: string; // ID del método de pago guardado
  transactionId?: string;
}

/**
 * Respuesta de crear reservación con pago
 */
export interface ReservationWithPaymentResponse {
  reservation: {
    id: string;
    userId: string;
    parkingSpotId: string;
    vehicleId: string;
    guestName?: string | null;
    guestContact?: string | null;
    startTime: string;
    endTime: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    parkingSpot: {
      id: string;
      spotNumber: string;
      parking: {
        id: string;
        name: string;
        address: string;
      };
    };
    vehicle: {
      id: string;
      licensePlate: string;
      model: string;
      carBrand: string;
    };
  };
  payment: PaymentResponse;
}

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
 * Crea una reservación y su pago en una sola transacción
 * Este es el método RECOMENDADO para procesar reservas con pago
 * POST /api/payments/reserve-and-pay
 */
export const createReservationWithPayment = async (
  data: CreateReservationWithPaymentDTO
): Promise<ReservationWithPaymentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/reserve-and-pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al crear la reservación con pago');
    }

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Respuesta inválida del servidor');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error en createReservationWithPayment:', error);
    throw new Error(error.message || 'Error al crear la reservación con pago');
  }
};

/**
 * Marca un pago como exitoso
 * POST /api/payments/:id/success
 */
export const processPaymentSuccess = async (
  paymentId: string,
  transactionId?: string
): Promise<PaymentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ transactionId })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al procesar el pago exitoso');
    }

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Respuesta inválida del servidor');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error en processPaymentSuccess:', error);
    throw new Error(error.message || 'Error al procesar el pago exitoso');
  }
};

/**
 * Marca un pago como fallido
 * POST /api/payments/:id/failure
 */
export const processPaymentFailure = async (
  paymentId: string,
  failureReason: string,
  transactionId?: string
): Promise<PaymentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/failure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ failureReason, transactionId })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al procesar el fallo del pago');
    }

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Respuesta inválida del servidor');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error en processPaymentFailure:', error);
    throw new Error(error.message || 'Error al procesar el fallo del pago');
  }
};

/**
 * Crear un nuevo pago (requiere reservación existente)
 * POST /api/payments
 * @deprecated Use createReservationWithPayment instead
 */
export const createPayment = async (data: CreatePaymentDTO): Promise<PaymentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result: ApiResponse<PaymentResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al crear el pago');
    }

    if (!result.data) {
      throw new Error('No se recibió información del pago');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener mis pagos con paginación y filtros
 * GET /api/payments/my
 */
export const fetchMyPayments = async (
  page: number = 1,
  limit: number = 20,
  filters?: PaymentSearchFilters
): Promise<PaymentSearchResult> => {
  try {
    const token = await getAuthToken();
    
    // Construir query params
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Agregar filtros si existen
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters.amountFrom) params.append('amountFrom', filters.amountFrom.toString());
      if (filters.amountTo) params.append('amountTo', filters.amountTo.toString());
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
    }
    
    const response = await fetch(
      `${API_BASE_URL}/payments/my?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const result: ApiResponse<PaymentSearchResult> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener los pagos');
    }

    if (!result.data) {
      throw new Error('No se recibió información de los pagos');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Mantener alias para compatibilidad
export const getMyPayments = fetchMyPayments;

/**
 * Obtener un pago por ID con relaciones completas
 * GET /api/payments/:id
 */
export const fetchPaymentById = async (id: string): Promise<PaymentWithRelations> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<PaymentWithRelations> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener el pago');
    }

    if (!result.data) {
      throw new Error('No se recibió información del pago');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Mantener alias para compatibilidad
export const getPaymentById = fetchPaymentById;

/**
 * Obtener pago por ID de reservación
 * GET /api/payments/reservation/:reservationId
 */
export const getPaymentByReservationId = async (reservationId: string): Promise<PaymentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/reservation/${reservationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<PaymentResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener el pago de la reservación');
    }

    if (!result.data) {
      throw new Error('No se recibió información del pago de la reservación');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Actualizar un pago
 * PUT /api/payments/:id
 */
export const updatePayment = async (id: string, data: UpdatePaymentDTO): Promise<PaymentResponse> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result: ApiResponse<PaymentResponse> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al actualizar el pago');
    }

    if (!result.data) {
      throw new Error('No se recibió información del pago actualizado');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtener mis estadísticas de pagos
 * GET /api/payments/stats/my
 */
export const fetchMyPaymentStats = async (): Promise<UserPaymentStats> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/stats/my`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<UserPaymentStats> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al obtener las estadísticas');
    }

    if (!result.data) {
      throw new Error('No se recibió información de estadísticas');
    }

    return result.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Mantener alias para compatibilidad
export const getMyPaymentStats = fetchMyPaymentStats;

/**
 * Eliminar un pago (solo Super Admin)
 * DELETE /api/payments/:id
 */
export const deletePayment = async (id: string): Promise<void> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result: ApiResponse<void> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Error al eliminar el pago');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

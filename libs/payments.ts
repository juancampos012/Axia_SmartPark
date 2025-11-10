import { http } from './http-client';
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
 * Crea una reservación y su pago en una sola transacción
 * Este es el método RECOMENDADO para procesar reservas con pago
 * POST /api/payments/reserve-and-pay
 */
export const createReservationWithPayment = async (
  data: CreateReservationWithPaymentDTO
): Promise<ReservationWithPaymentResponse> => {
  try {
    const result = await http.post('/payments/reserve-and-pay', data);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al crear la reservación con pago');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error en createReservationWithPayment:', error);
    throw error;
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
    const result = await http.post(`/payments/${paymentId}/success`, { transactionId });

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al procesar el pago exitoso');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error en processPaymentSuccess:', error);
    throw error;
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
    const result = await http.post(`/payments/${paymentId}/failure`, { failureReason, transactionId });

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al procesar el fallo del pago');
    }

    return result.data;
  } catch (error: any) {
    console.error('Error en processPaymentFailure:', error);
    throw error;
  }
};

/**
 * Crear un nuevo pago (requiere reservación existente)
 * POST /api/payments
 * @deprecated Use createReservationWithPayment instead
 */
export const createPayment = async (data: CreatePaymentDTO): Promise<PaymentResponse> => {
  try {
    const result: ApiResponse<PaymentResponse> = await http.post('/payments', data);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al crear el pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
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

    const result: ApiResponse<PaymentSearchResult> = await http.get(`/payments/my?${params.toString()}`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener los pagos');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching my payments:', error);
    throw error;
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
    const result: ApiResponse<PaymentWithRelations> = await http.get(`/payments/${id}`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener el pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching payment by ID:', error);
    throw error;
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
    const result: ApiResponse<PaymentResponse> = await http.get(`/payments/reservation/${reservationId}`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener el pago de la reservación');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching payment by reservation ID:', error);
    throw error;
  }
};

/**
 * Actualizar un pago
 * PUT /api/payments/:id
 */
export const updatePayment = async (id: string, data: UpdatePaymentDTO): Promise<PaymentResponse> => {
  try {
    const result: ApiResponse<PaymentResponse> = await http.put(`/payments/${id}`, data);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al actualizar el pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

/**
 * Obtener mis estadísticas de pagos
 * GET /api/payments/stats/my
 */
export const fetchMyPaymentStats = async (): Promise<UserPaymentStats> => {
  try {
    const result: ApiResponse<UserPaymentStats> = await http.get('/payments/stats/my');

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener las estadísticas');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    throw error;
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
    const result: ApiResponse<void> = await http.delete(`/payments/${id}`);

    if (!result.success) {
      throw new Error(result.message || 'Error al eliminar el pago');
    }
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

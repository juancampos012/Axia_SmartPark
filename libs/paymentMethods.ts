import { http } from './http-client';
import {
  PaymentMethodResponse,
  PaymentMethodWithStats,
  CreatePaymentMethodDTO,
  UpdatePaymentMethodDTO,
  SavedPaymentMethod
} from '../interfaces/paymentMethod';
import { ApiResponse } from '../interfaces/ApiTypes';

/**
 * Crear un nuevo método de pago
 * POST /api/payment-methods
 */
export const createPaymentMethod = async (data: CreatePaymentMethodDTO): Promise<PaymentMethodResponse> => {
  try {
    const result: ApiResponse<PaymentMethodResponse> = await http.post('/payment-methods', data);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al crear el método de pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
};

/**
 * Obtener todos los métodos de pago del usuario
 * GET /api/payment-methods
 */
export const getUserPaymentMethods = async (): Promise<PaymentMethodResponse[]> => {
  try {
    const result: ApiResponse<PaymentMethodResponse[]> = await http.get('/payment-methods');

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener los métodos de pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

/**
 * Obtener el método de pago por defecto
 * GET /api/payment-methods/default
 */
export const getDefaultPaymentMethod = async (): Promise<PaymentMethodResponse | null> => {
  try {
    const result: ApiResponse<PaymentMethodResponse | null> = await http.get('/payment-methods/default');

    if (!result.success) {
      throw new Error(result.message || 'Error al obtener el método de pago por defecto');
    }

    // En este caso, result.data puede ser null si no hay método por defecto
    return result.data ?? null;
  } catch (error) {
    console.error('Error fetching default payment method:', error);
    throw error;
  }
};

/**
 * Obtener un método de pago por ID
 * GET /api/payment-methods/:id
 */
export const getPaymentMethodById = async (id: string): Promise<PaymentMethodResponse> => {
  try {
    const result: ApiResponse<PaymentMethodResponse> = await http.get(`/payment-methods/${id}`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener el método de pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching payment method by ID:', error);
    throw error;
  }
};

/**
 * Obtener un método de pago con estadísticas
 * GET /api/payment-methods/:id/stats
 */
export const getPaymentMethodWithStats = async (id: string): Promise<PaymentMethodWithStats> => {
  try {
    const result: ApiResponse<PaymentMethodWithStats> = await http.get(`/payment-methods/${id}/stats`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener el método de pago con estadísticas');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching payment method with stats:', error);
    throw error;
  }
};

/**
 * Actualizar un método de pago
 * PUT /api/payment-methods/:id
 */
export const updatePaymentMethod = async (id: string, data: UpdatePaymentMethodDTO): Promise<PaymentMethodResponse> => {
  try {
    const result: ApiResponse<PaymentMethodResponse> = await http.put(`/payment-methods/${id}`, data);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al actualizar el método de pago');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

/**
 * Establecer un método de pago como predeterminado
 * PATCH /api/payment-methods/:id/set-default
 */
export const setDefaultPaymentMethod = async (id: string): Promise<PaymentMethodResponse> => {
  try {
    const result: ApiResponse<PaymentMethodResponse> = await http.patch(`/payment-methods/${id}/set-default`, {});

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al establecer el método de pago por defecto');
    }

    return result.data;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

/**
 * Eliminar un método de pago (soft delete)
 * DELETE /api/payment-methods/:id
 */
export const deletePaymentMethod = async (id: string): Promise<void> => {
  try {
    const result: ApiResponse<void> = await http.delete(`/payment-methods/${id}`);

    if (!result.success) {
      throw new Error(result.message || 'Error al eliminar el método de pago');
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

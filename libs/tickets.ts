import { http } from './http-client';
import { ApiResponse } from '../interfaces/ApiTypes';

/**
 * Interfaz para un ticket
 */
export interface Ticket {
  id: string;
  reservationId: string;
  userId: string;
  ticketNumber: string;
  qrCode?: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  // Relaciones opcionales
  reservation?: any;
  user?: any;
}

/**
 * Resultado de búsqueda de tickets con paginación
 */
export interface TicketSearchResult {
  tickets: Ticket[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Filtros para buscar tickets
 */
export interface TicketSearchFilters {
  status?: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Obtener mis tickets
 * GET /api/tickets/my
 * 
 * NOTA: Este endpoint NO acepta parámetros de paginación en el query string.
 * Si necesitas paginación, debes solicitarla al backend.
 */
export const fetchMyTickets = async (): Promise<Ticket[]> => {
  try {
    // Llamar sin parámetros de paginación
    const result: ApiResponse<Ticket[]> = await http.get('/tickets/my');

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener los tickets');
    }

    // El backend retorna directamente un array de tickets
    return result.data;
  } catch (error) {
    console.error('Error fetching my tickets:', error);
    throw error;
  }
};

/**
 * Alias para compatibilidad
 */
export const getMyTickets = fetchMyTickets;

/**
 * Obtener un ticket por ID
 * GET /api/tickets/:id
 */
export const fetchTicketById = async (id: string): Promise<Ticket> => {
  try {
    const result: ApiResponse<Ticket> = await http.get(`/tickets/${id}`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener el ticket');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    throw error;
  }
};

/**
 * Alias para compatibilidad
 */
export const getTicketById = fetchTicketById;

/**
 * Obtener ticket por ID de reservación
 * GET /api/tickets/reservation/:reservationId
 */
export const getTicketByReservationId = async (reservationId: string): Promise<Ticket> => {
  try {
    const result: ApiResponse<Ticket> = await http.get(`/tickets/reservation/${reservationId}`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al obtener el ticket de la reservación');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching ticket by reservation ID:', error);
    throw error;
  }
};

/**
 * Validar un ticket
 * POST /api/tickets/:id/validate
 */
export const validateTicket = async (id: string): Promise<Ticket> => {
  try {
    const result: ApiResponse<Ticket> = await http.post(`/tickets/${id}/validate`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al validar el ticket');
    }

    return result.data;
  } catch (error) {
    console.error('Error validating ticket:', error);
    throw error;
  }
};

/**
 * Cancelar un ticket
 * POST /api/tickets/:id/cancel
 */
export const cancelTicket = async (id: string): Promise<Ticket> => {
  try {
    const result: ApiResponse<Ticket> = await http.post(`/tickets/${id}/cancel`);

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error al cancelar el ticket');
    }

    return result.data;
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    throw error;
  }
};

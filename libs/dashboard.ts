// libs/dashboard.ts
import { http } from './http-client';

export interface DashboardStats {
  user: {
    id: string;
    name: string;
    email: string;
    memberSince: string;
  };
  reservations: {
    total: number;
    active: number;
    completed: number;
    canceled: number;
    pending: number;
  };
  usage: {
    totalHoursParked: number;
    averageHoursPerReservation: number;
  };
  payments: {
    totalSpent: number;
    totalPayments: number;
    averagePerReservation: number;
  };
  vehicles: {
    count: number;
  };
  favoriteParking: {
    parkingId: string;
    parkingName: string;
    reservationCount: number;
  } | null;
  monthlyUsage: {
    month: string;
    reservations: number;
    hours: number;
  }[];
}

/**
 * Obtener estadísticas del dashboard del usuario actual
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const result = await http.get('/users/me/dashboard-stats');

    if (!result.success) {
      throw new Error(result.message || 'Error obteniendo estadísticas del dashboard');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetchDashboardStats:', error);
    throw error;
  }
}

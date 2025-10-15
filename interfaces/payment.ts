/**
 * PAYMENT INTERFACES
 * 
 * Interfaces TypeScript para el módulo de pagos del sistema SmartPark.
 * Alineadas con el backend ASP_backend.
 */

// Enums - Deben coincidir con Prisma schema
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

// Entidad base
export interface PaymentEntity {
  id: string;
  reservationId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paymentDate: string; // ISO 8601 date string
  createdAt: string;
  updatedAt: string;
}

// Respuesta del API con relaciones
export interface PaymentResponse extends PaymentEntity {
  reservation?: {
    id: string;
    parkingSpotId: string;
    startTime: string;
    endTime: string;
  };
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// DTO para crear pago
export interface CreatePaymentDTO {
  reservationId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string; // Opcional: se genera después del procesamiento
  paymentStatus: PaymentStatus; // Requerido: estado inicial del pago
  paymentMethodId?: string; // Opcional: ID del método de pago guardado usado
}

// DTO para actualizar pago
export interface UpdatePaymentDTO {
  status?: PaymentStatus;
  transactionId?: string;
}

// Filtros de búsqueda
export interface PaymentSearchFilters {
  userId?: string;
  reservationId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Resultado de búsqueda con paginación
export interface PaymentSearchResult {
  payments: PaymentResponse[];
  total: number;
  page: number;
  pageSize: number;
}

// Estadísticas de pagos
export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  averageAmount: number;
  paymentsByMethod: Record<PaymentMethod, number>;
  paymentsByStatus: Record<PaymentStatus, number>;
  monthlyRevenue: {
    month: string;
    revenue: number;
    count: number;
  }[];
}

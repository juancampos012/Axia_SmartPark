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
  CASH = 'CASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED'
}

// Entidad base
export interface PaymentEntity {
  id: string;
  reservationId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string | null;
  paymentMethodId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// Respuesta simple del API
export interface PaymentResponse extends PaymentEntity {}

// Respuesta completa con relaciones
export interface PaymentWithRelations extends PaymentResponse {
  reservation?: {
    id: string;
    userId: string;
    startTime: string;
    endTime: string;
    status: string;
    vehicle?: {
      id: string;
      licensePlate: string;
      model: string;
      carBrand: string;
    };
    parkingSpot?: {
      id: string;
      spotNumber: string;
      parking?: {
        id: string;
        name: string;
        address: string;
      };
    };
  };
  tickets?: Array<{
    id: string;
    code: string;
    vehiclePlate: string;
    entryTime: string;
    exitTime: string | null;
    status: string;
  }>;
  paymentMethodDetail?: {
    id: string;
    cardType: string;
    lastFourDigits: string;
    cardholderName: string;
    expirationDate: string;
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

// DTO para crear reservación con pago (transacción completa)
export interface CreateReservationWithPaymentDTO {
  parkingSpotId: string;
  vehicleId: string;
  guestName?: string;
  guestContact?: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodId?: string;
  transactionId?: string;
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
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  amountFrom?: number;
  amountTo?: number;
  dateFrom?: string;
  dateTo?: string;
  parkingId?: string;
}

// Resultado de búsqueda con paginación
export interface PaymentSearchResult {
  payments: PaymentWithRelations[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Estadísticas de pagos del usuario
export interface UserPaymentStats {
  totalPayments: number;
  totalSpent: number;
  averagePayment: number;
  successfulPayments: number;
  failedPayments: number;
  favoritePaymentMethod: PaymentMethod | null;
  monthlySpending: {
    month: string;
    amount: number;
    payments: number;
  }[];
}

// Estadísticas de pagos globales (admin)
export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  averageAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  successRate: number;
  paymentsByMethod: {
    method: PaymentMethod;
    count: number;
    totalAmount: number;
  }[];
  monthlyStats: {
    month: string;
    totalPayments: number;
    totalAmount: number;
    averageAmount: number;
  }[];
}

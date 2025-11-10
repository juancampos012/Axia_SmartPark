/**
 * RESERVATION INTERFACES
 * 
 * Interfaces TypeScript para el módulo de reservaciones del sistema SmartPark.
 * Alineadas con el backend ASP_backend.
 */

// Enums - Deben coincidir con Prisma schema
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

// Entidad base de Reservación
export interface ReservationEntity {
  id: string;
  userId: string;
  parkingSpotId: string;
  vehicleId: string;
  guestName: string | null;
  guestContact: string | null;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

// Respuesta simple de reservación
export interface ReservationResponse extends ReservationEntity {}

// Respuesta completa con relaciones
export interface ReservationWithRelations extends ReservationEntity {
  parkingSpot?: {
    id: string;
    spotNumber: string;
    type: string;
    status: string;
    parking?: {
      id: string;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
    floor?: {
      id: string;
      floorNumber: number;
      name: string | null;
    };
  };
  vehicle?: {
    id: string;
    licensePlate: string;
    model: string;
    carBrand: string;
    color: string | null;
    type: string;
    engineType: string | null;
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    paymentMethod: string;
    transactionId: string | null;
    createdAt: string;
  };
  ticket?: {
    id: string;
    code: string;
    vehiclePlate: string;
    entryTime: string;
    exitTime: string | null;
    status: string;
  };
}

// DTO para crear una reservación
export interface CreateReservationDTO {
  parkingSpotId: string;
  vehicleId: string;
  guestName?: string;
  guestContact?: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
}

// DTO para actualizar una reservación
export interface UpdateReservationDTO {
  startTime?: string;
  endTime?: string;
  status?: ReservationStatus;
  guestName?: string;
  guestContact?: string;
}

// Filtros de búsqueda para reservaciones
export interface ReservationSearchFilters {
  status?: ReservationStatus | ReservationStatus[];
  parkingId?: string;
  startDate?: string;
  endDate?: string;
  startTimeFrom?: string;
  startTimeTo?: string;
  endTimeFrom?: string;
  endTimeTo?: string;
}

// Resultado de búsqueda con paginación
export interface ReservationSearchResult {
  reservations: ReservationWithRelations[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Estadísticas de reservaciones del usuario
export interface UserReservationStats {
  totalReservations: number;
  activeReservations: number;
  completedReservations: number;
  canceledReservations: number;
  favoriteParking: {
    parkingId: string;
    parkingName: string;
    reservationCount: number;
  } | null;
  totalHoursParked: number;
  monthlyUsage: {
    month: string;
    reservations: number;
    hours: number;
  }[];
}

// Verificación de disponibilidad
export interface AvailabilityCheck {
  parkingSpotId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  conflicts?: {
    existingReservationId: string;
    conflictStart: string;
    conflictEnd: string;
  }[];
}

// Request para verificar disponibilidad
export interface CheckAvailabilityDTO {
  parkingSpotId: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
}

// Datos para confirmar reservación
export interface ConfirmReservationDTO {
  guestName?: string;
  guestContact?: string;
  actualEntryTime?: string;
}

// Datos para cancelar reservación
export interface CancelReservationDTO {
  reason?: string;
}

import { Role } from "./User";

// User management interfaces

export interface AdminUserFilters {
  search?: string;
  role?: Role; // Usa el 'Role' que ya importaste
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUserListItem {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  parkingId?: string | null;
  createdAt: Date;
}

export interface AdminUserDetail extends AdminUserListItem {
  lastLoginAt: Date | null;
  vehiclesCount?: number;
  reservationsCount?: number;
  reviewsCount?: number;
}

export interface CreateUserDTO {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDTO {
  name?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: Role;
  isActive?: boolean;
}

// Parking management interfaces
export interface AdminParkingInfo {
  id: string;
  name: string;
  address: string;
  description?: string;
  totalCapacity: number;
  actualCapacity: number;
  floors: number;
  hourlyCarRate: number;
  hourlyMotorcycleRate: number;
  dailyRate?: number;
  monthlyRate?: number;
  schedule: string;
  status: 'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE';
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateParkingDTO {
  name?: string;
  address?: string;
  description?: string;
  hourlyCarRate?: number;
  hourlyMotorcycleRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  schedule?: string;
  status?: 'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE';
}

// API Response types
export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUserListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface AdminUserResponse {
  success: boolean;
  message: string;
  data: AdminUserDetail;
}

export interface AdminParkingResponse {
  success: boolean;
  message: string;
  data: AdminParkingInfo;
}

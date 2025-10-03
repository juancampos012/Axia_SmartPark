// Enums
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPERATOR = 'OPERATOR'
}

// Base User entity interface
export interface User {
  id: string;
  name: string;
  email: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  lockedUntil?: Date;
  loginAttempts: number;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs for API requests
export interface UserCreateDTO {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface UserUpdateDTO {
  name?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UserProfileDTO {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Response types
export interface UserResponse extends User {
  // Omit sensitive fields like password, etc.
}

// Legacy support (keeping for backward compatibility)
export interface UserDTO {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface UserDAO extends UserDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}
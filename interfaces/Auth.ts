import { Role } from "./User";

// DTOs for authentication requests
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailDTO {
  token: string;
}

export interface ResendVerificationDTO {
  email: string;
}

export interface AuthUserData {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phoneNumber: string | null;
  role: Role;
  isVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

// Response types
export interface AuthResponse {
  user: AuthUserData;
  tokens: TokenPair;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType: 'Bearer';
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}


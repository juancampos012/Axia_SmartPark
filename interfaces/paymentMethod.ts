/**
 * PAYMENT METHOD INTERFACES
 * 
 * Interfaces TypeScript para el módulo de métodos de pago del sistema SmartPark.
 * Alineadas con el backend ASP_backend.
 */

// Enums - Deben coincidir con Prisma schema
export enum SavedPaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD'
}

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  DISCOVER = 'DISCOVER',
  DINERS = 'DINERS',
  OTHER = 'OTHER'
}

// Entidad base de método de pago
export interface PaymentMethodEntity {
  id: string;
  userId: string;
  type: SavedPaymentMethod;
  cardBrand: CardBrand;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: boolean;
  token: string; // Token de la pasarela de pago
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Respuesta del API
export interface PaymentMethodResponse {
  id: string;
  userId: string;
  type: SavedPaymentMethod;
  cardBrand: CardBrand;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // NUNCA incluye token en la respuesta por seguridad
}

// Respuesta con estadísticas
export interface PaymentMethodWithStats extends PaymentMethodResponse {
  usageCount: number;
  lastUsed: string | null;
}

// DTO para crear método de pago (con datos sensibles)
export interface CreatePaymentMethodDTO {
  type: SavedPaymentMethod;
  cardNumber: string; // Será tokenizado en el backend
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string; // Solo se usa para tokenización, nunca se almacena
  setAsDefault?: boolean; // Cambio: isDefault → setAsDefault (coincide con backend)
  billingAddress?: string; // Opcional: dirección de facturación
  nickname?: string; // Opcional: nombre personalizado para la tarjeta
}

// DTO para actualizar método de pago
export interface UpdatePaymentMethodDTO {
  cardholderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

// Datos para tokenizar tarjeta
export interface TokenizeCardData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

// Respuesta de tokenización
export interface TokenizationResponse {
  token: string;
  lastFourDigits: string;
  cardBrand: CardBrand;
  expiryMonth: number;
  expiryYear: number;
}

// Helper para convertir tipo de tarjeta del componente al enum del backend
export const detectCardBrand = (cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'unknown'): CardBrand => {
  switch (cardType) {
    case 'visa':
      return CardBrand.VISA;
    case 'mastercard':
      return CardBrand.MASTERCARD;
    case 'amex':
      return CardBrand.AMEX;
    case 'discover':
      return CardBrand.DISCOVER;
    case 'diners':
      return CardBrand.DINERS;
    default:
      return CardBrand.OTHER;
  }
};

// Helper para convertir enum del backend al tipo del componente
export const cardBrandToComponentType = (brand: CardBrand): 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'unknown' => {
  switch (brand) {
    case CardBrand.VISA:
      return 'visa';
    case CardBrand.MASTERCARD:
      return 'mastercard';
    case CardBrand.AMEX:
      return 'amex';
    case CardBrand.DISCOVER:
      return 'discover';
    case CardBrand.DINERS:
      return 'diners';
    default:
      return 'unknown';
  }
};

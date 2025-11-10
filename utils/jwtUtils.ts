/**
 * Utilidades para manejo de JWT tokens
 */

/**
 * Decodifica un JWT sin verificar la firma (solo para leer el payload)
 * IMPORTANTE: Esto NO valida el token, solo lo decodifica para leer la información
 * 
 * @param token - JWT token a decodificar
 * @returns Payload del token o null si es inválido
 */
export function decodeJWT(token: string): any | null {
  try {
    // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // El payload es la segunda parte, está en base64
    const payload = parts[1];
    
    // Decodificar de base64
    const decoded = atob(payload);
    
    // Parsear como JSON
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Obtiene el tiempo de expiración de un JWT en milisegundos
 * 
 * @param token - JWT token
 * @returns Timestamp de expiración en milisegundos, o null si es inválido
 */
export function getJWTExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }

  // El campo 'exp' viene en segundos, convertir a milisegundos
  return payload.exp * 1000;
}

/**
 * Calcula cuánto tiempo falta para que expire un JWT
 * 
 * @param token - JWT token
 * @returns Tiempo restante en milisegundos, o null si es inválido
 */
export function getTimeUntilExpiration(token: string): number | null {
  const expiration = getJWTExpiration(token);
  if (!expiration) {
    return null;
  }

  const now = Date.now();
  const timeRemaining = expiration - now;

  // Si ya expiró, retornar 0
  return Math.max(0, timeRemaining);
}

/**
 * Verifica si un JWT ha expirado
 * 
 * @param token - JWT token
 * @returns true si expiró, false si aún es válido, null si es inválido
 */
export function isJWTExpired(token: string): boolean | null {
  const timeRemaining = getTimeUntilExpiration(token);
  if (timeRemaining === null) {
    return null;
  }

  return timeRemaining <= 0;
}

/**
 * Calcula cuándo hacer el refresh (2 minutos antes de expirar)
 * 
 * @param token - JWT access token
 * @returns Tiempo en milisegundos hasta que se debe hacer refresh, o null si es inválido
 */
export function getTimeUntilRefresh(token: string): number | null {
  const timeUntilExpiration = getTimeUntilExpiration(token);
  if (timeUntilExpiration === null) {
    return null;
  }

  // Refrescar 2 minutos antes de que expire
  const REFRESH_BUFFER = 2 * 60 * 1000; // 2 minutos en ms
  const timeUntilRefresh = timeUntilExpiration - REFRESH_BUFFER;

  // Si ya pasó el tiempo de refresh, hacerlo inmediatamente
  return Math.max(0, timeUntilRefresh);
}

/**
 * Obtiene información completa sobre un JWT
 * 
 * @param token - JWT token
 * @returns Objeto con información del token
 */
export function getJWTInfo(token: string): {
  isValid: boolean;
  isExpired: boolean;
  expiresAt: Date | null;
  timeRemaining: number | null;
  timeUntilRefresh: number | null;
  payload: any;
} {
  const payload = decodeJWT(token);
  const isValid = payload !== null;
  const expiration = getJWTExpiration(token);
  const timeRemaining = getTimeUntilExpiration(token);
  const timeUntilRefresh = getTimeUntilRefresh(token);
  const isExpired = isJWTExpired(token) === true;

  return {
    isValid,
    isExpired,
    expiresAt: expiration ? new Date(expiration) : null,
    timeRemaining,
    timeUntilRefresh,
    payload,
  };
}

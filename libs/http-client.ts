/**
 * HTTP Client con manejo automático de autenticación y refresh de tokens
 * 
 * Este cliente centraliza todas las llamadas HTTP y maneja:
 * - Inyección automática de tokens de autenticación
 * - Renovación automática de tokens cuando expiran (401)
 * - Manejo consistente de errores
 * - Logout automático cuando el refresh falla
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const API_BASE_URL = ENV_API_BASE_URL || 'https://api.axiasmartpark.lat/api';

/**
 * Opciones de configuración para las peticiones HTTP
 */
export interface HttpClientOptions extends RequestInit {
  requiresAuth?: boolean; // Si requiere autenticación (default: true)
  skipRefreshRetry?: boolean; // Si ya es un reintento después de refresh
}

/**
 * Error personalizado que incluye información adicional del servidor
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Lock para evitar múltiples refreshes simultáneos
 */
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Función interna para hacer logout cuando la sesión es inválida
 */
async function handleInvalidSession() {
  console.log('Sesión inválida, limpiando tokens...');
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
  
  // Notificar a la app que debe redirigir al login
  // Esto se manejará mediante el AuthContext que escucha los cambios en AsyncStorage
}

/**
 * Cliente HTTP principal con manejo automático de tokens
 * 
 * @param endpoint - Ruta del endpoint (ej: '/vehicles/my')
 * @param options - Opciones de la petición HTTP
 * @returns Promise con la respuesta parseada como JSON
 */
export async function httpClient<T = any>(
  endpoint: string,
  options: HttpClientOptions = {}
): Promise<T> {
  const {
    requiresAuth = true,
    skipRefreshRetry = false,
    headers = {},
    ...fetchOptions
  } = options;

  // Construir URL completa
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Preparar headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Agregar token de autenticación si se requiere
  if (requiresAuth) {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      throw new HttpError('No hay sesión activa', 401);
    }
    requestHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  // Hacer la petición
  let response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  // Si recibimos 401 y no hemos intentado refresh aún, intentar renovar el token
  if (response.status === 401 && requiresAuth && !skipRefreshRetry) {
    console.log('Token expirado (401), intentando renovar...');
    
    // Si ya hay un refresh en progreso, esperar a que termine
    if (isRefreshing && refreshPromise) {
      console.log('Esperando refresh en progreso...');
      await refreshPromise;
      
      // Reintentar con el nuevo token
      const newAccessToken = await AsyncStorage.getItem('accessToken');
      if (newAccessToken) {
        requestHeaders['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...fetchOptions,
          headers: requestHeaders,
        });
      }
    } else {
      // Iniciar un nuevo refresh
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const newTokens = await refreshToken();
          console.log('Tokens renovados exitosamente');
        } catch (refreshError) {
          console.error('Error al renovar tokens:', refreshError);
          await handleInvalidSession();
          throw refreshError;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
      
      try {
        await refreshPromise;
        
        // Reintentar con el nuevo token
        const newAccessToken = await AsyncStorage.getItem('accessToken');
        if (newAccessToken) {
          requestHeaders['Authorization'] = `Bearer ${newAccessToken}`;
          response = await fetch(url, {
            ...fetchOptions,
            headers: requestHeaders,
          });
        }
      } catch (refreshError) {
        throw new HttpError('Sesión expirada. Por favor inicia sesión nuevamente.', 401);
      }
    }
  }

  // Si todavía es 401 después del reintento, la sesión es inválida
  if (response.status === 401) {
    await handleInvalidSession();
    throw new HttpError('Sesión expirada. Por favor inicia sesión nuevamente.', 401);
  }

  // Parsear respuesta
  let data: any;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = text ? { message: text } : {};
  }

  // Si la respuesta no es OK, lanzar error con información detallada
  if (!response.ok) {
    const errorMessage = data?.message || `Error ${response.status}`;
    throw new HttpError(errorMessage, response.status, data);
  }

  // Retornar los datos (normalmente en data.data según tu estructura)
  return data;
}

/**
 * Métodos de conveniencia para diferentes tipos de peticiones HTTP
 */

export const http = {
  /**
   * GET request
   */
  get: <T = any>(endpoint: string, options?: Omit<HttpClientOptions, 'method' | 'body'>) =>
    httpClient<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T = any>(endpoint: string, body?: any, options?: Omit<HttpClientOptions, 'method' | 'body'>) =>
    httpClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T = any>(endpoint: string, body?: any, options?: Omit<HttpClientOptions, 'method' | 'body'>) =>
    httpClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T = any>(endpoint: string, body?: any, options?: Omit<HttpClientOptions, 'method' | 'body'>) =>
    httpClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T = any>(endpoint: string, options?: Omit<HttpClientOptions, 'method' | 'body'>) =>
    httpClient<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * POST request con FormData (para uploads)
   */
  postFormData: async <T = any>(
    endpoint: string,
    formData: FormData,
    options?: Omit<HttpClientOptions, 'method' | 'body' | 'headers'>
  ) => {
    const { requiresAuth = true } = options || {};
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const requestHeaders: Record<string, string> = {};

    if (requiresAuth) {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        throw new HttpError('No hay sesión activa', 401);
      }
      requestHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    // NO establecer Content-Type para FormData, el browser lo hace automáticamente
    let response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: formData,
    });

    // Manejo de 401 similar al httpClient principal
    if (response.status === 401 && requiresAuth) {
      try {
        const newTokens = await refreshToken();
        requestHeaders['Authorization'] = `Bearer ${newTokens.accessToken}`;
        
        response = await fetch(url, {
          method: 'POST',
          headers: requestHeaders,
          body: formData,
        });
      } catch (refreshError) {
        await handleInvalidSession();
        throw new HttpError('Sesión expirada. Por favor inicia sesión nuevamente.', 401);
      }
    }

    if (response.status === 401) {
      await handleInvalidSession();
      throw new HttpError('Sesión expirada. Por favor inicia sesión nuevamente.', 401);
    }

    const contentType = response.headers.get('content-type');
    let data: any;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const errorMessage = data?.message || `Error ${response.status}`;
      throw new HttpError(errorMessage, response.status, data);
    }

    return data as T;
  },
};

/**
 * Exportar también la URL base para casos especiales
 */
export { API_BASE_URL };

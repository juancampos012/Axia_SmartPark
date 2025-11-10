import { LoginDTO, RegisterDTO, ForgotPasswordDTO, ResetPasswordDTO, LoginResponse } from "../interfaces/Auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http, HttpError } from './http-client';

// Función auxiliar para guardar tokens
const saveTokens = async (tokens: { accessToken: string; refreshToken: string }) => {
    try {
        await AsyncStorage.setItem('accessToken', tokens.accessToken);
        await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
    } catch (error) {
        console.error('Error guardando tokens:', error);
    }
};

// Función auxiliar para guardar datos del usuario
const saveUserData = async (user: any) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
        console.error('Error guardando datos del usuario:', error);
    }
};

// Login
export const loginAuth = async (body: LoginDTO): Promise<LoginResponse> => {
  try {
    const dataResponse = await http.post('/auth/login', body, { requiresAuth: false });

    if (!dataResponse.data?.tokens?.accessToken || !dataResponse.data?.user) {
      throw new Error("Respuesta inválida del servidor (faltan datos de autenticación)");
    }

    // Mapear assignedParkingId del backend a parkingId del frontend
    if (dataResponse.data.user) {
      const backendUser = dataResponse.data.user as any;
      dataResponse.data.user = {
        ...backendUser,
        parkingId: backendUser.assignedParkingId || backendUser.parkingId || null
      };
      // Eliminar el campo assignedParkingId si existe para evitar confusión
      delete (dataResponse.data.user as any).assignedParkingId;
    }

    return dataResponse;
  } catch (error: any) {
    // Si hay información adicional sobre intentos de login, incluirla en el error
    if (error instanceof HttpError && error.data?.loginAttempts !== undefined) {
      const details = error.data;
      console.log(`Intentos de login: ${details.loginAttempts}/${details.maxAttempts || 'N/A'}`);
      error.message += ` (Intento ${details.loginAttempts}${details.maxAttempts ? `/${details.maxAttempts}` : ''})`;
    }

    throw error;
  }
};


// Register
export const registerAuth = async (body: RegisterDTO): Promise<{ user: any; verificationRequired?: boolean; message: string }> => {
    try {
        const result = await http.post('/auth/register', body, { requiresAuth: false });

        // El backend devuelve: { success, message, data: { user, verificationRequired } }
        // Para registro, normalmente no se devuelven tokens inmediatamente si requiere verificación
        const userData = result.data?.user || result.user;
        const verificationRequired = result.data?.verificationRequired;

        // Solo guardar tokens si están presentes (login automático después del registro)
        if (result.data?.accessToken && result.data?.refreshToken) {
            await saveTokens({
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken
            });
            await saveUserData(userData);
        } else if (userData) {
            // Guardar solo los datos del usuario sin tokens
            await saveUserData(userData);
        }

        return {
            user: userData,
            verificationRequired,
            message: result.message || 'Registro exitoso'
        };
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

// Forgot Password
export const forgotPassword = async (body: ForgotPasswordDTO): Promise<{ message: string }> => {
    try {
        const data = await http.post('/auth/forgot-password', body, { requiresAuth: false });
        return data;
    } catch (error) {
        console.error('Error en forgot password:', error);
        throw error;
    }
};

// Reset Password
export const resetPassword = async (body: ResetPasswordDTO): Promise<{ message: string }> => {
    try {
        const data = await http.post('/auth/reset-password', body, { requiresAuth: false });
        return data;
    } catch (error) {
        console.error('Error en reset password:', error);
        throw error;
    }
};

// Logout
export const logout = async (): Promise<void> => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        // Intentar hacer logout en el servidor (ignorar errores)
        try {
            await http.post('/auth/logout', { refreshToken });
        } catch (error) {
            // Continuar con la limpieza local aunque falle el logout del servidor
        }

        // Limpiar tokens y datos locales
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
    } catch (error) {
        console.error('Error en logout:', error);
        // Limpiar datos locales aunque falle el logout en el servidor
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
    }
};

// Refresh Token
// NOTA: Esta función es usada internamente por http-client, pero también se exporta
// para casos especiales donde se necesite forzar un refresh manualmente
export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const refreshTokenValue = await AsyncStorage.getItem('refreshToken');

        if (!refreshTokenValue) {
            console.error('refreshToken: no value found in AsyncStorage');
            throw new Error('No hay refresh token disponible');
        }

        console.log(`refreshToken - found refresh token length: ${refreshTokenValue.length}`);

        // Usar requiresAuth: false y skipRefreshRetry: true para evitar bucle infinito
        const result = await http.post('/auth/refresh',
            { refreshToken: refreshTokenValue },
            { requiresAuth: false, skipRefreshRetry: true }
        );

        console.log('refreshToken - server result:', result);

        // El backend retorna: { success, message, data: { accessToken, refreshToken } }
        const tokens = {
            accessToken: result.data?.accessToken || result.accessToken,
            refreshToken: result.data?.refreshToken || result.refreshToken
        };

        if (!tokens.accessToken || !tokens.refreshToken) {
            console.error('Tokens inválidos recibidos del refresh:', result);
            throw new Error('No se recibieron tokens válidos del servidor');
        }

        // Actualizar tokens
        await saveTokens(tokens);

        return tokens;
    } catch (error) {
        console.error('Error refrescando token:', error);
        // Si falla el refresh, limpiar tokens
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
        throw error;
    }
};

// Get current user
export const getCurrentUser = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error);
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem('accessToken') || await AsyncStorage.getItem('refreshToken');
        return !!token;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
};

// Get access token
export const getAccessToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        console.error('Error obteniendo access token:', error);
        return null;
    }
};
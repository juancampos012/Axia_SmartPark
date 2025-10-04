import { LoginDTO, RegisterDTO, ForgotPasswordDTO, ResetPasswordDTO, LoginResponse } from "../interfaces/Auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';

// Función auxiliar para manejar respuestas
const handleResponse = async (response: Response) => {
    let data;
    
    try {
        const responseText = await response.text();
        console.log("Raw response text:", responseText);
        
        // Intentar parsear como JSON
        data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error(`Error del servidor: respuesta inválida (${response.status})`);
    }
    
    console.log("Parsed response data:", data);
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
        // Handle specific HTTP status codes
        let errorMessage = data.message || 'Error en la solicitud';
        let errorDetails = data;
        
        switch (response.status) {
            case 400:
                errorMessage = data.message || 'Datos de entrada inválidos';
                break;
            case 401:
                // Para errores de autenticación, preservar información adicional como loginAttempts
                errorMessage = data.message || 'Credenciales incorrectas';
                if (data.loginAttempts !== undefined) {
                    errorDetails.loginAttempts = data.loginAttempts;
                }
                if (data.maxAttempts !== undefined) {
                    errorDetails.maxAttempts = data.maxAttempts;
                }
                if (data.lockTime !== undefined) {
                    errorDetails.lockTime = data.lockTime;
                }
                if (data.remainingAttempts !== undefined) {
                    errorDetails.remainingAttempts = data.remainingAttempts;
                }
                break;
            case 409:
                // Conflict - usually means duplicate email or phone
                if (data.message?.toLowerCase().includes('email')) {
                    errorMessage = 'Este email ya está registrado';
                } else if (data.message?.toLowerCase().includes('phone')) {
                    errorMessage = 'Este teléfono ya está registrado';
                } else {
                    errorMessage = data.message || 'Los datos ya existen en el sistema';
                }
                break;
            case 422:
                // Validation error
                if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.join(', ');
                } else {
                    errorMessage = data.message || 'Error de validación';
                }
                break;
            case 429:
                errorMessage = data.message || 'Demasiados intentos. Intenta de nuevo más tarde';
                if (data.retryAfter) {
                    errorDetails.retryAfter = data.retryAfter;
                }
                break;
            case 500:
                errorMessage = 'Error interno del servidor. Intenta de nuevo más tarde';
                break;
            default:
                errorMessage = data.message || `Error: ${response.status}`;
        }
        
        const error = new Error(errorMessage);
        // Adjuntar información adicional al error
        (error as any).details = errorDetails;
        (error as any).status = response.status;
        (error as any).rawData = data;
        throw error;
    }
    
    return data;
};

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
    console.log("Enviando petición de login a:", `${API_BASE_URL}/auth/login`);
    console.log("Datos enviados:", { email: body.email, password: "***" });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("Respuesta del servidor - Status:", response.status);
    console.log("Respuesta del servidor - Headers:", Object.fromEntries(response.headers.entries()));

    const dataResponse = await handleResponse(response);
    console.log("Respuesta del backend:", dataResponse);
    console.log("User data:", dataResponse.data?.user);

    if (!dataResponse.data?.tokens?.accessToken || !dataResponse.data?.user) {
      throw new Error("Respuesta inválida del servidor (faltan datos de autenticación)");
    }

    // Guardar tokens y datos del usuario
    await saveTokens({
      accessToken: dataResponse.data.tokens.accessToken,
      refreshToken: dataResponse.data.tokens.refreshToken || "",
    });

    await saveUserData(dataResponse.data.user);

    const storedTokens = await AsyncStorage.getItem("accessToken");
    console.log("Token guardado en AsyncStorage:", storedTokens);

    return dataResponse;
  } catch (error: any) {
    console.error("Error en login:", error);
    console.error("Error details:", error.details);
    console.error("Error status:", error.status);
    
    // Si hay información adicional sobre intentos de login, incluirla en el error
    if (error.details?.loginAttempts !== undefined) {
      console.log(`Intentos de login: ${error.details.loginAttempts}/${error.details.maxAttempts || 'N/A'}`);
      error.message += ` (Intento ${error.details.loginAttempts}${error.details.maxAttempts ? `/${error.details.maxAttempts}` : ''})`;
    }
    
    throw error;
  }
};


// Register
export const registerAuth = async (body: RegisterDTO): Promise<{ user: any; verificationRequired?: boolean; message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const result = await handleResponse(response);
        
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
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        console.error('Error en forgot password:', error);
        throw error;
    }
};

// Reset Password
export const resetPassword = async (body: ResetPasswordDTO): Promise<{ message: string }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        console.error('Error en reset password:', error);
        throw error;
    }
};

// Logout
export const logout = async (): Promise<void> => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });
        }
        
        // Limpiar tokens y datos locales
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
        const storedTokens = await AsyncStorage.getItem("accessToken");
        console.log("Token eliminado en AsyncStorage:", storedTokens);
    } catch (error) {
        console.error('Error en logout:', error);
        // Limpiar datos locales aunque falle el logout en el servidor
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
    }
};

// Refresh Token
export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const refreshTokenValue = await AsyncStorage.getItem('refreshToken');
        
        if (!refreshTokenValue) {
            throw new Error('No hay refresh token disponible');
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: refreshTokenValue })
        });
        
        const data = await handleResponse(response);
        
        // Actualizar tokens
        await saveTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        });
        
        return data;
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
import { UserUpdateDTO, Role, UserCreateDTO } from "../interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL as ENV_API_BASE_URL } from "@env";

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';

// Función auxiliar para guardar datos del usuario
const saveUserData = async (user: any) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
        console.error('Error guardando datos del usuario:', error);
    }
};

// Función auxiliar para obtener datos del usuario
const getUserData = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
        return null;
    }
};

// Función auxiliar para eliminar datos del usuario
const removeUserData = async () => {
    try {
        await AsyncStorage.removeItem('userData');
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('Error eliminando datos del usuario:', error);
    }
};

// Manejo de respuestas del backend
const handleResponse = async (response: Response) => {
    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
    } else {
        responseData = { 
            success: false, 
            message: "Respuesta no válida del servidor",
            timestamp: new Date().toISOString()
        };
    }

    // El backend siempre devuelve { success, message, data?, error?, timestamp }
    if (!response.ok) {
        const errorMessage = responseData.message || responseData.error || "Error en la solicitud";
        throw new Error(errorMessage);
    }

    // Si la respuesta es exitosa pero success es false
    if (!responseData.success) {
        const errorMessage = responseData.message || responseData.error || "Operación no exitosa";
        throw new Error(errorMessage);
    }

    return responseData;
};
// Obtener perfil del usuario
export const fetchUserProfile = async (): Promise<any> => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error("No autenticado");

        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const responseData = await handleResponse(response);
        
        // Guardar los datos del usuario actualizados
        if (responseData.success && responseData.data) {
            await saveUserData(responseData.data);
        }

        return responseData.data; // Retornar solo los datos del usuario
    } catch (error) {
        console.error("Error en fetchUserProfile:", error);
        throw error;
    }
};


// Actualizar perfil del usuario
export const updateUserProfile = async (data: UserUpdateDTO): Promise<any> => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error("No autenticado");

        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await handleResponse(response);
        
        // Guardar los datos actualizados del usuario
        if (responseData.success && responseData.data) {
            await saveUserData(responseData.data);
        }

        return responseData.data; // Retornar solo los datos actualizados
    } catch (error) {
        console.error("Error en updateUserProfile:", error);
        throw error;
    }
};

// Eliminar usuario
export const deleteUserAccount = async (): Promise<any> => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error("No autenticado");

        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const responseData = await handleResponse(response);
        
        // Limpiar todos los datos locales después de eliminar la cuenta
        if (responseData.success) {
            await removeUserData();
        }

        return responseData.message || "Cuenta eliminada exitosamente";
    } catch (error) {
        console.error("Error en deleteUserAccount:", error);
        throw error;
    }
};

// Cambiar contraseña
export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error("No autenticado");

        const response = await fetch(`${API_BASE_URL}/users/change-password`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        const responseData = await handleResponse(response);
        return responseData.message || "Contraseña cambiada exitosamente";
    } catch (error) {
        console.error("Error en changePassword:", error);
        throw error;
    }
};

// Obtener estadísticas del usuario (si está disponible)
export const getUserStats = async (): Promise<any> => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error("No autenticado");
        
        const userData = await getUserData();
        if (!userData?.id) throw new Error("ID de usuario no disponible");

        const response = await fetch(`${API_BASE_URL}/users/${userData.id}/stats`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const responseData = await handleResponse(response);
        return responseData.data;
    } catch (error) {
        console.error("Error en getUserStats:", error);
        throw error;
    }
};

// Funciones auxiliares exportadas
export { getUserData, saveUserData, removeUserData };


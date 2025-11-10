import { UserUpdateDTO } from "../interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { http, HttpError } from "./http-client";

/**
 * Funciones auxiliares para manejo de datos de usuario en AsyncStorage
 */

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

/**
 * Mapear campos del backend al formato del frontend
 */
const mapUserData = (userData: any) => {
    return {
        ...userData,
        parkingId: userData.assignedParkingId || userData.parkingId || null,
        avatar: userData.profilePicture || userData.avatar || null
    };
};

/**
 * Obtener perfil del usuario
 */
export const fetchUserProfile = async (): Promise<any> => {
    try {
        const response = await http.get('/users/profile');
        
        // Mapear assignedParkingId del backend a parkingId del frontend
        if (response.success && response.data) {
            const mappedUserData = mapUserData(response.data);
            
            // Guardar los datos del usuario actualizados
            await saveUserData(mappedUserData);
            return mappedUserData;
        }

        return response.data;
    } catch (error) {
        console.error("Error en fetchUserProfile:", error);
        throw error;
    }
};

/**
 * Actualizar perfil del usuario
 */
export const updateUserProfile = async (data: UserUpdateDTO): Promise<any> => {
    try {
        const response = await http.put('/users/profile', data);
        
        // Mapear campos del backend al frontend
        if (response.success && response.data) {
            const mappedUserData = mapUserData(response.data);
            
            // Guardar los datos actualizados del usuario
            await saveUserData(mappedUserData);
            return mappedUserData;
        }

        return response.data;
    } catch (error) {
        console.error("Error en updateUserProfile:", error);
        throw error;
    }
};

/**
 * Eliminar cuenta de usuario
 */
export const deleteUserAccount = async (): Promise<any> => {
    try {
        const response = await http.delete('/users/profile');
        
        // Limpiar todos los datos locales después de eliminar la cuenta
        if (response.success) {
            await removeUserData();
        }

        return response.message || "Cuenta eliminada exitosamente";
    } catch (error) {
        console.error("Error en deleteUserAccount:", error);
        throw error;
    }
};

/**
 * Cambiar contraseña
 */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => {
    try {
        const response = await http.patch('/users/change-password', {
            currentPassword,
            newPassword
        });
        
        return response.message || "Contraseña cambiada exitosamente";
    } catch (error) {
        console.error("Error en changePassword:", error);
        throw error;
    }
};

/**
 * Obtener estadísticas del usuario
 */
export const getUserStats = async (): Promise<any> => {
    try {
        const userData = await getUserData();
        if (!userData?.id) throw new Error("ID de usuario no disponible");

        const response = await http.get(`/users/${userData.id}/stats`);
        return response.data;
    } catch (error) {
        console.error("Error en getUserStats:", error);
        throw error;
    }
};

/**
 * Refrescar los datos del perfil del usuario
 */
export const refreshProfileData = async (): Promise<any> => {
    try {
        const updatedProfile = await fetchUserProfile();
        if (updatedProfile) {
            await saveUserData(updatedProfile);
        }
        return updatedProfile;
    } catch (error) {
        console.error("Error al refrescar los datos del perfil:", error);
        throw error;
    }
};

// Funciones auxiliares exportadas
export { getUserData, saveUserData, removeUserData };

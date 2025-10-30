import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken } from './auth';
// import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
import {
  AdminUsersResponse,
  AdminUserResponse,
  AdminUserDetail,
  CreateUserDTO,
  UpdateUserDTO,
  AdminParkingResponse,
  AdminParkingInfo,
  UpdateParkingDTO,
} from "../interfaces/Admin";

// const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';
const API_BASE_URL = "https://api.axiasmartpark.lat/api";

// Wrapper para requests autenticados
async function authenticatedRequest(endpoint: string, options: RequestInit = {}) {
  let accessToken = await AsyncStorage.getItem('accessToken');
  const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
  
  if (!accessToken || !storedRefreshToken) {
    throw new Error('No authentication tokens found');
  }

  const makeRequest = async (token: string) => {
    // Do not log token contents for security; log its length for debugging
    try {
      console.log(`authenticatedRequest - making request to ${endpoint} with accessToken length: ${token?.length || 0}`);
    } catch {}

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    return response;
  };

  // Primer intento
  let response = await makeRequest(accessToken);

  // Si token expiró, hacer refresh
  if (response.status === 401) {
    console.warn(`authenticatedRequest - received 401 for ${endpoint}`);
    try {
      // Log existence/length of stored refresh token before attempting refresh
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      console.log(`authenticatedRequest - stored refreshToken length: ${storedRefreshToken ? storedRefreshToken.length : 0}`);

      console.log('Token expired, refreshing...');
      const newTokens = await refreshToken();
      accessToken = newTokens.accessToken;
      
      // Reintentar con nuevo token
      response = await makeRequest(accessToken);
      console.log(`authenticatedRequest - retry after refresh status: ${response.status}`);
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    // Try to parse body for better error messages and log it for debugging
    let errorText = '';
    try {
      errorText = await response.text();
    } catch (e) {
      console.error('authenticatedRequest - error reading response text', e);
    }

    let errorMessage = `Error ${response.status}`;
    try {
      const errorJson = errorText ? JSON.parse(errorText) : null;
      console.log('authenticatedRequest - response error body:', errorJson ?? errorText);
      errorMessage = (errorJson && (errorJson.message || errorJson.error)) || errorMessage;
    } catch (parseErr) {
      console.log('authenticatedRequest - non-json error body:', errorText);
      errorMessage = errorText || errorMessage;
    }

    // Proporcionar mensajes más claros para errores comunes
    if (response.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta acción. Necesitas rol de ADMIN.';
    } else if (response.status === 401) {
      errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    }

    console.error(`authenticatedRequest - throwing error for ${endpoint}:`, errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * USER MANAGEMENT FUNCTIONS
 */

// Fetch all users (admin only)
export async function fetchUsers(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<AdminUsersResponse> {
  try {
    let url = `/users?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    console.log('fetch users')
    const response = await authenticatedRequest(url);
    console.log(response)

    // Normalize backend response: some endpoints return data.users, others data.items
    const usersArray: any[] = response?.data?.users ?? response?.data?.items ?? [];

    console.log("Users fetched:", { page, limit, search, usersCount: Array.isArray(usersArray) ? usersArray.length : 0 });

    // Mapear assignedParkingId del backend a parkingId del frontend para cada usuario
    if (response.success && Array.isArray(usersArray)) {
      if (usersArray.length > 0) {
        console.log("Mapping assignedParkingId to parkingId for users");
      }

      const mapped = usersArray.map((user: any) => ({
        ...user,
        parkingId: user.assignedParkingId || user.parkingId || null
      }));

      // Eliminar el campo assignedParkingId de cada usuario en el mapeo
      mapped.forEach((user: any) => {
        if ('assignedParkingId' in user) delete user.assignedParkingId;
      });

      // Normalize response.data.users to always contain the users list for callers
      response.data = response.data || {};
      response.data.users = mapped;

      console.log("Mapped users with parkingId:", mapped.map((u: any) => ({ 
        id: u.id, 
        email: u.email, 
        role: u.role, 
        parkingId: u.parkingId 
      })));
    } else {
      // Ensure callers always have data.users (empty array if none)
      response.data = response.data || {};
      response.data.users = Array.isArray(usersArray) ? usersArray : [];
    }

    return response;
  } catch (error: any) {
    console.error("fetchUsers - Error:", error.message || error);
    throw error;
  }
}

// Fetch user by ID
export async function fetchUserById(userId: string): Promise<AdminUserDetail> {
  try {
    const response: AdminUserResponse = await authenticatedRequest(`/users/${userId}`);
    console.log("User fetched:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

// Create new user
export async function createUser(userData: CreateUserDTO): Promise<AdminUserDetail> {
  try {
    console.log('create user')
    const response: AdminUserResponse = await authenticatedRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    console.log("User created:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user
export async function updateUser(
  userId: string,
  userData: UpdateUserDTO
): Promise<AdminUserDetail> {
  try {
    const response: AdminUserResponse = await authenticatedRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    console.log("User updated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
}

// Delete user
export async function deleteUser(userId: string): Promise<void> {
  try {
    await authenticatedRequest(`/users/${userId}`, {
      method: "DELETE",
    });
    console.log(`User ${userId} deleted`);
  } catch (error: any) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
}

/**
 * PARKING MANAGEMENT FUNCTIONS
 */

// Fetch admin's parking
export async function fetchMyParking(): Promise<AdminParkingInfo> {
  try {
    const response: AdminParkingResponse = await authenticatedRequest("/parking/user/my-parkings");
    
    // La respuesta puede ser un array, tomamos el primero
    const parkings = Array.isArray(response.data) ? response.data : [response.data];
    
    if (parkings.length === 0) {
      throw new Error("No parking assigned to this admin");
    }
    
    return parkings[0];
  } catch (error: any) {
    console.error("Error fetching my parking:", error);
    throw error;
  }
}

// Fetch parking by ID
export async function fetchParkingByIdAdmin(parkingId: string): Promise<AdminParkingInfo> {
  try {
    const response: AdminParkingResponse = await authenticatedRequest(`/parking/${parkingId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching parking ${parkingId}:`, error);
    throw error;
  }
}

// Update parking
export async function updateParking(
  parkingId: string,
  parkingData: UpdateParkingDTO
): Promise<AdminParkingInfo> {
  try {
    const response: AdminParkingResponse = await authenticatedRequest(`/parking/${parkingId}`, {
      method: "PUT",
      body: JSON.stringify(parkingData),
    });
    console.log("Parking updated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating parking ${parkingId}:`, error);
    throw error;
  }
}

// Update parking rates
export async function updateParkingRates(
  parkingId: string,
  rates: {
    hourlyCarRate?: number;
    hourlyMotorcycleRate?: number;
    dailyRate?: number;
    monthlyRate?: number;
  }
): Promise<AdminParkingInfo> {
  try {
    const response: AdminParkingResponse = await authenticatedRequest(
      `/parking/${parkingId}/rates`,
      {
        method: "PUT",
        body: JSON.stringify(rates),
      }
    );
    console.log("Parking rates updated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating parking rates ${parkingId}:`, error);
    throw error;
  }
}

// Change parking status
export async function changeParkingStatus(
  parkingId: string,
  status: 'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE'
): Promise<AdminParkingInfo> {
  try {
    const response: AdminParkingResponse = await authenticatedRequest(
      `/parking/${parkingId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    console.log("Parking status changed:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error changing parking status ${parkingId}:`, error);
    throw error;
  }
}

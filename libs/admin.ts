import { http } from './http-client';
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

    console.log('fetch users');
    const response = await http.get(url);
    console.log(response);

    // Normalize backend response: some endpoints return data.users, others data.items
    const usersArray: any[] = response.data?.users ?? response.data?.items ?? [];

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
    const response = await http.get(`/users/${userId}`);
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
    console.log('create user');
    const response = await http.post("/users/register", userData);
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
    const response = await http.put(`/users/${userId}`, userData);
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
    await http.delete(`/users/${userId}`);
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
    const response = await http.get("/parking/user/my-parkings");
    
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
    const response = await http.get(`/parking/${parkingId}`);
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
    const response = await http.put(`/parking/${parkingId}`, parkingData);
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
    const response = await http.put(`/parking/${parkingId}/rates`, rates);
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
    const response = await http.patch(`/parking/${parkingId}/status`, { status });
    console.log("Parking status changed:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error changing parking status ${parkingId}:`, error);
    throw error;
  }
}

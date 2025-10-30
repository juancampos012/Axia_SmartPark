import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
import type {
  Review,
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewsResponse,
  ReviewStatsResponse,
} from '../interfaces/review';

const API_BASE_URL = ENV_API_BASE_URL || 'http://localhost:3001/api';

// Constantes de rutas centralizadas
const REVIEWS_BASE_PATH = '/parking-reviews';

// Helper para requests autenticados
async function authenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  let accessToken = await AsyncStorage.getItem('accessToken');
  const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

  if (!accessToken || !storedRefreshToken) {
    throw new Error('No authentication tokens found');
  }

  const makeRequest = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    return response;
  };

  let response = await makeRequest(accessToken);

  // Refresh token si está expirado
  if (response.status === 401) {
    try {
      const { refreshToken: refreshTokenFn } = await import('./auth');
      const newTokens = await refreshTokenFn();
      accessToken = newTokens.accessToken;
      response = await makeRequest(accessToken);
    } catch (refreshError) {
      await AsyncStorage.multiRemove([
        'accessToken',
        'refreshToken',
        'userData',
      ]);
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Error ${response.status}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }

    throw new Error(errorMessage);
  }

  return response;
}

/**
 * GET - Obtener reseñas de un parqueadero
 */
export async function fetchParkingReviews(
  parkingId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResponse> {
  try {
    const response = await authenticatedRequest(
      `${REVIEWS_BASE_PATH}/parking/${parkingId}?page=${page}&limit=${limit}`
    );
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error fetching reviews');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching parking reviews:', error);
    throw error;
  }
}

/**
 * GET - Obtener mis reseñas
 */
export async function fetchMyReviews(
  page: number = 1,
  limit: number = 20
): Promise<ReviewsResponse> {
  try {
    const response = await authenticatedRequest(
      `${REVIEWS_BASE_PATH}/my?page=${page}&limit=${limit}`
    );
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error fetching your reviews');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
}

/**
 * GET - Obtener una reseña por ID
 */
export async function fetchReviewById(reviewId: string): Promise<Review> {
  try {
    const response = await authenticatedRequest(`${REVIEWS_BASE_PATH}/${reviewId}`);
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Review not found');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching review:', error);
    throw error;
  }
}

/**
 * POST - Crear una reseña
 */
export async function createReview(data: CreateReviewDTO): Promise<Review> {
  try {
    // Validaciones
    if (!data.parkingId) {
      throw new Error('Parking ID is required');
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (data.comment && data.comment.length > 1000) {
      throw new Error('Comment cannot exceed 1000 characters');
    }

    const response = await authenticatedRequest(REVIEWS_BASE_PATH, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error creating review');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

/**
 * PUT - Actualizar una reseña
 */
export async function updateReview(
  reviewId: string,
  data: UpdateReviewDTO
): Promise<Review> {
  try {
    // Validaciones
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (data.comment && data.comment.length > 1000) {
      throw new Error('Comment cannot exceed 1000 characters');
    }

    const response = await authenticatedRequest(`${REVIEWS_BASE_PATH}/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error updating review');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

/**
 * DELETE - Eliminar una reseña
 */
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const response = await authenticatedRequest(`${REVIEWS_BASE_PATH}/${reviewId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Error deleting review');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

/**
 * GET - Obtener estadísticas de reseñas de un parqueadero
 */
export async function fetchReviewStats(
  parkingId: string
): Promise<ReviewStatsResponse> {
  try {
    const response = await authenticatedRequest(
      `${REVIEWS_BASE_PATH}/stats/parking/${parkingId}`
    );
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Error fetching review stats');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
}

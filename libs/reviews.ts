import { http } from './http-client';
import type {
  Review,
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewsResponse,
  ReviewStatsResponse,
} from '../interfaces/review';

// Constantes de rutas centralizadas
const REVIEWS_BASE_PATH = '/parking-reviews';

/**
 * GET - Obtener reseñas de un parqueadero
 */
export async function fetchParkingReviews(
  parkingId: string,
  page: number = 1,
  limit: number = 10
): Promise<ReviewsResponse> {
  try {
    const result = await http.get(`${REVIEWS_BASE_PATH}/parking/${parkingId}?page=${page}&limit=${limit}`);
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
    const result = await http.get(`${REVIEWS_BASE_PATH}/my?page=${page}&limit=${limit}`);
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
    const result = await http.get(`${REVIEWS_BASE_PATH}/${reviewId}`);
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

    const result = await http.post(REVIEWS_BASE_PATH, data);
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

    const result = await http.put(`${REVIEWS_BASE_PATH}/${reviewId}`, data);
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
    await http.delete(`${REVIEWS_BASE_PATH}/${reviewId}`);
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
    const result = await http.get(`${REVIEWS_BASE_PATH}/stats/parking/${parkingId}`);
    return result.data;
  } catch (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }
}

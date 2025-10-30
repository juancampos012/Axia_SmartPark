export interface Review {
  id: string;
  userId: string;
  parkingId: string;
  rating: number; // 1-5
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  parking?: {
    id: string;
    name: string;
    address: string;
    city?: string;
  };
}

export interface CreateReviewDTO {
  parkingId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  pages: number;
}

export interface ReviewStatsResponse {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews?: Review[];
}

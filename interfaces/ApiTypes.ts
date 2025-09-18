// Base API Response structure - Used across all endpoints
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Success response wrapper
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
}

// Error response wrapper
export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  error: string;
  data?: null;
}

// Paginated response for list endpoints
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Paginated API response
export interface PaginatedApiResponse<T> extends ApiResponse<PaginatedResponse<T>> {
  success: true;
  data: PaginatedResponse<T>;
}

// Query parameters for pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search query parameters
export interface SearchQuery extends PaginationQuery {
  search?: string;
  filters?: Record<string, string | number | boolean | Date>;
}

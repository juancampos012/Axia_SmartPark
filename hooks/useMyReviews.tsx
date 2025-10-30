import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  fetchMyReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../libs/reviews';
import type { Review, CreateReviewDTO, UpdateReviewDTO } from '../interfaces/review';

export const useMyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadReviews = useCallback(
    async (pageNum: number = 1, isRefreshing: boolean = false) => {
      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const data = await fetchMyReviews(pageNum, 20);

        if (pageNum === 1) {
          setReviews(data.reviews);
        } else {
          setReviews((prev) => [...prev, ...data.reviews]);
        }

        setPage(pageNum);
        setTotal(data.total);
        setHasMore(pageNum < data.pages);
      } catch (err: any) {
        const errorMessage = err.message || 'Error loading reviews';
        setError(errorMessage);
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  const handleCreateReview = useCallback(
    async (data: CreateReviewDTO) => {
      try {
        setLoading(true);
        const newReview = await createReview(data);
        setReviews((prev) => [newReview, ...prev]);
        setTotal((prev) => prev + 1);
        Alert.alert('Success', 'Review created successfully');
        return newReview;
      } catch (err: any) {
        const errorMessage = err.message || 'Error creating review';
        Alert.alert('Error', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleUpdateReview = useCallback(
    async (reviewId: string, data: UpdateReviewDTO) => {
      try {
        setLoading(true);
        const updatedReview = await updateReview(reviewId, data);
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? updatedReview : r))
        );
        Alert.alert('Success', 'Review updated successfully');
        return updatedReview;
      } catch (err: any) {
        const errorMessage = err.message || 'Error updating review';
        Alert.alert('Error', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      try {
        await deleteReview(reviewId);
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setTotal((prev) => Math.max(0, prev - 1));
        Alert.alert('Success', 'Review deleted successfully');
      } catch (err: any) {
        const errorMessage = err.message || 'Error deleting review';
        Alert.alert('Error', errorMessage);
        throw err;
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadReviews(page + 1);
    }
  }, [loading, hasMore, page, loadReviews]);

  const refresh = useCallback(() => {
    loadReviews(1, true);
  }, [loadReviews]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    refreshing,
    error,
    page,
    hasMore,
    total,
    loadMore,
    refresh,
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
  };
};

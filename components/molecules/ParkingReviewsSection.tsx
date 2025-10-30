import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchParkingReviews, createReview } from '../../libs/reviews';
import { ReviewCard } from './ReviewCard';
import { CreateReviewModal } from './CreateReviewModal';
import type { Review, CreateReviewDTO } from '../../interfaces/review';

interface ParkingReviewsSectionProps {
  parkingId: string;
  parkingName: string;
}

export const ParkingReviewsSection: React.FC<ParkingReviewsSectionProps> = ({
  parkingId,
  parkingName,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [parkingId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchParkingReviews(parkingId, 1, 3); // Load first 3 reviews
      setReviews(data.reviews);
      setTotalReviews(data.total);

      // Calculate average rating
      if (data.reviews.length > 0) {
        const sum = data.reviews.reduce((acc, r) => acc + r.rating, 0);
        setAverageRating(sum / data.reviews.length);
      }
    } catch (error: any) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (data: CreateReviewDTO) => {
    try {
      const newReview = await createReview(data);
      setReviews((prev) => [newReview, ...prev]);
      setTotalReviews((prev) => prev + 1);
      
      // Recalculate average
      const allReviews = [newReview, ...reviews];
      const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
      setAverageRating(sum / allReviews.length);
      
      Alert.alert('Success', 'Thank you for your review!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
      throw error;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={20} color="#FFC107" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={20} color="#FFC107" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={20} color="#6B7280" />
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <View className="bg-axia-darkGray rounded-2xl p-6 mb-6">
        <Text className="text-white text-xl font-primaryBold mb-4">
          Reviews
        </Text>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <View className="bg-axia-darkGray rounded-2xl p-6 mb-6">
      {/* Header with Average Rating */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center flex-1">
          <Text className="text-white text-xl font-primaryBold mr-3">Reviews</Text>
          {averageRating !== null && totalReviews > 0 && (
            <View className="flex-row items-center bg-axia-green/10 px-3 py-1.5 rounded-full">
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text className="text-white text-base font-primaryBold ml-1.5">
                {averageRating.toFixed(1)}
              </Text>
              <Text className="text-axia-gray text-xs font-primary ml-1.5">
                ({totalReviews})
              </Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={() => setShowCreateModal(true)}
          className="bg-axia-green/20 px-3 py-2 rounded-full flex-row items-center active:scale-95"
        >
          <Ionicons name="add" size={16} color="#10B981" />
          <Text className="text-axia-green text-sm font-primaryBold ml-1">
            Write
          </Text>
        </Pressable>
      </View>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <View className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showActions={false}
            />
          ))}
          
          {totalReviews > 5 && (
            <Pressable className="bg-axia-green/10 px-4 py-3 rounded-xl active:scale-95">
              <Text className="text-axia-green text-center font-primaryBold">
                View All {totalReviews} Reviews
              </Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View className="items-center py-8">
          <Ionicons name="chatbubble-outline" size={48} color="#6B7280" />
          <Text className="text-white text-base font-primaryBold mt-3 text-center">
            No Reviews Yet
          </Text>
          <Text className="text-axia-gray text-sm font-primary text-center mt-1">
            Be the first to review this parking
          </Text>
        </View>
      )}

      {/* Create Review Modal */}
      <CreateReviewModal
        visible={showCreateModal}
        parkingId={parkingId}
        parkingName={parkingName}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateReview}
      />
    </View>
  );
};

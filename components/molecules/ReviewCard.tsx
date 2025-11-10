import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Review } from '../../interfaces/review';

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  showActions?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? '#FFC107' : '#6B7280'}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View className="bg-axia-darkGray rounded-2xl p-4 mb-3 shadow-lg shadow-black/30">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          {review.parking && (
            <Text className="text-white text-base font-primaryBold mb-1">
              {review.parking.name}
            </Text>
          )}
          {review.parking?.address && (
            <Text className="text-axia-gray text-xs font-primary">
              {review.parking.address}
            </Text>
          )}
        </View>

        {showActions && (
          <View className="flex-row gap-2">
            {onEdit && (
              <Pressable
                onPress={() => onEdit(review)}
                className="p-2 bg-axia-green/20 rounded-lg active:scale-95"
              >
                <Ionicons name="create-outline" size={18} color="#10B981" />
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={() => onDelete(review.id)}
                className="p-2 bg-red-500/20 rounded-lg active:scale-95"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Rating */}
      <View className="flex-row items-center gap-2 mb-3">
        <View className="flex-row">{renderStars(review.rating)}</View>
        <Text className="text-axia-gray text-sm font-primary">
          {review.rating.toFixed(1)}
        </Text>
        <Text className="text-axia-gray text-xs font-primary">
          • {formatDate(review.createdAt)}
        </Text>
      </View>

      {/* Comment */}
      {review.comment && (
        <Text className="text-white/90 text-sm font-primary leading-5">
          {review.comment}
        </Text>
      )}

      {/* Updated indicator */}
      {review.updatedAt !== review.createdAt && (
        <Text className="text-axia-gray text-xs font-primary mt-2 italic">
          Editado {formatDate(review.updatedAt)}
        </Text>
      )}
    </View>
  );
};

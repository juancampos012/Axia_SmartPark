import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Review, UpdateReviewDTO } from '../../interfaces/review';

interface EditReviewModalProps {
  visible: boolean;
  review: Review | null;
  onClose: () => void;
  onSave: (reviewId: string, data: UpdateReviewDTO) => Promise<void>;
}

export const EditReviewModal: React.FC<EditReviewModalProps> = ({
  visible,
  review,
  onClose,
  onSave,
}) => {
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment || '');
    }
  }, [review]);

  const handleSave = async () => {
    if (!review) return;

    if (rating < 1 || rating > 5) {
      Alert.alert('Error', 'Rating must be between 1 and 5');
      return;
    }

    if (comment.length > 500) {
      Alert.alert('Error', 'Comment cannot exceed 500 characters');
      return;
    }

    try {
      setSaving(true);
      await onSave(review.id, {
        rating,
        comment: comment.trim() || undefined,
      });
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable
          key={i}
          onPress={() => setRating(i)}
          className="p-2 active:scale-95"
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i <= rating ? '#FFC107' : '#6B7280'}
          />
        </Pressable>
      );
    }
    return stars;
  };

  if (!review) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 bg-black/70 justify-center items-center p-6"
          onPress={onClose}
        >
          <Pressable
            className="bg-axia-darkGray rounded-3xl p-6 w-full max-w-md"
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white text-2xl font-primaryBold">
                  Edit Review
                </Text>
                <Pressable
                  onPress={onClose}
                  className="p-2 bg-axia-gray/20 rounded-full active:scale-95"
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              {/* Parking Name */}
              {review.parking && (
                <View className="mb-6">
                  <Text className="text-axia-gray text-sm font-primary mb-1">
                    Parking
                  </Text>
                  <Text className="text-white text-base font-primaryBold">
                    {review.parking.name}
                  </Text>
                </View>
              )}

              {/* Rating */}
              <View className="mb-6">
                <Text className="text-white text-sm font-primaryBold mb-3">
                  Rating
                </Text>
                <View className="flex-row justify-center gap-1">
                  {renderStars()}
                </View>
                <Text className="text-center text-axia-gray text-sm mt-2">
                  {rating} / 5 stars
                </Text>
              </View>

              {/* Comment */}
              <View className="mb-6">
                <Text className="text-white text-sm font-primaryBold mb-2">
                  Comment (Optional)
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Share your experience..."
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  className="bg-axia-black/30 text-white px-4 py-3 rounded-xl border border-axia-gray/20 font-primary min-h-[100px]"
                  textAlignVertical="top"
                />
                <Text className="text-axia-gray text-xs mt-1 text-right">
                  {comment.length} / 500
                </Text>
              </View>

              {/* Actions */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={onClose}
                  disabled={saving}
                  className="flex-1 bg-axia-gray/20 px-6 py-4 rounded-xl active:scale-95"
                >
                  <Text className="text-white text-center font-primaryBold">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  disabled={saving}
                  className="flex-1 bg-axia-green px-6 py-4 rounded-xl active:scale-95 shadow-lg shadow-axia-green/25"
                >
                  <Text className="text-white text-center font-primaryBold">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

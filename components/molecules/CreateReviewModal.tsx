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
import type { CreateReviewDTO } from '../../interfaces/review';

interface CreateReviewModalProps {
  visible: boolean;
  parkingId: string;
  parkingName: string;
  onClose: () => void;
  onCreate: (data: CreateReviewDTO) => Promise<void>;
}

export const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  visible,
  parkingId,
  parkingName,
  onClose,
  onCreate,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (rating < 1 || rating > 5) {
      Alert.alert('Error', 'Rating must be between 1 and 5');
      return;
    }

    if (comment.trim().length === 0) {
      Alert.alert('Error', 'Please add a comment about your experience');
      return;
    }

    if (comment.length > 500) {
      Alert.alert('Error', 'Comment cannot exceed 500 characters');
      return;
    }

    try {
      setCreating(true);
      await onCreate({
        parkingId,
        rating,
        comment: comment.trim(),
      });
      
      // Reset form
      setRating(5);
      setComment('');
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setCreating(false);
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
            size={36}
            color={i <= rating ? '#FFC107' : '#6B7280'}
          />
        </Pressable>
      );
    }
    return stars;
  };

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
                  Write a Review
                </Text>
                <Pressable
                  onPress={onClose}
                  className="p-2 bg-axia-gray/20 rounded-full active:scale-95"
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              {/* Parking Name */}
              <View className="mb-6">
                <Text className="text-axia-gray text-sm font-primary mb-1">
                  Parking
                </Text>
                <Text className="text-white text-base font-primaryBold">
                  {parkingName}
                </Text>
              </View>

              {/* Rating */}
              <View className="mb-6">
                <Text className="text-white text-sm font-primaryBold mb-3">
                  Your Rating *
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
                  Your Experience *
                </Text>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Share your experience with this parking..."
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                  className="bg-axia-black/30 text-white px-4 py-3 rounded-xl border border-axia-gray/20 font-primary min-h-[120px]"
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
                  disabled={creating}
                  className="flex-1 bg-axia-gray/20 px-6 py-4 rounded-xl active:scale-95"
                >
                  <Text className="text-white text-center font-primaryBold">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleCreate}
                  disabled={creating || comment.trim().length === 0}
                  className={`flex-1 px-6 py-4 rounded-xl active:scale-95 shadow-lg ${
                    creating || comment.trim().length === 0
                      ? 'bg-axia-gray opacity-50'
                      : 'bg-axia-green shadow-axia-green/25'
                  }`}
                >
                  <Text className="text-white text-center font-primaryBold">
                    {creating ? 'Submitting...' : 'Submit Review'}
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

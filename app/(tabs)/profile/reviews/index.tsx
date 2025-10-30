import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMyReviews } from '../../../../hooks/useMyReviews';
import { ReviewCard } from '../../../../components/molecules/ReviewCard';
import { EditReviewModal } from '../../../../components/molecules/EditReviewModal';
import type { Review } from '../../../../interfaces/review';

export default function MyReviewsScreen() {
  const {
    reviews,
    loading,
    refreshing,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
    handleUpdateReview,
    handleDeleteReview,
  } = useMyReviews();

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setEditModalVisible(true);
  };

  const handleDelete = (reviewId: string) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteReview(reviewId),
        },
      ]
    );
  };

  const handleSaveEdit = async (reviewId: string, data: any) => {
    await handleUpdateReview(reviewId, data);
    setEditModalVisible(false);
    setSelectedReview(null);
  };

  const renderEmptyState = () => {
    if (loading && reviews.length === 0) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-axia-gray mt-4 font-primary">
            Loading your reviews...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center py-20 px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-white text-lg font-primaryBold mt-4 text-center">
            Error Loading Reviews
          </Text>
          <Text className="text-axia-gray text-center mt-2 font-primary">
            {error}
          </Text>
          <Pressable
            onPress={refresh}
            className="bg-axia-green px-6 py-3 rounded-xl mt-6 active:scale-95"
          >
            <Text className="text-white font-primaryBold">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View className="flex-1 justify-center items-center py-20 px-6">
        <Ionicons name="chatbubble-outline" size={64} color="#6B7280" />
        <Text className="text-white text-lg font-primaryBold mt-4 text-center">
          No Reviews Yet
        </Text>
        <Text className="text-axia-gray text-center mt-2 font-primary">
          Your parking reviews will appear here
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || reviews.length === 0) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top']}>
      {/* Header */}
      <View className="px-6 py-4 border-b border-white/10">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="p-2 bg-axia-darkGray rounded-xl active:scale-95"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <View>
              <Text className="text-white text-2xl font-primaryBold">
                My Reviews
              </Text>
              {total > 0 && (
                <Text className="text-axia-gray text-sm font-primary">
                  {total} {total === 1 ? 'review' : 'reviews'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Reviews List */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showActions
          />
        )}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 100,
        }}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#10B981"
            colors={['#10B981']}
          />
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />

      {/* Edit Modal */}
      <EditReviewModal
        visible={editModalVisible}
        review={selectedReview}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedReview(null);
        }}
        onSave={handleSaveEdit}
      />
    </SafeAreaView>
  );
}

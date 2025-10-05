// components/molecules/DateTimeSelector.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateTimeSelectorProps {
  label: string;
  value: string;
  icon: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  label,
  value,
  icon,
  onPress,
  accessibilityLabel
}) => (
  <Pressable
    onPress={onPress}
    className="bg-axia-gray/30 rounded-xl p-4 mb-3 active:scale-95"
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Ionicons name={icon as any} size={20} color="#10B981" />
        <Text className="text-white font-primary ml-3">
          {label}: {value}
        </Text>
      </View>
      <Ionicons name="chevron-down" size={20} color="#6B7280" />
    </View>
  </Pressable>
);
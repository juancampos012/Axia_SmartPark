import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color = '#10B981' }) => {
  return (
    <View className="bg-axia-darkGray rounded-xl p-4 flex-1 items-center">
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: color + '20' }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-white text-2xl font-primaryBold mb-1">
        {value}
      </Text>
      <Text className="text-axia-gray text-xs font-primary text-center">
        {label}
      </Text>
    </View>
  );
};

export default StatCard;

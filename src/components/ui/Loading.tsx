import React from 'react';
import { View, ActivityIndicator, Text, Modal } from 'react-native';

interface LoadingProps {
  visible: boolean;
  text?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  containerClassName?: string;
  textClassName?: string;
}

const Loading: React.FC<LoadingProps> = ({
  visible,
  text = 'Cargando...',
  overlay = true,
  size = 'large',
  color = '#3B82F6', // blue-500
  containerClassName = "",
  textClassName = "",
}) => {
  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className={`bg-white p-6 rounded-xl items-center min-w-32 ${containerClassName}`}>
            <ActivityIndicator size={size} color={color} />
            <Text className={`mt-3 text-base text-gray-800 ${textClassName}`}>
              {text}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (!visible) return null;

  return (
    <View className={`flex-row items-center justify-center p-4 ${containerClassName}`}>
      <ActivityIndicator size={size} color={color} />
      <Text className={`ml-2 text-base text-gray-800 ${textClassName}`}>
        {text}
      </Text>
    </View>
  );
};

export default Loading;
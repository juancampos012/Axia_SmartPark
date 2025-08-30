import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';

interface ParkingCardProps {
  id: string;
  name: string;
  address: string;
  distance: string;
  availableSpaces: number;
  totalSpaces: number;
  pricePerHour: string;
  rating: number;
  image?: string;
  containerClassName?: string;
}

const ParkingCard: React.FC<ParkingCardProps> = ({
  id,
  name,
  address,
  distance,
  availableSpaces,
  totalSpaces,
  pricePerHour,
  rating,
  image,
  containerClassName = "",
}) => {
  const availabilityPercentage = (availableSpaces / totalSpaces) * 100;
  
  const getAvailabilityColor = () => {
    if (availabilityPercentage > 50) return 'text-green-500';
    if (availabilityPercentage > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handlePress = () => {
    router.push(`/parkings/${id}`);
  };

  return (
    <TouchableOpacity
      className={`bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm ${containerClassName}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {image && (
        <Image
          source={{ uri: image }}
          className="w-full h-32 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}
      
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
            {address}
          </Text>
        </View>
        
        <View className="items-end ml-2">
          <Text className="text-lg font-bold text-blue-600">
            {pricePerHour}
          </Text>
          <Text className="text-xs text-gray-500">por hora</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-3">
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <Text className="text-sm text-gray-600">
            {distance} • ⭐ {rating}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Text className={`text-sm font-semibold ${getAvailabilityColor()}`}>
            {availableSpaces}
          </Text>
          <Text className="text-sm text-gray-600">
            /{totalSpaces} espacios
          </Text>
        </View>
      </View>
      
      {/* Barra de disponibilidad */}
      <View className="mt-3">
        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className={`h-full rounded-full ${
              availabilityPercentage > 50 ? 'bg-green-500' :
              availabilityPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${availabilityPercentage}%` }}
          />
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          {availabilityPercentage.toFixed(0)}% disponible
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ParkingCard;

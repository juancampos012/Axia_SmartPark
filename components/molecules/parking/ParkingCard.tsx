import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../atoms/Card';
import Rating from '../../atoms/Rating';
import Distance from '../../atoms/Distance';


export interface Parking {
  id: string;
  name: string;
  hourlyCarRate: number;
  hourlyMotorcycleRate: number;
  distance: number;
  rating: number;
  availableSpots: number;
  totalSpots: number;
  image: string;
  address: string;
  features: string[];
  isFavorite?: boolean;
}

interface ParkingCardProps {
  parking: Parking;
  onPress: (parkingId: string) => void;
  onFavoritePress?: (parkingId: string) => void;
}

const ParkingCard: React.FC<ParkingCardProps> = ({ parking, onPress, onFavoritePress }) => {
  return (
    <Card className="mb-4">
      <Pressable 
        onPress={() => onPress(parking.id)}
        className="flex-row active:scale-95"
      >
        {/* Imagen del parqueadero */}
        <View className="w-20 h-20 rounded-lg bg-axia-gray mr-4 overflow-hidden items-center justify-center">
          <Image 
            source={{ uri: parking.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Información del parqueadero */}
        <View className="flex-1">
          {/* Header con nombre, rating y favorito */}
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1 mr-2">
              <Text className="text-white font-primaryBold text-base" numberOfLines={1}>
                {parking.name}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Rating rating={parking.rating} />
              
              {/* Botón de favorito */}
              <Pressable 
                onPress={() => onFavoritePress?.(parking.id)}
                className="ml-3 p-1 active:scale-65"
              >
                <Ionicons 
                  name={parking.isFavorite ? "heart" : "heart-outline"} 
                  size={20} 
                  color={parking.isFavorite ? "#dc2626" : "#8C8C8C"} 
                />
              </Pressable>
            </View>
          </View>

          {/* Dirección */}
          <Text className="text-axia-gray font-primary text-sm mb-2" numberOfLines={1}>
            {parking.address}
          </Text>

          {/* Precios y distancia */}
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <View className="mr-4">
                <Text className="text-axia-green font-primaryBold text-sm">
                  Carro: COP {parking.hourlyCarRate.toLocaleString()}
                </Text>
                <Text className="text-axia-green font-primaryBold text-sm">
                  Moto: COP {parking.hourlyMotorcycleRate.toLocaleString()}
                </Text>
              </View>
              <Text className="text-axia-gray font-primary text-xs">/hora</Text>
            </View>

            <Distance distance={parking.distance} />
          </View>
        </View>

        {/* Chevron */}
        <View className="ml-2 justify-center">
          <Ionicons name="chevron-forward" size={20} color="#8C8C8C" />
        </View>
      </Pressable>
    </Card>
  );
};

export default ParkingCard;
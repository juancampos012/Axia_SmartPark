import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../atoms/Card';

interface MapSectionProps {
  parkingCount: number;
  className?: string;
}

const MapSection: React.FC<MapSectionProps> = ({
  parkingCount,
  className = ''
}) => {
  return (
    <View className={className}>
      <Card className="h-64 items-center justify-center">
        <View className="bg-axia-darkGray w-full h-full rounded-xl items-center justify-center">
          <Ionicons name="map-outline" size={48} color="#8C8C8C" />
          <Text className="text-axia-gray font-primary text-base mt-2">
            Mapa de parqueaderos
          </Text>
          <Text className="text-axia-gray font-primary text-sm mt-1">
            {parkingCount} parqueaderos encontrados
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default MapSection;
import React from 'react';
import { View, Pressable, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  type: 'car' | 'motorcycle' | 'disabled';
  floor: number;
}

interface Props {
  spots: ParkingSpot[];
  selectedSpot?: ParkingSpot | null;
  onSpotPress: (spot: ParkingSpot) => void;
}

// Calcular tamaño responsive basado en el ancho de pantalla
const { width } = Dimensions.get('window');
const SPOT_SIZE = width < 375 ? 56 : 64;
const SPOT_GAP = width < 375 ? 8 : 12;

const getStatusColor = (status: ParkingSpot['status']) => {
  switch (status) {
    case 'available':
      return '#10B981'; // Verde
    case 'occupied':
      return '#EF4444'; // Rojo
    case 'reserved':
      return '#F59E0B'; // Amarillo
    case 'maintenance':
      return '#6B7280'; // Gris
    default:
      return '#374151';
  }
};

const getTypeIcon = (type: ParkingSpot['type']) => {
  switch (type) {
    case 'car':
      return 'car-sport';
    case 'motorcycle':
      return 'bicycle';
    case 'disabled':
      return 'accessibility';
    default:
      return 'car-sport';
  }
};

const getStatusText = (status: ParkingSpot['status']) => {
  switch (status) {
    case 'available':
      return 'Disponible';
    case 'occupied':
      return 'Ocupado';
    case 'reserved':
      return 'Reservado';
    case 'maintenance':
      return 'Mantenimiento';
    default:
      return 'Desconocido';
  }
};

const ParkingSpotGrid: React.FC<Props> = ({ spots, selectedSpot, onSpotPress }) => {
  if (!spots || spots.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="car-outline" size={48} color="#6B7280" />
        <Text className="text-axia-gray mt-4 text-lg font-primary text-center">
          No hay espacios disponibles
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap justify-center" style={{ gap: SPOT_GAP }}>
      {spots.map((spot) => {
        const isSelected = selectedSpot?.id === spot.id;
        const isAvailable = spot.status === 'available';
        const color = getStatusColor(spot.status);

        return (
          <Pressable
            key={spot.id}
            onPress={() => isAvailable && onSpotPress(spot)}
            disabled={!isAvailable}
            style={{
              width: SPOT_SIZE,
              height: SPOT_SIZE,
            }}
            className={`rounded-lg items-center justify-center border-2 ${
              isSelected 
                ? 'border-axia-green bg-axia-green/20' 
                : 'border-axia-gray/30'
            } ${isAvailable ? 'active:scale-95' : 'opacity-60'}`}
            accessibilityLabel={`Espacio ${spot.number}, ${getStatusText(spot.status)}, tipo ${spot.type}`}
            accessibilityRole="button"
            accessibilityState={{
              selected: isSelected,
              disabled: !isAvailable
            }}
          >
            <Ionicons
              name={getTypeIcon(spot.type) as any}
              size={20}
              color={
                isSelected ? '#10B981' : 
                isAvailable ? '#10B981' : '#6B7280'
              }
            />
            <Text className={`text-xs font-primaryBold mt-1 ${
              isSelected ? 'text-axia-green' : 
              isAvailable ? 'text-white' : 'text-axia-gray'
            }`}>
              {spot.number}
            </Text>
            
            {/* Indicador de estado para espacios no disponibles */}
            {!isAvailable && (
              <View 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-axia-darkGray"
                style={{ backgroundColor: color }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default ParkingSpotGrid;
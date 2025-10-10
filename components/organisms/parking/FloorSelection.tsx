import React from 'react';
import { View, Text } from 'react-native';
import { FloorSelector } from '../../atoms/FloorSelector';
import ParkingSpotGrid from '../../molecules/parking/ParkingSpotGrid';

interface Floor {
  id: string;
  number: number;
  name: string;
  totalSpots: number;
  availableSpots: number;
  spots: ParkingSpot[];
}

interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  type: 'car' | 'motorcycle' | 'disabled';
  floor: number;
}

interface Vehicle {
  type: 'car' | 'motorcycle';
}

interface Props {
  floors: Floor[];
  selectedFloor: number;
  selectedSpot: ParkingSpot | null;
  selectedVehicle: Vehicle | null;
  onFloorSelect: (floorNumber: number) => void;
  onSpotPress: (spot: ParkingSpot) => void;
}

const FloorSelection: React.FC<Props> = ({
  floors,
  selectedFloor,
  selectedSpot,
  selectedVehicle,
  onFloorSelect,
  onSpotPress
}) => {
  const currentFloor = floors.find(f => f.number === selectedFloor);
  const filteredSpots = currentFloor?.spots.filter(spot => {
    if (selectedVehicle?.type === 'motorcycle') {
      return spot.type === 'motorcycle' || spot.type === 'disabled';
    } else {
      return spot.type === 'car' || spot.type === 'disabled';
    }
  }) || [];

  const availableSpotsCount = filteredSpots.filter(spot => spot.status === 'available').length;

  return (
    <View className="bg-axia-darkGray rounded-2xl p-5">
      <Text className="text-white text-lg font-primaryBold mb-4">
        Seleccionar Piso
      </Text>
      
      <FloorSelector
        floors={floors}
        selectedFloor={selectedFloor}
        onFloorSelect={onFloorSelect}
      />

      {currentFloor && (
        <View className="mt-4">
          <ParkingSpotGrid
            spots={filteredSpots}
            selectedSpot={selectedSpot}
            onSpotPress={onSpotPress}
            title={`Piso ${currentFloor.number} - ${availableSpotsCount} espacios disponibles para ${selectedVehicle?.type === 'car' ? 'carros' : 'motos'}`}
            emptyMessage={`No hay espacios ${selectedVehicle?.type === 'car' ? 'para carros' : 'para motos'} en este piso`}
          />

          {/* Legend */}
          <View className="flex-row flex-wrap justify-center gap-4 mt-4 mb-4">
            {[
              { color: "#10B981", label: "Disponible" },
              { color: "#EF4444", label: "Ocupado" },
              { color: "#F59E0B", label: "Reservado" },
              { color: "#6B7280", label: "Mantenimiento" },
            ].map((item, index) => (
              <View key={index} className="flex-row items-center">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-axia-gray text-xs">{item.label}</Text>
              </View>
            ))}
          </View>
          <View>
            <Text className="text-axia-gray text-xs  text-center">
              Tenga en cuenta que la ilustración de los espacios es representativa y puede no reflejar la disposición exacta del estacionamiento.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default FloorSelection;
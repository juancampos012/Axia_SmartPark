// components/molecules/FloorSelector.tsx
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

interface Floor {
  id: string;
  number: number;
  name: string;
  availableSpots: number;
}

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloor: number;
  onFloorSelect: (floorNumber: number) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floors,
  selectedFloor,
  onFloorSelect
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="mb-4"
    contentContainerStyle={{ gap: 12 }}
  >
    {floors.map((floor) => (
      <Pressable
        key={floor.id}
        onPress={() => onFloorSelect(floor.number)}
        className={`px-6 py-3 rounded-xl min-w-32 items-center ${
          selectedFloor === floor.number
            ? "bg-axia-green"
            : "bg-axia-gray/30"
        } active:scale-95`}
        accessibilityLabel={`Seleccionar ${floor.name} con ${floor.availableSpots} espacios disponibles`}
        accessibilityRole="button"
      >
        <Text
          className={`font-primaryBold ${
            selectedFloor === floor.number
              ? "text-axia-black"
              : "text-white"
          }`}
        >
          {floor.name}
        </Text>
        <Text
          className={`text-xs font-primary ${
            selectedFloor === floor.number
              ? "text-axia-black/80"
              : "text-axia-gray"
          }`}
        >
          {floor.availableSpots} disponibles
        </Text>
      </Pressable>
    ))}
  </ScrollView>
);
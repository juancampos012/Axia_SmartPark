import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VehiclePickerModal from '../../molecules/VehiclePickerModal';

interface Vehicle {
  id: string;
  licensePlate: string;
  type: 'car' | 'motorcycle';
  model: string;
  carBrand: string;
}

interface Props {
  selectedVehicle: Vehicle | null;
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  showPicker: boolean;
  onShowPicker: (show: boolean) => void;
}

const VehicleSelection: React.FC<Props> = ({
  selectedVehicle,
  vehicles,
  onVehicleSelect,
  showPicker,
  onShowPicker
}) => {
  return (
    <View className="bg-axia-darkGray rounded-2xl p-5">
      <Text className="text-white text-lg font-primaryBold mb-4">
        Vehículo
      </Text>
      
      <Pressable
        onPress={() => onShowPicker(true)}
        className="bg-axia-gray/30 rounded-xl p-4 flex-row justify-between items-center active:scale-95"
      >
        <View className="flex-row items-center">
          <Ionicons 
            name={selectedVehicle?.type === 'motorcycle' ? 'bicycle' : 'car-sport'} 
            size={20} 
            color="#10B981" 
          />
          <View className="ml-3">
            <Text className="text-white font-primaryBold">
              {selectedVehicle?.carBrand} {selectedVehicle?.model}
            </Text>
            <Text className="text-axia-gray text-sm font-primary">
              {selectedVehicle?.licensePlate} 
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </Pressable>

      <VehiclePickerModal
        visible={showPicker}
        vehicles={vehicles}
        selectedVehicle={selectedVehicle}
        onSelect={onVehicleSelect}
        onClose={() => onShowPicker(false)}
      />
    </View>
  );
};

export default VehicleSelection;
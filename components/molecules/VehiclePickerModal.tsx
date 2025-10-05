import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Vehicle {
  id: string;
  carBrand: string;
  model: string;
  licensePlate: string;
  type: 'car' | 'motorcycle';
  color?: string;
}

interface Props {
  visible: boolean;
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
  onSelect: (vehicle: Vehicle) => void;
  onClose: () => void;
}

const VehiclePickerModal: React.FC<Props> = ({
  visible,
  vehicles,
  selectedVehicle,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-axia-darkGray rounded-t-3xl p-6 max-h-[70%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-primaryBold text-lg">Selecciona tu vehículo</Text>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, gap: 12 }}
          >
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => {
                const isSelected = selectedVehicle?.id === vehicle.id;
                return (
                  <Pressable
                    key={vehicle.id}
                    onPress={() => {
                      onSelect(vehicle);
                      onClose();
                    }}
                    className={`p-4 rounded-xl border-2 ${
                      isSelected
                        ? 'border-axia-green bg-axia-green/10'
                        : 'border-axia-gray/30 bg-axia-gray/10'
                    } active:scale-95`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Ionicons 
                            name={vehicle.type === 'motorcycle' ? 'bicycle' : 'car-sport'} 
                            size={16} 
                            color={isSelected ? '#10B981' : '#6B7280'} 
                          />
                          <Text className={`font-primaryBold text-base ml-2 ${
                            isSelected ? 'text-axia-green' : 'text-white'
                          }`}>
                            {vehicle.carBrand} {vehicle.model}
                          </Text>
                        </View>
                        <Text className="text-axia-gray font-primary text-sm">
                          {vehicle.licensePlate}
                        </Text>
                        {vehicle.color && (
                          <Text className="text-axia-gray/80 text-xs mt-1">
                            Color: {vehicle.color}
                          </Text>
                        )}
                      </View>

                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      )}
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View className="items-center justify-center py-10">
                <Ionicons name="car-outline" size={48} color="#6B7280" />
                <Text className="text-axia-gray mt-4 text-center text-base font-primary">
                  No tienes vehículos registrados
                </Text>
                <Text className="text-axia-gray/80 mt-2 text-center text-sm">
                  Agrega un vehículo para continuar
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default VehiclePickerModal;
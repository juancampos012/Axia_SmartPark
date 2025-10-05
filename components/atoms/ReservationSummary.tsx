// components/molecules/ReservationSummary.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface ReservationSummaryProps {
  selectedSpot: {
    number: string;
  };
  selectedFloor: number;
  selectedVehicle?: {
    carBrand: string;
    model: string;
    licensePlate: string;
  } | null;
  selectedDate: Date;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  hourlyRate: number;
  totalPrice: number;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

export const ReservationSummary: React.FC<ReservationSummaryProps> = ({
  selectedSpot,
  selectedFloor,
  selectedVehicle,
  selectedDate,
  startTime,
  endTime,
  totalHours,
  hourlyRate,
  totalPrice,
  formatDate,
  formatTime
}) => {
  const summaryItems = [
    { label: "Espacio seleccionado:", value: `${selectedSpot.number} - Piso ${selectedFloor}` },
    { label: "Vehículo:", value: `${selectedVehicle?.carBrand} ${selectedVehicle?.model} (${selectedVehicle?.licensePlate})` },
    { label: "Fecha:", value: formatDate(selectedDate) },
    { label: "Horario:", value: `${formatTime(startTime)} - ${formatTime(endTime)}` },
    { label: "Duración:", value: `${totalHours} hora${totalHours > 1 ? "s" : ""}` },
    { label: "Tarifa por hora:", value: `COP ${(hourlyRate || 0).toLocaleString()}` },
  ];

  return (
    <View className="bg-axia-green/10 rounded-2xl p-5 mb-6 border border-axia-green/20">
      <Text className="text-white text-lg font-primaryBold mb-3 text-center">
        Resumen de Reserva
      </Text>
      
      <View className="space-y-2">
        {summaryItems.map((item, index) => (
          <View key={index} className="flex-row justify-between">
            <Text className="text-axia-gray font-primary">{item.label}</Text>
            <Text className="text-white font-primaryBold text-right flex-1 ml-2">
              {item.value}
            </Text>
          </View>
        ))}
        
        <View className="border-t border-axia-green/20 pt-2 mt-2">
          <View className="flex-row justify-between">
            <Text className="text-axia-gray font-primary">Total a pagar:</Text>
            <Text className="text-axia-green font-primaryBold text-lg">
              COP {totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
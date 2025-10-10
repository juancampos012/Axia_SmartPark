import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  selectedDate: Date;
  startTime: Date;
  endTime: Date;
  totalHours: number;
  totalPrice: number;
  isValidReservation: boolean;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
}

const ReservationForm: React.FC<Props> = ({
  selectedDate,
  startTime,
  endTime,
  totalHours,
  totalPrice,
  isValidReservation,
  formatDate,
  formatTime
}) => {
  return (
    <View className="bg-axia-darkGray/50 rounded-2xl p-4">
      <View className="flex-row items-center mb-2">
        <Ionicons name="information-circle" size={20} color="#10B981" />
        <Text className="text-white font-primaryBold ml-2">
          Información de la reserva
        </Text>
      </View>
      
      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-axia-gray text-sm">Fecha:</Text>
          <Text className="text-white text-sm font-primaryBold">
            {formatDate(selectedDate)}
          </Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-axia-gray text-sm">Horario:</Text>
          <Text className="text-white text-sm font-primaryBold">
            {formatTime(startTime)} - {formatTime(endTime)}
          </Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-axia-gray text-sm">Duración:</Text>
          <Text className="text-white text-sm font-primaryBold">
            {totalHours} hora{totalHours > 1 ? 's' : ''}
          </Text>
        </View>
        
        <View className="flex-row justify-between border-t border-axia-gray/30 pt-2">
          <Text className="text-axia-gray text-sm font-primaryBold">Total:</Text>
          <Text className="text-axia-green text-sm font-primaryBold">
            COP {totalPrice.toLocaleString()}
          </Text>
        </View>
      </View>

      {!isValidReservation && (
        <View className="mt-3 bg-yellow-500/10 rounded-lg p-2">
          <Text className="text-yellow-500 text-xs text-center">
            Verifica que las fechas y horarios sean válidos
          </Text>
        </View>
      )}
    </View>
  );
};

export default ReservationForm;
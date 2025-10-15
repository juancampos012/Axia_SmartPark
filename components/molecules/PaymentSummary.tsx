import React from 'react';
import { View, Text } from 'react-native';

export interface PaymentSummaryData {
  parkingName: string;
  address: string;
  spotNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  hourlyRate: number;
  totalAmount: number;
}

interface PaymentSummaryProps {
  data: PaymentSummaryData;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ data }) => {
  return (
    <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
      <Text className="text-white text-lg font-primaryBold mb-4">Resumen de Reserva</Text>
      
      {/* Información del parqueadero */}
      <View className="mb-4">
        <Text className="text-axia-gray text-sm font-primary mb-1">Parqueadero</Text>
        <Text className="text-white text-base font-primaryBold">{data.parkingName}</Text>
        <Text className="text-axia-gray text-sm font-primary">{data.address}</Text>
      </View>

      {/* Información del puesto */}
      <View className="mb-4">
        <Text className="text-axia-gray text-sm font-primary mb-1">Puesto</Text>
        <Text className="text-white text-base font-primaryBold">#{data.spotNumber}</Text>
      </View>

      {/* Fecha y horario */}
      <View className="mb-4">
        <Text className="text-axia-gray text-sm font-primary mb-1">Fecha y horario</Text>
        <Text className="text-white text-base font-primary">{data.date}</Text>
        <Text className="text-white text-base font-primary">
          {data.startTime} - {data.endTime} ({data.duration})
        </Text>
      </View>

      {/* Separador */}
      <View className="h-px bg-axia-gray/30 my-4" />

      {/* Desglose de precio */}
      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-axia-gray text-sm font-primary">Tarifa por hora</Text>
          <Text className="text-white text-sm font-primary">${data.hourlyRate.toFixed(2)}</Text>
        </View>
        
        <View className="flex-row justify-between">
          <Text className="text-axia-gray text-sm font-primary">Duración</Text>
          <Text className="text-white text-sm font-primary">{data.duration}</Text>
        </View>
      </View>

      {/* Separador */}
      <View className="h-px bg-axia-gray/30 my-4" />

      {/* Total */}
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-lg font-primaryBold">Total a Pagar</Text>
        <Text className="text-axia-green text-2xl font-primaryBold">
          ${data.totalAmount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default PaymentSummary;

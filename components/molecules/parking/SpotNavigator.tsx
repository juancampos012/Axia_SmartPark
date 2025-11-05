import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SpotNavigatorProps {
  floorNumber: number;
  spotNumber: string;
  spotType: 'STANDARD' | 'ELECTRIC' | 'HANDICAPPED';
  parkingName: string;
  onClose?: () => void;
}

const { width } = Dimensions.get('window');

const SpotNavigator: React.FC<SpotNavigatorProps> = ({
  floorNumber,
  spotNumber,
  spotType,
  parkingName,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  const navigationSteps = [
    {
      icon: 'log-in-outline',
      title: 'Ingresa al parqueadero',
      description: 'Dirígete a la entrada principal',
      color: '#10B981',
    },
    {
      icon: floorNumber === 1 ? 'arrow-forward' : 'arrow-up',
      title: floorNumber === 1 ? 'Mantente en planta baja' : `Sube al piso ${floorNumber}`,
      description: floorNumber === 1 ? 'Tu puesto está en la planta baja' : `Usa el ascensor o las escaleras`,
      color: '#3B82F6',
    },
    {
      icon: 'navigate',
      title: `Busca el puesto ${spotNumber}`,
      description: 'Sigue las señales numeradas',
      color: '#F59E0B',
    },
    {
      icon: 'checkmark-circle',
      title: '¡Llegaste!',
      description: `Estaciona tu vehículo en el puesto ${spotNumber}`,
      color: '#10B981',
    },
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getSpotTypeLabel = () => {
    switch (spotType) {
      case 'ELECTRIC':
        return { label: 'Eléctrico', icon: 'flash', color: '#F59E0B', useFA: false };
      case 'HANDICAPPED':
        return { label: 'Discapacitados', icon: 'wheelchair', color: '#3B82F6', useFA: true };
      default:
        return { label: 'Estándar', icon: 'car', color: '#10B981', useFA: false };
    }
  };

  const spotTypeInfo = getSpotTypeLabel();

  const handleNext = () => {
    if (currentStep < navigationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View className="flex-1 bg-black p-5">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 mt-10">
        <View className="flex-1">
          <Text className="text-white text-2xl font-primaryBold mb-1">Navegación al Puesto</Text>
          <Text className="text-axia-gray text-sm font-primary">{parkingName}</Text>
        </View>
        {onClose && (
          <Pressable onPress={onClose} className="w-10 h-10 rounded-full bg-[#2D2D2D] items-center justify-center">
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      {/* Spot Info Card */}
      <View 
        className="mb-6 rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <LinearGradient colors={['#1F1F1F', '#2D2D2D']} className="p-5">
          <View className="flex-row items-center">
            <View className="mr-5">
              <Animated.View
                className="w-20 h-20 rounded-full bg-axia-green items-center justify-center border-4 border-white"
                style={{ transform: [{ scale: pulseAnim }] }}
                >
                <Text className="text-white text-lg font-primaryBold text-center">{spotNumber}</Text>
              </Animated.View>
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-primaryBold mb-2">Tu Puesto</Text>
              <View className="flex-row gap-2">
                <View 
                  className="flex-row items-center px-2.5 py-1 rounded-xl gap-1"
                  style={{ backgroundColor: `${spotTypeInfo.color}33` }}
                >
                  {spotTypeInfo.useFA ? (
                    <FontAwesome5 name="wheelchair" size={14} color={spotTypeInfo.color} />
                  ) : (
                    <Ionicons name={spotTypeInfo.icon as any} size={14} color={spotTypeInfo.color} />
                  )}
                  <Text className="text-xs font-primarySemiBold" style={{ color: spotTypeInfo.color }}>
                    {spotTypeInfo.label}
                  </Text>
                </View>
                <View className="flex-row items-center bg-[#2D2D2D] px-2.5 py-1 rounded-xl gap-1">
                  <Ionicons name="layers" size={14} color="#9CA3AF" />
                  <Text className="text-axia-gray text-xs font-primarySemiBold">Piso {floorNumber}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Progress Indicator */}
      <View className="flex-row items-center justify-center mb-8">
        {navigationSteps.map((_, index) => (
          <View key={index} className="flex-row items-center">
            <View
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: index <= currentStep ? '#10B981' : '#2D2D2D',
                transform: [{ scale: index === currentStep ? 1.3 : 1 }],
              }}
            />
            {index < navigationSteps.length - 1 && (
              <View
                className="h-0.5"
                style={{
                  width: (width - 120) / 3,
                  backgroundColor: index < currentStep ? '#10B981' : '#2D2D2D',
                }}
              />
            )}
          </View>
        ))}
      </View>

      {/* Current Step */}
      <View className="flex-1 items-center justify-center">
        <View 
          className="rounded-full items-center justify-center mb-6"
          style={{
            width: 120,
            height: 120,
            backgroundColor: navigationSteps[currentStep].color,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons
            name={navigationSteps[currentStep].icon as any}
            size={56}
            color="#FFFFFF"
          />
        </View>
        <Text className="text-white text-2xl font-primaryBold text-center mb-3">
          {navigationSteps[currentStep].title}
        </Text>
        <Text className="text-axia-gray text-base font-primary text-center mb-4">
          {navigationSteps[currentStep].description}
        </Text>
        <View className="bg-[#2D2D2D] px-4 py-2 rounded-full">
          <Text className="text-axia-green text-sm font-primarySemiBold">
            Paso {currentStep + 1} de {navigationSteps.length}
          </Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <View className="flex-row gap-3 mb-4">
        <Pressable
          onPress={handlePrevious}
          disabled={currentStep === 0}
          className={`flex-1 flex-row items-center justify-center py-4 rounded-xl gap-2 ${
            currentStep === 0 ? 'bg-[#1F1F1F] opacity-50' : 'bg-[#2D2D2D]'
          }`}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentStep === 0 ? '#6B7280' : '#FFFFFF'}
          />
          <Text className={`text-base font-primaryBold ${currentStep === 0 ? 'text-gray-500' : 'text-white'}`}>
            Anterior
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={currentStep === navigationSteps.length - 1}
          className={`flex-1 flex-row items-center justify-center py-4 rounded-xl gap-2 ${
            currentStep === navigationSteps.length - 1 ? 'bg-[#1F1F1F] opacity-50' : 'bg-axia-green'
          }`}
        >
          <Text 
            className={`text-base font-primaryBold ${
              currentStep === navigationSteps.length - 1 ? 'text-gray-500' : 'text-white'
            }`}
          >
            {currentStep === navigationSteps.length - 1 ? 'Completado' : 'Siguiente'}
          </Text>
          {currentStep !== navigationSteps.length - 1 && (
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          )}
        </Pressable>
      </View>

      {/* Help Section */}
      <View className="px-1">
        <View className="flex-row bg-axia-green/10 p-3 rounded-xl gap-3">
          <Ionicons name="information-circle" size={20} color="#10B981" />
          <Text className="flex-1 text-axia-gray text-xs font-primary leading-[18px]">
            Si tienes problemas para encontrar tu puesto, solicita ayuda al personal del parqueadero
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SpotNavigator;

import React, { useEffect, useRef } from 'react';
import { Text, View, StatusBar, Animated, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '../../components/atoms/Button';
import { Ionicons } from '@expo/vector-icons';
import { requestNotificationPermissions } from '../../libs/reservation-notifications';

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;

  const handleLoginPress = () => router.push('/(auth)/login');
  const handleRegisterPress = () => router.push('/(auth)/register');

  useEffect(() => {
    const initNotifications = async () => {
      const status = await requestNotificationPermissions();
      if (status !== 'granted') {
        Alert.alert('Permisos denegados', 'No se podrán recibir notificaciones');
      } else {
        console.log('✅ Permisos concedidos');
      }
    };

    initNotifications();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: 'search' as const,
      title: 'Encuentra',
      description: 'Parqueaderos cerca',
      color: '#10B981'
    },
    {
      icon: 'calendar' as const,
      title: 'Reserva',
      description: 'En segundos',
      color: '#10B981'
    },
    {
      icon: 'shield-checkmark' as const,
      title: 'Seguro',
      description: 'Pagos protegidos',
      color: '#10B981'
    }
  ];

  const FeatureCard = ({ icon, title, description, color, delay }: any) => {
    const featureAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(featureAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View 
        style={{ 
          opacity: featureAnim,
          transform: [{ translateY: featureAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0]
          })}]
        }}
        className="items-center flex-1 mx-2"
      >
        <View className="w-16 h-16 bg-axia-green/10 rounded-2xl items-center justify-center mb-4 border border-axia-green/20">
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text className="text-white font-primaryBold text-sm mb-2 text-center">
          {title}
        </Text>
        <Text className="text-white/60 text-xs text-center font-primary leading-4">
          {description}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <StatusBar barStyle="light-content" backgroundColor="#0F1115" />
      
      {/* Background Elements */}
      <View className="absolute top-0 left-0 right-0 bottom-0">
        <View className="absolute top-20 -left-20 w-40 h-40 bg-axia-green/5 rounded-full blur-xl" />
        <View className="absolute bottom-40 -right-20 w-40 h-40 bg-axia-green/5 rounded-full blur-xl" />
      </View>

      <View className="flex-1 px-6">
        
        {/* Hero Section */}
        <View className="flex-1 justify-center items-center">
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }}
            className="items-center mt-16"
          >

            {/* Titles */}
            <View className="items-center mb-8">
              <Text className="text-white text-4xl font-secondaryBold mb-2 text-center tracking-tight">
                AXIA
              </Text>
              <View className="h-1 w-16 bg-axia-green rounded-full mb-3" />
              <Text className="text-axia-green text-xl font-secondaryBold text-center tracking-wide">
                SmartPark
              </Text>
            </View>

            {/* Tagline */}
            <View className="items-center">
              <Text className="text-white text-2xl font-primaryBold text-center mb-3 leading-8">
                Estacionamiento{'\n'}
                <Text className="text-axia-green">Inteligente</Text>
              </Text>
              <Text className="text-white/70 text-base text-center font-primary">
                Encuentra y reserva tu espacio
                de forma rápida y segura
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Features Section */}
        <View className="mb-18">
          <View className="flex-row justify-between">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                delay={1000 + index * 200}
              />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
          className="pb-18 gap-4"
        >
          <Button 
            title="Iniciar sesión"
            onPress={handleLoginPress} 
            variant="primary" 
            size="large"
          />
          
          <Button 
            title="Crear cuenta"
            onPress={handleRegisterPress} 
            variant="secondary" 
            size="large"
          />
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}
import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Button from '../src/components/ui/Button';

// Importar el logo
const AxiaSmartParkLogo = require('../assets/axia-sp1.png');

const WelcomeScreen: React.FC = () => {
  const router = useRouter();

  const handleLoginPress = () => router.push('/(auth)/login');
  const handleRegisterPress = () => router.push('/(auth)/register');

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        // Gradiente más suave y elegante
        colors={["#1a1f29", "#0F1115", "#1a1f29"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <View className="flex-1 px-6 py-8">
          {/* Centro: Logo + tagline */}
          <View className="flex-1 items-center justify-center">
            {/* Círculo sutil detrás del logo */}
            <View className="w-80 h-80 rounded-full bg-white/5 items-center justify-center mb-8 pb-2">
              <Image
                source={AxiaSmartParkLogo}
                className="w-80 h-80"
                resizeMode="contain"
              />
            </View>
            
            <Text className="text-white text-5xl font-bold mb-3 text-center">
              Bienvenido a
            </Text>
            <Text className="text-axia-green text-3xl font-bold mb-4">
              AXIA SmartPark
            </Text>
            <Text className="text-white/70 text-lg text-center px-8 mb-2">
              Tu espacio, tu tiempo, tu ciudad.
            </Text>
            <Text className="text-white/50 text-base text-center px-6">
              Encuentra y reserva estacionamiento de forma inteligente
            </Text>
          </View>

          {/* CTAs con mejor spacing */}
          <View className="gap-4 pb-8">
            <Button title="Iniciar sesión" onPress={handleLoginPress} variant="primary" size="large" className="w-full" />
            <Button title="Crear cuenta" onPress={handleRegisterPress} variant="outline" size="large" className="w-full" />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
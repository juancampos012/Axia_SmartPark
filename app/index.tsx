import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Usa tu logo actual
const AxiaLogo = require('../assets/axia-sp1.png');

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-axia-black justify-center items-center">
      <StatusBar style="light" />
      
      <Image
        source={AxiaLogo}
        className="w-40 h-40 mb-6"
        resizeMode="contain"
      />
    </View>
  );
}
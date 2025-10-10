import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Usa tu logo actual
const AxiaLogo = require('../assets/axia-sp1.png');

export default function SplashScreen() {
    React.useEffect(() => {
      const checkAccessToken = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        console.log("Access Token:", token);
  
      };
      checkAccessToken();
    }, []);
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
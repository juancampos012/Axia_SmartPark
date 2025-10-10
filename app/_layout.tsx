// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import * as Network from 'expo-network';
import { AuthProvider } from '../context/AuthContext';
import "../global.css";


export default function AppLayout() {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(true);
  
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected ?? false);
        
        if (!networkState.isConnected) {
          Alert.alert(
            "Sin conexión a Internet",
            "Por favor, verifica tu conexión a Internet para usar la aplicación.",
            [{ text: "Entendido" }]
          );
        }
      } catch (error) {
        console.error('Error checking network connection:', error);
        setIsConnected(false);
      }
    };

    checkConnection();

    // Opcionalmente, puedes agregar un listener para cambios de conexión
    const interval = setInterval(checkConnection, 5000); // Verifica cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
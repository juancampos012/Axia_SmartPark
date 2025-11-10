// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import * as Network from 'expo-network';
import { AuthProvider } from '../context/AuthContext';
import "../global.css";

export default function AppLayout() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const hasShownAlertRef = useRef(false);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-Bold": Poppins_700Bold,
  });

  // Manejo controlado de conexión sin alertas repetidas
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const connected = networkState.isConnected ?? false;

        if (!connected && !hasShownAlertRef.current) {
          Alert.alert(
            "Sin conexión a Internet",
            "Por favor, verifica tu conexión a Internet para usar la aplicación.",
            [{ text: "Entendido", onPress: () => (hasShownAlertRef.current = false) }]
          );
          hasShownAlertRef.current = true;
        }

        if (connected) hasShownAlertRef.current = false;
        setIsConnected(connected);
      } catch (error) {
        console.error("Error checking network connection:", error);
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  // Espera a que las fuentes estén cargadas
  if (!fontsLoaded) return null;

  return (
    // El AuthProvider DEBE envolver el Stack, no ir dentro
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}

// app/_layout.tsx
import { Stack } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import "../global.css";

export default function AppLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-Bold": Poppins_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="parkings" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="reservation" />
    </Stack>
  );
}

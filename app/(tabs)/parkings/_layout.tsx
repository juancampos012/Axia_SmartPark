import { Stack } from 'expo-router';

export default function parkingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true, animation: 'slide_from_right', gestureDirection: 'horizontal' }}>
      <Stack.Screen name="index" options={{ title: 'Reservas', gestureEnabled: false }} />
      <Stack.Screen name="[id]/map" options={{ title: 'Mapa de Reserva' }} />
      <Stack.Screen name="[id]/reserve" options={{ title: 'Extender Reserva' }} />
    </Stack>
  );
}

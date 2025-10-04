import { Stack } from 'expo-router';

export default function ReservationsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true, animation: 'slide_from_right', gestureDirection: 'horizontal' }}>
      <Stack.Screen name="index" options={{ title: 'Reservas', gestureEnabled: false }} />
      <Stack.Screen name="[id]/map" options={{ title: 'Mapa de Reserva' }} />
      <Stack.Screen name="[id]/extend" options={{ title: 'Extender Reserva' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Detalle Reserva' }} />
      <Stack.Screen name="[id]/payment/index" options={{ title: 'Pago' }} />
      <Stack.Screen name="[id]/payment/[paymentId]" options={{ title: 'Detalle Pago' }} />
    </Stack>
  );
}

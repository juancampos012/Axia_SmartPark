// app/(tabs)/profile/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true, animation: 'slide_from_right', gestureDirection: 'horizontal', }}>
      <Stack.Screen name="index" options={{ title: 'Perfil', gestureEnabled: false, }} />
      <Stack.Screen name="personal-info/index" options={{ title: 'Información Personal', gestureEnabled: true, gestureDirection: 'horizontal', }}/>
      <Stack.Screen name="cars/add/index" options={{ title: 'Añadir Auto', gestureEnabled: true, }}/>
      <Stack.Screen name="cars/detail/[carId]" options={{ title: 'Detalle Auto', gestureEnabled: true, }}/>
    </Stack>
  );
}
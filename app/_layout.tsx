// app/_layout.tsx
import { Stack } from 'expo-router';
import "../global.css";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="reservation" />
    </Stack>
    
  );
}

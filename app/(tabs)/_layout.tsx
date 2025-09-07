import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#780BB7',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarStyle: { backgroundColor: '#0F1115', borderTopColor: '#1a1f29' },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen name="home/index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="parkings/index" options={{ title: 'Parqueos' }} />
      <Tabs.Screen name="reservations/index" options={{ title: 'Reservas' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Perfil' }} />
      <Tabs.Screen name="settings/index" options={{ title: 'Ajustes' }} />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarStyle: { 
          backgroundColor: '#0F1115', 
          borderTopColor: '', 
          height: 90, 
          paddingBottom: 8, 
        },
        tabBarLabelStyle: { fontSize: 12, marginTop: 10 }, 
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
      <Tabs.Screen
        name="parkings/index"
        options={{
          title: 'Parqueos',
          tabBarIcon: ({ color }) => (
            <Ionicons name="car-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
      <Tabs.Screen name="parkings/[id]/index" options={{ href: null }} />
      <Tabs.Screen name="parkings/[id]/reserve" options={{ href: null }} />
      <Tabs.Screen
        name="reservations/index"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
      <Tabs.Screen name="reservations/[id]/map" options={{ href: null }} />
      <Tabs.Screen name="reservations/[id]/extend" options={{ href: null }} />
      <Tabs.Screen name="reservations/[id]/index" options={{ href: null }} />
      <Tabs.Screen name="reservations/[id]/payment/[paymentId]" options={{ href: null }} />
      <Tabs.Screen name="reservations/[id]/payment/index" options={{ href: null }} />
      
      {/* SOLO la pantalla principal de profile - las subpantallas estarán en el stack */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
      
      {/* REMUEVE estas líneas - ahora estarán en el stack de profile */}
      {/* <Tabs.Screen name="profile/personal-info/index" options={{ href: null }} /> */}
      
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
    </Tabs>
  );
}
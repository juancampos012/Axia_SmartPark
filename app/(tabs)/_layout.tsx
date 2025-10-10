import { Ionicons } from '@expo/vector-icons';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function TabsLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#0F1115' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/" />;
  }

  return <AuthenticatedTabs />;
}

// Componente separado para los tabs (tu código original)
function AuthenticatedTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarStyle: { 
          backgroundColor: '#0F1115',  
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
        name="parkings"
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
        name="reservations"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
          ),
        }}
      />
      
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
import { Tabs, Redirect } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { user, loading, isConnected } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <View className="flex-1 bg-axia-black items-center justify-center">
        <ActivityIndicator size="large" color="#006B54" />
        <Text className="text-white mt-4 font-primary">Cargando...</Text>
      </View>
    );
  }

  // Redirigir a login si no hay usuario autenticado
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Mostrar aviso si no hay conexión (pero permitir navegación offline)
  if (!isConnected) {
    return (
      <View className="flex-1 bg-axia-black">
        <View className="bg-red-500 px-4 py-2">
          <Text className="text-white text-center font-primary text-sm">
            Sin conexión a Internet - Modo offline
          </Text>
        </View>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#8C8C8C',
            tabBarStyle: { 
              backgroundColor: '#0F1115', 
              borderTopColor: '#1a1f29', 
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
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarStyle: { 
          backgroundColor: '#0F1115', 
          borderTopColor: '#1a1f29', 
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
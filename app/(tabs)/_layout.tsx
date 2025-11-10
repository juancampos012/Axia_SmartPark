import { Tabs, Redirect, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabsLayout() {
  const { user, loading, isConnected, isAdminOrOperator, isAdmin, isOperator } = useAuth();
  const router = useRouter();

  // Verificar periódicamente que haya token válido
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const userData = await AsyncStorage.getItem('userData');
      
      // Si no hay token o datos de usuario pero estamos en tabs, redirigir a login
      if (!token || !userData) {
        console.log('TabsLayout - Token o userData faltante, redirigiendo a login');
        router.replace('/(auth)/login');
      }
    };

    // Verificar inmediatamente y cada 30 segundos
    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Debug: Log para verificar el estado de autenticación
  useEffect(() => {
    if (user) {
      console.log('TabsLayout - User Info:', {
        id: user.id,
        email: user.email,
        role: user.role,
        parkingId: user.parkingId,
        isAdmin,
        isOperator,
        isAdminOrOperator
      });
    }
  }, [user, isAdmin, isOperator, isAdminOrOperator]);

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

  // Configuración común de tabs
  const commonScreenOptions = {
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
  };

  // Banner de sin conexión
  const OfflineBanner = () => (
    <View className="bg-red-500 px-4 py-2">
      <Text className="text-white text-center font-primary text-sm">
        Sin conexión a Internet - Modo offline
      </Text>
    </View>
  );

  // TABS PARA ADMIN/OPERATOR
  if (isAdminOrOperator) {
    return (
      <View className="flex-1 bg-axia-black">
        {!isConnected && <OfflineBanner />}
        <Tabs screenOptions={commonScreenOptions}>
          {/* Inicio */}
          <Tabs.Screen
            name="home/index"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color }) => (
                <Ionicons name="home-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
              ),
            }}
          />
          
          {/* Mi Parqueo (reemplaza la tab de Parkings para admins) */}
          <Tabs.Screen
            name="parkings"
            options={{
              title: 'Mi Parqueo',
              tabBarIcon: ({ color }) => (
                <Ionicons name="business-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
              ),
            }}
          />
          
          {/* Reservas */}
          <Tabs.Screen
            name="reservations"
            options={{
              title: 'Reservas',
              tabBarIcon: ({ color }) => (
                <Ionicons name="calendar-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
              ),
            }}
          />

          {/* Usuarios (reemplaza la tab de Profile para admins) */}
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Usuarios',
              tabBarIcon: ({ color }) => (
                <Ionicons name="people-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
              ),
            }}
          />
          
          {/* Ajustes */}
          <Tabs.Screen
            name="settings/index"
            options={{
              title: 'Ajustes',
              tabBarIcon: ({ color }) => (
                <Ionicons name="settings-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
              ),
            }}
          />

          {/* Ocultar ruta de edición de parkings (solo accesible desde el botón editar) */}
          <Tabs.Screen
            name="parkings/edit"
            options={{ href: null }}
          />

          {/* Ocultar payments si existe */}
          <Tabs.Screen
            name="payments"
            options={{ href: null }}
          />
        </Tabs>
      </View>
    );
  }

  // TABS PARA USUARIOS NORMALES
  return (
    <View className="flex-1 bg-axia-black">
      {!isConnected && <OfflineBanner />}
      <Tabs screenOptions={commonScreenOptions}>
        {/* Inicio */}
        <Tabs.Screen
          name="home/index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
            ),
          }}
        />
        
        {/* Parqueos (buscar y reservar) */}
        <Tabs.Screen
          name="parkings"
          options={{
            title: 'Parqueos',
            tabBarIcon: ({ color }) => (
              <Ionicons name="car-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
            ),
          }}
        />
        
        {/* Reservas */}
        <Tabs.Screen
          name="reservations"
          options={{
            title: 'Reservas',
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
            ),
          }}
        />
        
        {/* Perfil */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-circle-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
            ),
          }}
        />
        
        {/* Ajustes */}
        <Tabs.Screen
          name="settings/index"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={34} color={color} style={{ marginBottom: -10 }}/>
            ),
          }}
        />

        {/* Ocultar todas las sub-rutas de settings para usuarios normales */}
        <Tabs.Screen
          name="settings/parking-info/index"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="settings/parking-info/edit"
          options={{ href: null }}
        />

        {/* Ocultar payments si existe */}
        <Tabs.Screen
          name="payments"
          options={{ href: null }}
        />
      </Tabs>
    </View>
  );
}
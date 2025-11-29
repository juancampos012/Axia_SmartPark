import React from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../../context/AuthContext';

const SettingsScreen = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: async () => await Haptics.selectionAsync(),
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    danger = false 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress: () => void;
    showChevron?: boolean;
    danger?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 px-6 active:bg-axia-gray/20 border-b border-axia-gray/20`}
    >
      <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 ${danger ? 'bg-error/20' : 'bg-axia-green/20'} rounded-xl items-center justify-center mr-4`}>
          <Ionicons name={icon as any} size={20} color={danger ? '#dc2626' : '#006B54'} />
        </View>
        <View className="flex-1">
          <Text className={`${danger ? 'text-error' : 'text-white'} text-base font-primary`}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-axia-gray text-xs font-primary mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pt-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-white text-3xl font-primaryBold mb-2">
              Ajustes
            </Text>
            <Text className="text-axia-gray text-base font-primary">
              Configuración de la aplicación
            </Text>
          </View>

          {/* Información de Usuario */}
          <View className="mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Información de Cuenta
            </Text>
            <View className="bg-axia-darkGray rounded-2xl overflow-hidden">
              <View className="p-6">
                <View className="flex-row items-center mb-4">
                  <View className="w-16 h-16 bg-axia-green/20 rounded-full items-center justify-center mr-4">
                    <Ionicons name="person" size={32} color="#006B54" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-lg font-primaryBold">
                      {user?.name} {user?.lastName}
                    </Text>
                    <Text className="text-axia-gray text-sm font-primary">
                      {user?.email}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center bg-axia-green/10 px-4 py-2 rounded-full self-start">
                  <Ionicons 
                    name={user?.role === 'ADMIN' ? 'shield-checkmark' : 'briefcase'} 
                    size={16} 
                    color="#10B981" 
                  />
                  <Text className="text-axia-green text-sm font-primaryBold ml-2">
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Operador'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Configuración de Aplicación */}
          <View className="mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Configuración
            </Text>
            <View className="bg-axia-darkGray rounded-2xl overflow-hidden">
              <MenuItem
                icon="notifications-outline"
                title="Notificaciones"
                subtitle="Gestionar notificaciones push"
                onPress={async () => {
                  await Haptics.selectionAsync();
                  Alert.alert(
                    'Notificaciones',
                    'Las notificaciones están activas para recordatorios de reservas y pagos.'
                  );
                }}
              />
              <MenuItem
                icon="language-outline"
                title="Idioma"
                subtitle="Español"
                onPress={async () => {
                  await Haptics.selectionAsync();
                  Alert.alert(
                    'Idioma',
                    'Actualmente solo está disponible el idioma Español.'
                  );
                }}
              />
              <MenuItem
                icon="contrast-outline"
                title="Tema"
                subtitle="Oscuro (Por defecto)"
                onPress={async () => {
                  await Haptics.selectionAsync();
                  Alert.alert(
                    'Tema',
                    'La aplicación utiliza tema oscuro por defecto para mejor visibilidad.'
                  );
                }}
              />
            </View>
          </View>

          {/* Información y Soporte */}
          <View className="mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Información
            </Text>
            <View className="bg-axia-darkGray rounded-2xl overflow-hidden">
              <MenuItem
                icon="information-circle-outline"
                title="Acerca de"
                subtitle="Versión 1.0.0"
                onPress={async () => {
                  await Haptics.selectionAsync();
                  Alert.alert(
                    'Axia SmartPark',
                    'Versión 1.0.0\n\nSistema de gestión de parqueaderos inteligente.\n\n© 2025 Axia SmartPark'
                  );
                }}
              />
              <MenuItem
                icon="document-text-outline"
                title="Términos y Condiciones"
                subtitle="Políticas de uso"
                onPress={async () => {
                  await Haptics.selectionAsync();
                  // Aquí podrías navegar a la pantalla de términos si existe
                  Alert.alert(
                    'Términos y Condiciones',
                    'Accede a nuestros términos y condiciones desde el perfil de usuario.'
                  );
                }}
              />
              <MenuItem
                icon="shield-checkmark-outline"
                title="Política de Privacidad"
                subtitle="Protección de datos"
                onPress={async () => {
                  await Haptics.selectionAsync();
                  // Aquí podrías navegar a la pantalla de privacidad si existe
                  Alert.alert(
                    'Política de Privacidad',
                    'Accede a nuestra política de privacidad desde el perfil de usuario.'
                  );
                }}
              />
            </View>
          </View>

          {/* Cerrar Sesión */}
          <View className="mb-8">
            <View className="bg-axia-darkGray rounded-2xl overflow-hidden">
              <MenuItem
                icon="log-out-outline"
                title="Cerrar Sesión"
                subtitle="Salir de tu cuenta"
                onPress={handleLogout}
                showChevron={false}
                danger={true}
              />
            </View>
          </View>

          {/* Footer Info */}
          <View className="items-center py-8">
            <Text className="text-axia-gray text-sm font-primary text-center">
              Axia SmartPark
            </Text>
            <Text className="text-axia-gray text-xs font-primary text-center mt-1">
              Sistema de gestión de parqueaderos
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import SettingsSection from '../../../components/organisms/settings/SettingsSection';
import { SettingsItemProps } from '../../../components/organisms/settings/SettingsItem';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.navigate('/(auth)');
            } catch (error: any) {
              Alert.alert("Error", error.message || "Ocurrió un error al cerrar sesión");
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    // TODO: Implementar cambio de contraseña
    Alert.alert("Información", "Funcionalidad de cambio de contraseña próximamente");
  };

  const handleLanguageChange = () => {
    // TODO: Implementar cambio de idioma
    Alert.alert("Información", "Funcionalidad de cambio de idioma próximamente");
  };

  const handlePrivacyPolicy = () => {
    // TODO: Navegar a política de privacidad
    Alert.alert("Información", "Política de privacidad próximamente");
  };

  const handleTermsAndConditions = () => {
    // TODO: Navegar a términos y condiciones
    Alert.alert("Información", "Términos y condiciones próximamente");
  };

  const handleRateApp = () => {
    // TODO: Abrir store para calificar app
    Alert.alert("Información", "Funcionalidad de calificación próximamente");
  };

  // Account section items
  const accountItems: SettingsItemProps[] = [
    {
      icon: 'key-outline',
      label: 'Cambiar contraseña',
      onPress: handleChangePassword,
      rightElement: 'chevron',
    },
    {
      icon: 'log-out-outline',
      label: 'Cerrar sesión',
      onPress: handleLogout,
      rightElement: 'chevron',
    },
  ];

  // Application section items
  const applicationItems: SettingsItemProps[] = [
    {
      icon: 'globe-outline',
      label: 'Idioma',
      onPress: handleLanguageChange,
      rightElement: 'text',
      rightText: 'Español',
    },
    {
      icon: 'moon-outline',
      label: 'Tema',
      rightElement: 'switch',
      switchValue: isDarkMode,
      onSwitchChange: setIsDarkMode,
    },
    {
      icon: 'notifications-outline',
      label: 'Notificaciones',
      rightElement: 'switch',
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      icon: 'lock-closed-outline',
      label: 'Política de privacidad',
      onPress: handlePrivacyPolicy,
      rightElement: 'chevron',
    },
    {
      icon: 'document-text-outline',
      label: 'Términos y condiciones',
      onPress: handleTermsAndConditions,
      rightElement: 'chevron',
    },
    {
      icon: 'star-outline',
      label: 'Califica nuestra app',
      onPress: handleRateApp,
      rightElement: 'chevron',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with User Profile */}
        <View className="px-4 py-6 items-center">
          <Image
            source={require('../../../assets/icon.png')}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-white text-xl font-semibold font-secondary">
            {user?.name || 'Usuario'}
          </Text>
          <Text className="text-axia-gray text-sm font-primary mt-1">
            {user?.email || 'email@example.com'}
          </Text>
        </View>

        {/* Settings Sections */}
        <View className="px-4 pb-8">
          <SettingsSection title="Cuenta" items={accountItems} />
          <SettingsSection title="Aplicación" items={applicationItems} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
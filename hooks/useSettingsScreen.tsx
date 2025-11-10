import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { SettingsItemProps } from '../components/organisms/settings/SettingsItem';

export const useSettingsScreen = () => {
  const { user, signOut, isAdminOrOperator } = useAuth();
  
  // Estados
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Handlers
  const handleLogout = useCallback(async () => {
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
  }, [signOut]);

  const handleChangePassword = useCallback(() => {
    Alert.alert("Información", "Funcionalidad de cambio de contraseña próximamente");
  }, []);

  const handleLanguageChange = useCallback(() => {
    Alert.alert("Información", "Funcionalidad de cambio de idioma próximamente");
  }, []);

  const handlePrivacyPolicy = useCallback(() => {
    Alert.alert("Información", "Política de privacidad próximamente");
  }, []);

  const handleTermsAndConditions = useCallback(() => {
    Alert.alert("Información", "Términos y condiciones próximamente");
  }, []);

  const handleRateApp = useCallback(() => {
    Alert.alert("Información", "Funcionalidad de calificación próximamente");
  }, []);

  const handleParkingInfo = useCallback(() => {
    // Navegar a la tab de parkings
    router.push('/(tabs)/parkings');
  }, []);

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
    // Solo mostrar opción de parqueadero para Admin/Operator
    ...(isAdminOrOperator ? [{
      icon: 'business-outline' as any,
      label: 'Mi parqueadero',
      onPress: handleParkingInfo,
      rightElement: 'chevron' as const,
    }] : []),
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

  // Valores computados
  const displayName = user?.name || 'Usuario';
  const displayEmail = user?.email || 'email@example.com';

  return {
    // Estados
    isDarkMode,
    notificationsEnabled,
    user,
    
    // Valores computados
    displayName,
    displayEmail,
    accountItems,
    applicationItems,
    
    // Handlers
    setIsDarkMode,
    setNotificationsEnabled,
    handleLogout,
    handleChangePassword,
    handleLanguageChange,
    handlePrivacyPolicy,
    handleTermsAndConditions,
    handleRateApp,
  };
};

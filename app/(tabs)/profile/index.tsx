import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

const ProfileRouter = () => {
  const { isAdminOrOperator, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-axia-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Si es admin/operator, redirigir a gestión de usuarios
  if (isAdminOrOperator) {
    return <Redirect href="/(tabs)/profile/users" />;
  }

  // Si es usuario normal, redirigir a perfil personal
  return <Redirect href="/(tabs)/profile/personal" />;
};

export default ProfileRouter;

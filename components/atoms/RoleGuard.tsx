import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../interfaces/User';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

/**
 * Componente de protección de rutas por roles
 * Renderiza los children solo si el usuario tiene uno de los roles permitidos
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { user, isAdmin, isOperator } = useAuth();

  // Log para depuración
  console.log('🛡️ RoleGuard - Check:', {
    userRole: user?.role,
    allowedRoles,
    isAdmin,
    isOperator,
    hasAccess: user && allowedRoles.includes(user.role)
  });

  // Si no hay usuario o no tiene un rol permitido, mostrar fallback
  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <View className="flex-1 items-center justify-center bg-axia-black p-6">
        <Text className="text-white text-center font-primary text-lg mb-2">
          Acceso Denegado
        </Text>
        <Text className="text-gray-400 text-center font-primary text-sm">
          No tienes permisos para acceder a esta sección.
        </Text>
      </View>
    );
  }

  // Usuario autorizado, renderizar children
  return <>{children}</>;
};

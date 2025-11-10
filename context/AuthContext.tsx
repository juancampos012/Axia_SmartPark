import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from 'expo-network';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserData, removeUserData, saveUserData, fetchUserProfile, updateUserProfile as updateUserProfileAPI } from "../libs/user";
import { refreshToken as refreshAuthToken, logout as logoutAuth } from "../libs/auth";
import { getTimeUntilRefresh, isJWTExpired } from "../utils/jwtUtils";
import { AuthUserData } from "../interfaces/Auth";
import { UserUpdateDTO } from "../interfaces/User";

type AuthContextType = {
  user: AuthUserData | null;
  loading: boolean;
  isConnected: boolean;
  parkingId: string | null;
  signIn: (user: AuthUserData, accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateUserProfile: (data: UserUpdateDTO) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOperator: boolean;
  isAdminOrOperator: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConnected: true,
  parkingId: null,
  signIn: async () => {},
  signOut: async () => {},
  refreshUserProfile: async () => {},
  updateUserProfile: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isOperator: false,
  isAdminOrOperator: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false); // Bandera para evitar múltiples refreshes
  const router = useRouter();

  // Computed values
  const parkingId = user?.parkingId || null;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isOperator = user?.role === 'OPERATOR';
  const isAdminOrOperator = isAdmin || isOperator;

  // Debug logging cuando cambia el usuario
  useEffect(() => {
    if (user) {
      console.log('👤 AuthContext - User State Updated:', {
        id: user.id,
        email: user.email,
        role: user.role,
        parkingId: user.parkingId,
        isAdmin,
        isOperator,
        isAdminOrOperator
      });
    } else {
      console.log('👤 AuthContext - No user authenticated');
    }
  }, [user, isAdmin, isOperator, isAdminOrOperator]);

  // Verificar conexión a Internet
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setIsConnected(networkState.isConnected ?? false);
      } catch (error) {
        console.error('Error checking network:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
    // Verificar conexión cada 10 segundos
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  // Cargar usuario del storage al iniciar
  useEffect(() => {
    (async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
        
        // Si hay usuario, iniciar el timer de refresh automático
        if (userData) {
          startAutoRefreshTimer();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    })();
    
    // Cleanup: limpiar timer al desmontar
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Auto-refresh de tokens antes de que expiren
  // Calcula dinámicamente cuándo refrescar basándose en el token actual
  const startAutoRefreshTimer = async () => {
    // Limpiar timer existente si hay
    if (refreshTimerRef.current) {
      console.log('Timer ya existe, limpiando antes de crear uno nuevo');
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    try {
      // Obtener el token actual
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        console.log('No hay accessToken, no se puede iniciar auto-refresh');
        return;
      }

      // Verificar si el token ya expiró
      const expired = isJWTExpired(accessToken);
      if (expired === true) {
        console.log('Token ya expiró, haciendo refresh inmediato');
        // Hacer refresh inmediato
        try {
          await refreshAuthToken();
          // Reintentar iniciar el timer con el nuevo token
          startAutoRefreshTimer();
        } catch (error) {
          console.error('Error en refresh inmediato:', error);
          await signOut();
        }
        return;
      }

      // Calcular cuánto tiempo falta para hacer refresh (2 min antes de expirar)
      const timeUntilRefresh = getTimeUntilRefresh(accessToken);
      if (timeUntilRefresh === null) {
        console.error('No se pudo calcular tiempo de refresh');
        return;
      }

      // Convertir a minutos para el log
      const minutesUntilRefresh = Math.round(timeUntilRefresh / 60000);
      console.log(`Auto-refresh timer iniciado: renovará en ${minutesUntilRefresh} minutos (${timeUntilRefresh}ms)`);

      refreshTimerRef.current = setTimeout(async () => {
        // Verificar si ya hay un refresh en progreso
        if (isRefreshingRef.current) {
          console.log('Ya hay un refresh en progreso, saltando...');
          return;
        }

        try {
          isRefreshingRef.current = true;
          
          const networkState = await Network.getNetworkStateAsync();
          if (!networkState.isConnected) {
            console.log('Sin conexión, saltando auto-refresh');
            // Reintentar en 2 minutos
            isRefreshingRef.current = false;
            refreshTimerRef.current = null;
            setTimeout(() => startAutoRefreshTimer(), 2 * 60 * 1000);
            return;
          }

          console.log('Ejecutando auto-refresh de tokens...');
          const newTokens = await refreshAuthToken();
          console.log('Tokens renovados automáticamente');
          
          // IMPORTANTE: Limpiar flags antes de crear nuevo timer
          isRefreshingRef.current = false;
          refreshTimerRef.current = null;
          
          // Reiniciar el timer para el próximo refresh
          await startAutoRefreshTimer();
        } catch (error) {
          console.error(' Error en auto-refresh:', error);
          
          // Limpiar flags
          isRefreshingRef.current = false;
          refreshTimerRef.current = null;
          
          // Si falla el refresh, la sesión probablemente expiró
          // Limpiar todo y redirigir al login
          await signOut();
          Alert.alert(
            'Sesión Expirada',
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
            [{ text: 'Entendido', onPress: () => router.replace('/(auth)/login') }]
          );
        }
      }, timeUntilRefresh);
    } catch (error) {
      console.error('Error iniciando auto-refresh timer:', error);
    }
  };

  // Detener el timer de auto-refresh
  const stopAutoRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
      console.log('Auto-refresh timer detenido');
    }
  };

  // Verificar conexión antes de operaciones de red
  const checkNetworkBeforeAction = async (actionName: string): Promise<boolean> => {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected) {
      Alert.alert(
        "Sin conexión a Internet",
        `No se puede ${actionName} sin conexión a Internet. Por favor, verifica tu conexión.`,
        [{ text: "Entendido" }]
      );
      return false;
    }
    return true;
  };

  // Función para hacer login
  const signIn = async (userData: AuthUserData, accessToken: string, refreshToken: string) => {
    // No verificamos red aquí porque el login ya se completó exitosamente
    try {
      console.log('AuthContext - SignIn called with:', {
        userId: userData.id,
        email: userData.email,
        role: userData.role,
        parkingId: userData.parkingId,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });
      
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await saveUserData(userData);
      setUser(userData);
      
      // Iniciar el timer de auto-refresh
      startAutoRefreshTimer();
      
    } catch (error) {
      throw error;
    }
  };

  // Función para hacer logout
  const signOut = async () => {
    try {
      // Detener el timer de auto-refresh
      stopAutoRefreshTimer();
      
      // Llamar al endpoint de logout del backend
      // Esta función internamente maneja el POST /auth/logout y limpia AsyncStorage
      await logoutAuth();
      
      // Limpiar el estado del usuario
      setUser(null);
      
      console.log('Logout exitoso (frontend y backend)');
    } catch (error) {
      console.error('Error in signOut:', error);
      
      // Aunque falle el logout del backend, limpiar el estado local
      // (logoutAuth ya limpia AsyncStorage incluso si falla el POST)
      setUser(null);
      
      // Re-lanzar el error para que el componente que llama pueda manejarlo si es necesario
      throw error;
    }
  };

  // Función para refrescar el perfil del usuario desde la API
  const refreshUserProfile = async () => {
    if (!(await checkNetworkBeforeAction("actualizar el perfil"))) return;
    
    try {
      const freshProfile = await fetchUserProfile();
      setUser(freshProfile);
      await saveUserData(freshProfile);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  // Función para actualizar el perfil del usuario
  const updateUserProfile = async (data: UserUpdateDTO) => {
    if (!(await checkNetworkBeforeAction("actualizar el perfil"))) return;
    
    try {
      const updatedProfile = await updateUserProfileAPI(data);
      setUser(updatedProfile);
      await saveUserData(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isConnected,
        parkingId,
        signIn, 
        signOut, 
        refreshUserProfile,
        updateUserProfile,
        isAuthenticated,
        isAdmin,
        isOperator,
        isAdminOrOperator
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

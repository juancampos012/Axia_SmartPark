import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from 'expo-network';
import { Alert } from 'react-native';
import { getUserData, removeUserData, saveUserData, fetchUserProfile, updateUserProfile as updateUserProfileAPI } from "../libs/user";
import { AuthUserData } from "../interfaces/Auth";
import { UserUpdateDTO } from "../interfaces/User";

type AuthContextType = {
  user: AuthUserData | null;
  loading: boolean;
  isConnected: boolean;
  signIn: (user: AuthUserData, accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateUserProfile: (data: UserUpdateDTO) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConnected: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshUserProfile: async () => {},
  updateUserProfile: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

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
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await saveUserData(userData);
      setUser(userData);
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };

  // Función para hacer logout
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await removeUserData();
      setUser(null);
    } catch (error) {
      console.error('Error in signOut:', error);
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

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isConnected,
        signIn, 
        signOut, 
        refreshUserProfile,
        updateUserProfile,
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

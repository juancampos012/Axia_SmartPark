// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserData, removeUserData, saveUserData, fetchUserProfile, updateUserProfile as updateUserProfileAPI } from "../libs/user";
import { AuthUserData } from "../interfaces/Auth";
import { UserUpdateDTO } from "../interfaces/User";

type AuthContextType = {
  user: AuthUserData | null;
  loading: boolean;
  signIn: (user: AuthUserData, accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateUserProfile: (data: UserUpdateDTO) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshUserProfile: async () => {},
  updateUserProfile: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUserData | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  const signIn = async (userData: AuthUserData, accessToken: string, refreshToken: string) => {
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

  const signOut = async () => {
    console.log("Signing out...");
    try {
      await AsyncStorage.removeItem("accessToken");
      console.log("Access token removed");
      await AsyncStorage.removeItem("refreshToken");
      await removeUserData();
      setUser(null);
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    try {
      const freshProfile = await fetchUserProfile();
      setUser(freshProfile);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: UserUpdateDTO) => {
    try {
      const updatedProfile = await updateUserProfileAPI(data);
      setUser(updatedProfile);
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
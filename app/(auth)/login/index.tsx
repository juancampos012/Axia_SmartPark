import React, { useEffect } from "react";
import { View, Text, SafeAreaView, Pressable, Image, KeyboardAvoidingView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginForm from "../../../src/components/organisms/forms/LoginForm";

const AxiaSmartParkLogo = require("../../../assets/axia-sp1.png");

export default function Login() {
  const router = useRouter();

  // 👉 Revisa si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        router.replace("/home"); // Si ya está logueado → no mostrar login
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = async () => {
    // Simulación de login correcto
    await AsyncStorage.setItem("authToken", "fake_token_123");

    router.replace("/home");
  };

  const handleGoogleLogin = () => {
    console.log("Google login pressed");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 min-h-screen px-4 py-8">
            {/* Header con botón back */}
            <View className="flex-row items-start mb-4 mt-4">
              <Pressable onPress={() => router.back()} className="mt-2">
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>

              {/* Logo */}
              <View className="flex-1 items-center">
                <Image
                  source={AxiaSmartParkLogo}
                  className="w-72 h-72"
                  resizeMode="contain"
                />
              </View>

              <View className="w-6" />
            </View>

            {/* Título */}
            <View className="items-center mb-8">
              <Text className="text-white text-3xl font-normal">
                Iniciar sesión
              </Text>
            </View>

            {/* Formulario */}
            <LoginForm
              onSignUpPress={() => router.push("/register")}
              onGooglePress={handleGoogleLogin}
              onFacebookPress={handleFacebookLogin}
              onSuccess={handleLoginSuccess} // 👈 cuando loguee
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

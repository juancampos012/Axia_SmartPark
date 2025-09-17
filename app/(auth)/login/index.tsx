import React from 'react';
import { View, Text, Image, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoginForm from '../../../src/components/organisms/forms/LoginForm';

// Importar el logo
const AxiaSmartParkLogo = require('../../../assets/axia-sp1.png');

const Login = () => {
  const router = useRouter();

  

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
    // Lógica de login con Google
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login pressed');
    // Lógica de login con Facebook
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior="padding"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 min-h-screen px-4 py-8">
            
            {/* Header con botón de back */}
            <View className="flex-row items-start mb-4 mt-4">
              <TouchableOpacity 
                onPress={handleGoBack}
                className="mt-2"
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              {/* Logo centrado */}
              <View className="flex-1 items-center">
                <Image
                  source={AxiaSmartParkLogo}
                  className="w-72 h-72"
                  resizeMode="contain"
                />
              </View>
              
              {/* Spacer para balance */}
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
              onSignUpPress={() => {}}
              onGooglePress={handleGoogleLogin}
              onFacebookPress={handleFacebookLogin}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RegisterForm from '../../../src/components/forms/RegisterForm';

// Importar el logo
const AxiaSmartParkLogo = require('../../../assets/axia-sp1.png');

const Register = () => {
  const router = useRouter();

  const handleRegister = (data: any) => {
    console.log('Datos de registro:', data);
    // Aquí iría la lógica de registro
    // Por ahora solo navegamos al login
    router.push('/(auth)/login');
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
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
              
              {/* Spacer para balance */}
              <View className="flex-1" />
            </View>

            {/* Contenedor centrado para logo y formulario */}
            <View className="flex-1 items-center justify-center">
              {/* Logo */}
              <Image
                source={AxiaSmartParkLogo}
                className="w-72 h-72 mb-8 mt-[-100]"
                resizeMode="contain"
              />  

              {/* Formulario */}
              <RegisterForm 
                onSubmit={handleRegister}
                onLoginPress={handleLoginPress}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
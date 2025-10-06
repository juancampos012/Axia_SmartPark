import React from 'react';
import { View, Image, ScrollView, SafeAreaView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RegisterForm from '../../../components/organisms/forms/RegisterForm';

// Importar el logo
const AxiaSmartParkLogo = require('../../../assets/axia-sp1.png');

const Register = () => {
  const router = useRouter();
  const onLoginPress = () => {
    router.push('/login');
  }

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 min-h-screen px-4 py-8">

            {/* Header con botón de back */}
            <View className="flex-row items-start mb-4 mt-4">
              <Pressable 
                onPress={handleGoBack}
                className="mt-2"
                accessibilityLabel="Volver"
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              
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
              <RegisterForm onSubmit={() => {}} onLoginPress={onLoginPress} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

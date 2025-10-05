import React from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LoginForm from '../../../components/organisms/forms/LoginForm';

const Login = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login pressed');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 px-6 py-8 justify-start">
            
            {/* Header con botón de back */}
            <View className="absolute top-12 left-6 z-10">
              <Pressable 
                onPress={handleGoBack}
                className="w-10 h-10 rounded-full bg-axia-darkGray items-center justify-center"
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Logo y título */}
            <View className="items-center mb-12 mt-16">
              <Text className="text-white text-3xl font-primaryBold text-center">
                Iniciar Sesión
              </Text>
              <Text className="text-axia-gray text-base font-primary text-center">
                Ingresa a tu cuenta para continuar
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
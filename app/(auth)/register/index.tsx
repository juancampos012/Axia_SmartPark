import React from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RegisterForm from '../../../components/organisms/forms/RegisterForm';

const Register = () => {
  const router = useRouter();

  const onLoginPress = () => {
    router.push('/login');
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
          <View className="flex-1 px-6 py-8">
            
            {/* Header con botón de back */}
            <View className="flex-row items-center mb-6">
              <Pressable 
                onPress={handleGoBack}
                className="w-10 h-10 rounded-full bg-axia-darkGray/50 items-center justify-center active:scale-95"
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Logo y título */}
            <View className="items-center mb-8">

              
              <Text className="text-white text-4xl font-primaryBold mb-2 text-center">
                Crear Cuenta
              </Text>
              <Text className="text-axia-gray text-lg font-primary text-center">
                Únete a la comunidad Axia SmartPark
              </Text>
            </View>

            {/* Formulario */}
            <View className="flex-1">
              <RegisterForm onSubmit={() => {}} onLoginPress={onLoginPress} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
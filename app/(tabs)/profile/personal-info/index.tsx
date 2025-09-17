import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PersonalInfoForm from '../../../../src/components/forms/PersonalInfoForm';
import { useForm } from 'react-hook-form';

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  identification: string;
  dateOfBirth: string;
}

const PersonalInfo = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Datos actuales del usuario (normalmente vendrían de un estado global o API)
  const currentUserData: PersonalInfoFormData = {
    firstName: 'Fernando',
    lastName: 'Alonso',
    email: 'fernando.alonso@email.com',
    phone: '+57 300 123 4567',
    identification: '12345678',
    dateOfBirth: '29/07/1981'
  };

  const { control, handleSubmit, formState: { errors }, reset } = useForm<PersonalInfoFormData>({
    defaultValues: currentUserData
  });

  const handleGoBack = () => {
    router.push('/(tabs)/profile');
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = (data: PersonalInfoFormData) => {
    console.log('Saving personal info:', data);
    
    // Aquí iría la lógica para guardar los datos en la API
    // Por ahora solo mostramos un alert de éxito
    Alert.alert(
      'Información actualizada',
      'Tu información personal ha sido actualizada correctamente.',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            // Aquí actualizarías el estado global con los nuevos datos
          }
        }
      ]
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            console.log('Account deletion confirmed');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior="padding"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-4 py-8">
            
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity
                onPress={handleGoBack}
                className="p-2"
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <Text className="text-white text-xl font-semibold">
                Información Personal
              </Text>
              
              <TouchableOpacity
                onPress={handleEditPress}
                className="p-2"
              >
                <Ionicons 
                  name={isEditing ? "close" : "create-outline"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
            </View>

            {/* Foto de perfil */}
            <View className="items-center mb-8">
              <View className="w-36 h-36 rounded-full border-2 border-axia-green bg-axia-darkGray items-center justify-center mb-4">
                <Ionicons name="person" size={60} color="#FFFFFF" />
              </View>
              
              {isEditing && (
                <TouchableOpacity className="bg-axia-green px-4 py-2 rounded-lg">
                  <Text className="text-axia-black font-semibold">
                    Cambiar foto
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Formulario */}
            <PersonalInfoForm
              initialData={currentUserData}
              isEditing={isEditing}
              onSubmit={handleSaveChanges}
              onCancel={handleCancelEdit}
            />

            <View className="mt-12 pt-8 border-t border-axia-darkGray">
              <TouchableOpacity
                onPress={handleDeleteAccount}
                className="items-center"
              >
                <Text className="text-red-500 text-base font-medium underline">
                  Eliminar cuenta
                </Text>
              </TouchableOpacity>
              
              <Text className="text-axia-gray text-sm text-center mt-2">
                Esta acción no se puede deshacer
              </Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInfo;
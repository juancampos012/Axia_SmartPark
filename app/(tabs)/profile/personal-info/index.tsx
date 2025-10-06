import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Pressable, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PersonalInfoForm from '../../../../components/organisms/forms/PersonalInfoForm';
import { useAuth } from '../../../../context/AuthContext';
import { deleteUserAccount } from '../../../../libs/user';

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
}

const PersonalInfo = () => {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<PersonalInfoFormData | null>(null);

  // Sincronizar userData con el user del contexto
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        active: user.isVerified || false,
        createdAt: user.createdAt?.toString() || ''
      });
    }
  }, [user]);

  const handleGoBack = () => {
    router.push('/(tabs)/profile');
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async (data: PersonalInfoFormData) => {
    try {
      console.log('Saving personal info:', data);
      
      // Usar la función del contexto
      await updateUserProfile({
        name: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone
      });

      Alert.alert(
        'Información actualizada',
        'Tu información personal ha sido actualizada correctamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsEditing(false);
              // El user ya está actualizado en el contexto
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar la información');
    }
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
          onPress: async () => {
            try {
              await deleteUserAccount();
              Alert.alert(
                'Cuenta eliminada',
                'Tu cuenta ha sido eliminada correctamente.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      router.replace('/');
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'No se pudo eliminar la cuenta');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-4 py-8">
            
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <Pressable onPress={handleGoBack} className="p-2">
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              
              <Text className="text-white text-xl font-semibold">
                Información Personal
              </Text>
              
              <Pressable onPress={handleEditPress} className="p-2">
                <Ionicons 
                  name={isEditing ? "close" : "create-outline"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </Pressable>
            </View>

            {/* Foto de perfil */}
            <View className="items-center mb-8">
              <View className="w-36 h-36 rounded-full border-2 border-axia-green bg-axia-darkGray items-center justify-center mb-4">
                <Ionicons name="person" size={60} color="#FFFFFF" />
              </View>
              
              {/* {isEditing && (
                <Pressable className="bg-axia-green px-4 py-2 rounded-lg">
                  <Text className="text-axia-black font-semibold">
                    Cambiar foto
                  </Text>
                </Pressable>
              )} */}
            </View>

            {/* Formulario */}
            {!user ? (
              <View className="flex-1 items-center justify-center py-12">
                <Text className="text-white text-lg">Cargando...</Text>
              </View>
            ) : userData ? (
              <PersonalInfoForm
                initialData={userData}
                isEditing={isEditing}
                onSubmit={handleSaveChanges}
                onCancel={handleCancelEdit}
              />
            ) : (
              <View className="flex-1 items-center justify-center py-12">
                <Text className="text-white text-lg">No se pudo cargar la información</Text>
              </View>
            )}

            <View className="mt-12 pt-8 border-t border-axia-darkGray">
              <Pressable onPress={handleDeleteAccount} className="items-center">
                <Text className="text-red-500 text-base font-medium underline">
                  Eliminar cuenta
                </Text>
              </Pressable>
              
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

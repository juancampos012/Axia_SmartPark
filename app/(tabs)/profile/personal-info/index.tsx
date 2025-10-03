import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Pressable, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PersonalInfoForm from '../../../../src/components/organisms/forms/PersonalInfoForm';
import { useForm } from 'react-hook-form';
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from '../../../../libs/user';

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
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<PersonalInfoFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await fetchUserProfile();
      const formData: PersonalInfoFormData = {
        firstName: profile.name || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phoneNumber || '',
        active: profile.isActive || false,
        createdAt: profile.createdAt || ''
      };
      setUserData(formData);
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const { control, handleSubmit, formState: { errors }, reset } = useForm<PersonalInfoFormData>({
    defaultValues: userData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      active: true,
      createdAt: ''
    }
  });

  const handleGoBack = () => {
    router.push('/(tabs)/profile');
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async (data: PersonalInfoFormData) => {
    try {
      console.log('Saving personal info:', data);
      const updateData = {
        name: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phone
      };
      await updateUserProfile(updateData);
      Alert.alert(
        'Información actualizada',
        'Tu información personal ha sido actualizada correctamente.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsEditing(false);
              loadUserProfile();
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
            {loading ? (
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

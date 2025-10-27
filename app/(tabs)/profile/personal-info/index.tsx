import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PersonalInfoForm from '../../../../components/organisms/forms/PersonalInfoForm';
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
  const handleGoBack = () => {
    router.back();
  };

  const handleEditPress = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async (data: PersonalInfoFormData) => {
    try {
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
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 py-8">
            
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
              <Pressable 
                onPress={handleGoBack}
                className="w-10 h-10 rounded-full bg-axia-darkGray items-center justify-center active:scale-95"
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </Pressable>
              
              <Text className="text-white text-2xl font-primaryBold">
                Información Personal
              </Text>
              
              <Pressable 
                onPress={handleEditPress}
                className={`w-10 h-10 rounded-full items-center justify-center active:scale-95 ${
                  isEditing ? 'bg-red-500/20' : 'bg-axia-green/20'
                }`}
              >
                <Ionicons 
                  name={isEditing ? "close" : "create-outline"} 
                  size={20} 
                  color={isEditing ? "#EF4444" : "#10B981"} 
                />
              </Pressable>
            </View>

            {/* Foto de perfil */}
            <View className="items-center mb-8">
              <View className="relative mb-6">
                <View className="w-32 h-32 rounded-full border-4 border-axia-green/30 items-center justify-center">
                  <View className="w-28 h-28 rounded-full  items-center justify-center">
                    <Ionicons name="person" size={50} color="#10B981" />
                  </View>
                </View>
                
                {isEditing && (
                  <Pressable className="absolute -bottom-2 -right-2 w-10 h-10 bg-axia-green rounded-full items-center justify-center border-2 border-axia-black active:scale-95">
                    <Ionicons name="camera" size={18} color="#000000" />
                  </Pressable>
                )}
              </View>
              
              <View className="items-center">
                <Text className="text-white text-xl font-primaryBold mb-2">
                  {userData?.firstName} {userData?.lastName}
                </Text>
                <View className="flex-row items-center bg-axia-green/10 px-4 py-2 rounded-full">
                  <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                  <Text className="text-axia-green text-sm font-primaryBold ml-2">
                    Cuenta verificada
                  </Text>
                </View>
              </View>
            </View>

            {/* Estado de edición */}
            {isEditing && (
              <View className="bg-axia-green/10 rounded-2xl p-4 mb-6 border border-axia-green/20">
                <View className="flex-row items-center">
                  <Ionicons name="pencil" size={20} color="#10B981" />
                  <Text className="text-axia-green font-primaryBold ml-2">
                    Modo edición activado
                  </Text>
                </View>
                <Text className="text-axia-gray text-sm font-primary mt-1">
                  Puedes modificar tu información personal
                </Text>
              </View>
            )}

            {/* Formulario */}
            {loading ? (
              <View className="flex-1 items-center justify-center py-12">
                <View className="items-center">
                  <Ionicons name="person-circle-outline" size={48} color="#6B7280" />
                  <Text className="text-white text-lg font-primary mt-4">Cargando información...</Text>
                </View>
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
                <View className="items-center">
                  <Ionicons name="warning-outline" size={48} color="#EF4444" />
                  <Text className="text-white text-lg font-primary mt-4">Error al cargar la información</Text>
                </View>
              </View>
            )}

            {/* Sección de eliminación de cuenta */}
            <View className="mt-12 pt-8 border-t border-axia-gray/20">
              <View className="bg-axia-darkGray/50 rounded-2xl p-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="warning" size={24} color="#EF4444" />
                  <Text className="text-white font-primaryBold text-lg ml-3">
                    Zona de peligro
                  </Text>
                </View>
                <Text className="text-axia-gray text-sm font-primary mb-4 leading-5">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que esto es lo que realmente quieres.
                </Text>
                <Pressable 
                  onPress={handleDeleteAccount}
                  className="bg-red-500/10 py-4 rounded-xl items-center border border-red-500/30 active:scale-95"
                >
                  <Text className="text-red-400 font-primaryBold text-lg">
                    Eliminar cuenta permanentemente
                  </Text>
                </Pressable>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalInfo;
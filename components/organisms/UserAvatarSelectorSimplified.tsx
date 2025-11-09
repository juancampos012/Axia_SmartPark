/**
 * USER AVATAR SELECTOR SIMPLIFIED
 *
 * Componente para seleccionar avatar de perfil de usuario
 * - Carga avatares desde el backend dinámicamente
 * - Permite subir foto personalizada desde galería o cámara
 * - NO usa constantes locales (todo desde API)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  pickImageFromGallery,
  takePhotoWithCamera,
  uploadUserAvatar,
  fetchUserAvatars,
  selectPresetUserAvatar,
  UserAvatar,
} from '../../libs/upload';

// No necesitamos interface local, usamos la del libs/upload

interface UserAvatarSelectorSimplifiedProps {
  visible: boolean;
  currentImageUrl?: string;
  onClose: () => void;
  onSelect: (imageUrl: string, isCustom: boolean) => void;
}

export const UserAvatarSelectorSimplified: React.FC<UserAvatarSelectorSimplifiedProps> = ({
  visible,
  currentImageUrl,
  onClose,
  onSelect,
}) => {
  const [avatars, setAvatars] = useState<UserAvatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<UserAvatar | null>(null);
  const [uploadingCustom, setUploadingCustom] = useState(false);

  /**
   * Cargar avatares disponibles desde el backend
   */
  useEffect(() => {
    if (visible) {
      loadAvatars();
    }
  }, [visible]);

  const loadAvatars = async () => {
    try {
      setLoading(true);
      const result = await fetchUserAvatars();
      setAvatars(result);
    } catch (error) {
      console.error('Error loading user avatars:', error);
      Alert.alert('Error', 'No se pudieron cargar los avatares prediseñados');
      setAvatars([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar selección de avatar prediseñado
   */
  const handlePresetSelect = (avatar: UserAvatar) => {
    setSelectedAvatar(avatar);
  };

  /**
   * Confirmar selección de avatar prediseñado
   */
  const handleConfirmPreset = async () => {
    if (!selectedAvatar) return;

    try {
      // Primero actualizar la UI local
      onSelect(selectedAvatar.url, false);
      
      // Luego llamar al backend para persistir el cambio
      await selectPresetUserAvatar(selectedAvatar.url);
      
      Alert.alert('Éxito', 'Avatar actualizado correctamente');
      onClose();
    } catch (error) {
      console.error('Error selecting preset avatar:', error);
      Alert.alert('Error', 'No se pudo actualizar el avatar');
    }
  };

  /**
   * Subir foto personalizada desde galería
   */
  const handleUploadFromGallery = async () => {
    try {
      const image = await pickImageFromGallery();
      if (!image) return;

      setUploadingCustom(true);
      const result = await uploadUserAvatar(image.uri);

      if (result.success && result.data?.image.url) {
        // Actualizar UI local primero
        onSelect(result.data.image.url, true);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
        onClose();
      }
    } catch (error) {
      console.error('Error uploading from gallery:', error);
      Alert.alert('Error', 'No se pudo subir la imagen. Intenta de nuevo.');
    } finally {
      setUploadingCustom(false);
    }
  };

  /**
   * Subir foto personalizada desde cámara
   */
  const handleUploadFromCamera = async () => {
    try {
      const image = await takePhotoWithCamera();
      if (!image) return;

      setUploadingCustom(true);
      const result = await uploadUserAvatar(image.uri);

      if (result.success && result.data?.image.url) {
        // Actualizar UI local primero
        onSelect(result.data.image.url, true);
        Alert.alert('Éxito', 'Foto de perfil actualizada correctamente');
        onClose();
      }
    } catch (error) {
      console.error('Error uploading from camera:', error);
      Alert.alert('Error', 'No se pudo subir la imagen. Intenta de nuevo.');
    } finally {
      setUploadingCustom(false);
    }
  };

  /**
   * Mostrar opciones de carga personalizada
   */
  const handleCustomUpload = () => {
    Alert.alert(
      'Subir Foto',
      'Elige una opción',
      [
        {
          text: 'Galería',
          onPress: handleUploadFromGallery,
        },
        {
          text: 'Cámara',
          onPress: handleUploadFromCamera,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-axia-black">
        {/* Header */}
        <View className="px-6 py-4 border-b border-axia-darkGray/30">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xl font-primaryBold">
              Foto de Perfil
            </Text>
            <Pressable
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-axia-darkGray items-center justify-center active:scale-95"
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Avatar actual */}
          {currentImageUrl && (
            <View className="items-center mb-6">
              <Text className="text-white/60 text-sm font-primary mb-3">
                Avatar actual
              </Text>
              <Image
                source={{ uri: currentImageUrl }}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Botón de subir foto personalizada */}
          <Pressable
            onPress={handleCustomUpload}
            disabled={uploadingCustom}
            className="w-full bg-axia-green rounded-2xl p-6 mb-6 active:scale-98"
          >
            <View className="flex-row items-center justify-center">
              {uploadingCustom ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color="#000" />
                  <Text className="text-axia-black text-base font-primaryBold ml-3">
                    Subir Mi Propia Foto
                  </Text>
                </>
              )}
            </View>
          </Pressable>

          {/* Sección de avatares prediseñados */}
          {avatars.length > 0 && (
            <>
              <Text className="text-white text-lg font-primaryBold mb-4">
                O elige un avatar prediseñado
              </Text>

              {/* Grid de avatares */}
              {loading ? (
                <View className="py-12 items-center">
                  <ActivityIndicator color="#10B981" size="large" />
                  <Text className="text-white/60 text-sm font-primary mt-3">
                    Cargando avatares...
                  </Text>
                </View>
              ) : (
                <View className="flex-row flex-wrap justify-between">
                  {avatars.map((avatar) => (
                    <Pressable
                      key={avatar.id}
                      onPress={() => handlePresetSelect(avatar)}
                      className={`w-[30%] aspect-square rounded-full mb-4 items-center justify-center active:scale-95 ${
                        selectedAvatar?.id === avatar.id
                          ? 'border-4 border-axia-green'
                          : 'border-2 border-axia-darkGray'
                      }`}
                    >
                      <Image
                        source={{ uri: avatar.url }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                      />
                      {selectedAvatar?.id === avatar.id && (
                        <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-axia-green items-center justify-center border-2 border-axia-black">
                          <Ionicons name="checkmark" size={18} color="#000" />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}

          {/* Mensaje si no hay avatares prediseñados */}
          {!loading && avatars.length === 0 && (
            <View className="py-8 items-center">
              <Ionicons name="images-outline" size={48} color="#6B7280" />
              <Text className="text-white/60 text-sm font-primary mt-3 text-center">
                No hay avatares prediseñados disponibles.{'\n'}
                Sube tu propia foto usando el botón de arriba.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer con botón de guardar (solo si hay avatar seleccionado) */}
        {selectedAvatar && (
          <View className="px-6 py-4 border-t border-axia-darkGray/30">
            <Pressable
              onPress={handleConfirmPreset}
              className="w-full bg-axia-green rounded-xl py-4 items-center active:scale-98"
            >
              <Text className="text-axia-black text-base font-primaryBold">
                Guardar
              </Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default UserAvatarSelectorSimplified;

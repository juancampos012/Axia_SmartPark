/**
 * VEHICLE AVATAR SELECTOR - SIMPLIFIED VERSION
 *
 * Componente simplificado que obtiene avatares desde el backend
 * Permite elegir entre avatares prediseñados o subir foto personalizada
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
  uploadVehicleImage,
  fetchVehicleAvatars,
  selectPresetVehicleAvatar,
  VehicleAvatar,
} from '../../libs/upload';
import { smartCacheBusting } from '../../utils/imageUtils';

interface VehicleAvatarSelectorProps {
  visible: boolean;
  vehicleId: string;
  currentImageUrl?: string;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}

export const VehicleAvatarSelector: React.FC<VehicleAvatarSelectorProps> = ({
  visible,
  vehicleId,
  currentImageUrl,
  onClose,
  onSelect,
}) => {
  const [avatars, setAvatars] = useState<VehicleAvatar[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<VehicleAvatar | null>(null);
  const [uploadingCustom, setUploadingCustom] = useState(false);

  /**
   * Cargar avatares disponibles del backend
   */
  useEffect(() => {
    if (visible) {
      loadAvatars();
    }
  }, [visible]);

  const loadAvatars = async () => {
    try {
      setLoadingAvatars(true);
      const fetchedAvatars = await fetchVehicleAvatars();
      setAvatars(fetchedAvatars);
    } catch (error) {
      console.error('Error loading avatars:', error);
      Alert.alert('Error', 'No se pudieron cargar los avatares disponibles');
    } finally {
      setLoadingAvatars(false);
    }
  };

  /**
   * Manejar selección de avatar prediseñado
   */
  const handlePresetSelect = (avatar: VehicleAvatar) => {
    setSelectedAvatar(avatar);
  };

  /**
   * Confirmar selección de avatar prediseñado
   */
  const handleConfirmPreset = async () => {
    if (!selectedAvatar) return;

    try {
      setUploadingCustom(true);
      await selectPresetVehicleAvatar(vehicleId, selectedAvatar.url);
      onSelect(selectedAvatar.url);
      Alert.alert('Éxito', 'Avatar actualizado correctamente');
      onClose();
    } catch (error) {
      console.error('Error selecting preset avatar:', error);
      Alert.alert('Error', 'No se pudo actualizar el avatar');
    } finally {
      setUploadingCustom(false);
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
      const result = await uploadVehicleImage(vehicleId, image.uri);

      if (result.success && result.data?.image.url) {
        onSelect(result.data.image.url);
        Alert.alert('Éxito', 'Imagen subida correctamente');
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
      const result = await uploadVehicleImage(vehicleId, image.uri);

      if (result.success && result.data?.image.url) {
        onSelect(result.data.image.url);
        Alert.alert('Éxito', 'Imagen subida correctamente');
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
              Selecciona Avatar del Vehículo
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

          {/* Título de avatares prediseñados */}
          <Text className="text-white text-lg font-primaryBold mb-4">
            O elige un avatar prediseñado
          </Text>

          {/* Estado de carga */}
          {loadingAvatars ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator color="#10B981" size="large" />
              <Text className="text-axia-gray mt-4">Cargando avatares...</Text>
            </View>
          ) : avatars.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <Ionicons name="image-outline" size={48} color="#6B7280" />
              <Text className="text-axia-gray mt-4">No hay avatares disponibles</Text>
            </View>
          ) : (
            /* Grid de avatares */
            <View className="flex-row flex-wrap justify-between">
              {avatars.map((avatar) => (
                <Pressable
                  key={avatar.id}
                  onPress={() => handlePresetSelect(avatar)}
                  className={`w-[48%] aspect-square rounded-2xl mb-4 items-center justify-center active:scale-95 ${
                    selectedAvatar?.id === avatar.id
                      ? 'bg-axia-green'
                      : 'bg-axia-darkGray'
                  }`}
                >
                  <View className="w-full h-full p-4">
                    <Image
                      source={{ uri: smartCacheBusting(avatar.url) }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                  {selectedAvatar?.id === avatar.id && (
                    <View className="absolute top-2 right-2 w-8 h-8 rounded-full bg-axia-black items-center justify-center">
                      <Ionicons name="checkmark" size={18} color="#10B981" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer con botón de guardar */}
        {selectedAvatar && (
          <View className="px-6 py-4 border-t border-axia-darkGray/30">
            <Pressable
              onPress={handleConfirmPreset}
              disabled={uploadingCustom}
              className="w-full bg-axia-green rounded-xl py-4 items-center active:scale-98"
            >
              {uploadingCustom ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-axia-black text-base font-primaryBold">
                  Guardar
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default VehicleAvatarSelector;

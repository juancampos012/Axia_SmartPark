/**
 * UPLOAD UTILITIES
 *
 * Funciones helper para subir imágenes al servidor
 */

import { http } from './http-client';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

/**
 * Interface para avatar de usuario
 */
export interface UserAvatar {
  id: string;
  filename: string;
  url: string;
  style: 'male' | 'female' | 'neutral';
}

/**
 * Interface para avatar de vehículo
 */
export interface VehicleAvatar {
  id: string;
  filename: string;
  url: string;
  category: 'car' | 'sedan' | 'suv' | 'truck' | 'motorcycle';
}

/**
 * Interface para el resultado de upload
 */
export interface UploadResult {
  success: boolean;
  data?: {
    user?: any;
    vehicle?: any;
    image: {
      url: string;
      thumbnailUrl?: string;
      filename: string;
      size: number;
    };
  };
  message?: string;
  errors?: string[];
}

/**
 * Solicitar permisos de galería
 */
export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    alert('Lo sentimos, necesitamos permisos de acceso a la galería para esta función.');
    return false;
  }

  return true;
};

/**
 * Solicitar permisos de cámara
 */
export const requestCameraPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    alert('Lo sentimos, necesitamos permisos de acceso a la cámara para esta función.');
    return false;
  }

  return true;
};

/**
 * Seleccionar imagen de la galería
 */
export const pickImageFromGallery = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
  const hasPermission = await requestMediaLibraryPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1], // Cuadrado
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
};

/**
 * Tomar foto con la cámara
 */
export const takePhotoWithCamera = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
  const hasPermission = await requestCameraPermissions();
  if (!hasPermission) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1], // Cuadrado
    quality: 0.8,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
};

/**
 * Convertir URI a FormData
 */
const createFormData = (imageUri: string, fieldName: string = 'image'): FormData => {
  const formData = new FormData();

  // Obtener extensión del archivo
  const uriParts = imageUri.split('.');
  const fileType = uriParts[uriParts.length - 1];

  formData.append(fieldName, {
    uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  } as any);

  return formData;
};

/**
 * Subir avatar de usuario
 */
export const uploadUserAvatar = async (imageUri: string): Promise<UploadResult> => {
  try {
    const formData = createFormData(imageUri, 'avatar');
    const result = await http.postFormData('/users/avatar', formData);
    return result.data;
  } catch (error) {
    console.error('Error uploading user avatar:', error);
    throw error;
  }
};

/**
 * Subir imagen de vehículo
 */
export const uploadVehicleImage = async (vehicleId: string, imageUri: string): Promise<UploadResult> => {
  try {
    const formData = createFormData(imageUri, 'image');
    const result = await http.postFormData(`/vehicles/${vehicleId}/image`, formData);
    return result.data;
  } catch (error) {
    console.error('Error uploading vehicle image:', error);
    throw error;
  }
};

/**
 * Eliminar avatar de usuario (vuelve a default)
 */
export const removeUserAvatar = async (): Promise<boolean> => {
  try {
    await http.delete('/users/me/avatar');
    return true;
  } catch (error) {
    console.error('Error removing user avatar:', error);
    throw error;
  }
};

/**
 * Eliminar imagen de vehículo (vuelve a default)
 */
export const removeVehicleImage = async (vehicleId: string): Promise<boolean> => {
  try {
    await http.delete(`/vehicles/${vehicleId}/image`);
    return true;
  } catch (error) {
    console.error('Error removing vehicle image:', error);
    throw error;
  }
};

/**
 * Obtener lista de avatares de vehículos disponibles
 */
export const fetchVehicleAvatars = async (): Promise<VehicleAvatar[]> => {
  try {
    const result = await http.get('/vehicles/avatars/list');
    return result.data?.avatars || [];
  } catch (error) {
    console.error('Error fetching vehicle avatars:', error);
    throw error;
  }
};

/**
 * Obtener lista de avatares de usuario disponibles
 */
export const fetchUserAvatars = async (): Promise<UserAvatar[]> => {
  try {
    const result = await http.get('/users/avatars/list');
    return result.data?.avatars || [];
  } catch (error) {
    console.error('Error fetching user avatars:', error);
    throw error;
  }
};

/**
 * Seleccionar avatar prediseñado para vehículo
 * Actualiza el vehículo con la URL del avatar seleccionado
 */
export const selectPresetVehicleAvatar = async (
  vehicleId: string,
  avatarUrl: string
): Promise<any> => {
  try {
    const result = await http.put(`/vehicles/${vehicleId}`, { image: avatarUrl });
    return result.data;
  } catch (error) {
    console.error('Error selecting preset avatar:', error);
    throw error;
  }
};

/**
 * Seleccionar avatar prediseñado para usuario
 * Actualiza el usuario con la URL del avatar seleccionado
 */
export const selectPresetUserAvatar = async (
  avatarUrl: string
): Promise<any> => {
  try {
    const result = await http.put('/users/profile', { avatar: avatarUrl });
    return result.data;
  } catch (error) {
    console.error('Error selecting preset user avatar:', error);
    throw error;
  }
};

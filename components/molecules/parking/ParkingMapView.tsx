import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Linking, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface ParkingMapViewProps {
  latitude: number;
  longitude: number;
  parkingName: string;
  address: string;
  onClose?: () => void;
}

const ParkingMapView: React.FC<ParkingMapViewProps> = ({
  latitude,
  longitude,
  parkingName,
  address,
  onClose,
}) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para mostrarte en el mapa');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);

      // Calcular distancia
      const calculatedDistance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        latitude,
        longitude
      );
      setDistance(calculatedDistance);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const openNavigation = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = encodeURIComponent(parkingName);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
      });
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${parkingName}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Google Maps');
    });
  };

  const openInWaze = () => {
    const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir Waze. Asegúrate de tener la app instalada.');
    });
  };

  return (
    <View className="flex-1 bg-black">
      {onClose && (
        <View className="absolute top-12 left-5 right-5 z-10 flex-row justify-between">
          <Pressable 
            onPress={onClose} 
            className="w-10 h-10 rounded-full bg-black/70 items-center justify-center"
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={parkingName}
          description={address}
        >
          <View className="items-center">
            <View 
              className="w-10 h-10 rounded-full bg-axia-green items-center justify-center border-[3px] border-white"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                elevation: 4,
              }}
            >
              <Ionicons name="car" size={20} color="#FFFFFF" />
            </View>
          </View>
        </Marker>

        {userLocation && (
          <Marker coordinate={userLocation} title="Tu ubicación">
            <View 
              className="w-9 h-9 rounded-full bg-blue-500 items-center justify-center border-[3px] border-white"
              style={{
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
          </Marker>
        )}
      </MapView>

      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8">
        <View 
          className="bg-[#1F1F1F] rounded-2xl p-5"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <View className="flex-row justify-between items-start mb-4 gap-3">
            <View className="flex-1">
              <Text className="text-white text-lg font-primaryBold mb-1">{parkingName}</Text>
              <Text className="text-axia-gray text-sm font-primary">{address}</Text>
            </View>
            {distance !== null && (
              <View className="flex-row items-center bg-axia-green/20 px-3 py-1.5 rounded-xl flex-shrink-0">
                <Ionicons name="navigate" size={16} color="#10B981" />
                <Text className="text-axia-green text-[13px] font-primaryBold ml-1">
                  {distance.toFixed(1)} km
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row gap-2">
            <Pressable 
              className="flex-1 flex-row items-center justify-center bg-axia-green py-4 px-3 rounded-2xl gap-1.5"
              onPress={openNavigation}
              style={{
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <Ionicons name="navigate" size={18} color="#FFFFFF" />
              <Text className="text-white text-[15px] font-primaryBold">Ir ahora</Text>
            </Pressable>

            <Pressable 
              className="flex-1 flex-row items-center justify-center bg-[#2D2D2D] py-4 px-2 rounded-2xl gap-1 border border-axia-green"
              onPress={openInGoogleMaps}
            >
              <Ionicons name="map" size={16} color="#10B981" />
              <Text className="text-axia-green text-[13px] font-primarySemiBold">Maps</Text>
            </Pressable>

            <Pressable 
              className="flex-1 flex-row items-center justify-center bg-[#2D2D2D] py-4 px-2 rounded-2xl gap-1 border border-axia-green"
              onPress={openInWaze}
            >
              <View className="w-[18px] h-[18px] rounded-full bg-axia-green items-center justify-center">
                <Text className="text-white text-[11px] font-primaryBold">W</Text>
              </View>
              <Text className="text-axia-green text-[13px] font-primarySemiBold">Waze</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ParkingMapView;

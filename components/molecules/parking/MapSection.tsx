import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Card from '../../atoms/Card';

interface MapSectionProps {
  parkingCount: number;
  parkings?: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    availableSpots: number;
  }>;
  className?: string;
  onParkingPress?: (parkingId: string) => void;
}

const MapSection: React.FC<MapSectionProps> = ({
  parkingCount,
  parkings = [],
  className = '',
  onParkingPress,
}) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasLocationPermission(false);
        return;
      }

      setHasLocationPermission(true);
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setHasLocationPermission(false);
    }
  };

  // Coordenadas por defecto (Bogotá, Colombia)
  const defaultRegion = {
    latitude: 4.7110,
    longitude: -74.0721,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const initialRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : defaultRegion;

  if (!hasLocationPermission && parkings.length === 0) {
    return (
      <View className={className}>
        <Card className="h-64 items-center justify-center">
          <View className="bg-axia-darkGray w-full h-full rounded-xl items-center justify-center px-6">
            <Ionicons name="location-outline" size={48} color="#8C8C8C" />
            <Text className="text-white font-primaryBold text-base mt-4 text-center">
              Permiso de ubicación requerido
            </Text>
            <Text className="text-axia-gray font-primary text-sm mt-2 text-center">
              Necesitamos acceso a tu ubicación para mostrarte los parqueaderos cercanos
            </Text>
            <Pressable
              onPress={getCurrentLocation}
              className="bg-axia-green px-6 py-3 rounded-xl mt-4"
            >
              <Text className="text-axia-black font-primaryBold">Activar ubicación</Text>
            </Pressable>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View className={className}>
      <Card className="h-64 overflow-hidden">
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
          showsCompass
        >
          {parkings.map((parking) => (
            <Marker
              key={parking.id}
              coordinate={{
                latitude: parking.latitude,
                longitude: parking.longitude,
              }}
              title={parking.name}
              description={`${parking.availableSpots} espacios disponibles`}
              onPress={() => onParkingPress?.(parking.id)}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.marker,
                    parking.availableSpots === 0 && styles.markerFull,
                  ]}
                >
                  <Ionicons
                    name="car"
                    size={16}
                    color="#FFFFFF"
                  />
                  {parking.availableSpots > 0 && (
                    <View style={styles.markerBadge}>
                      <Text style={styles.markerBadgeText}>
                        {parking.availableSpots}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
        
        {/* Overlay con contador */}
        <View style={styles.overlay}>
          <View style={styles.counterBadge}>
            <Ionicons name="location" size={16} color="#10B981" />
            <Text style={styles.counterText}>
              {parkingCount} parqueaderos
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  markerFull: {
    backgroundColor: '#EF4444',
  },
  markerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  markerBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10B981',
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default MapSection;
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserProfile } from '../../../libs/user';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
}

interface MenuItem {
  id: string;
  icon: string;
  title: string;
  route?: string;
}

const Profile = () => {
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserProfile(data); 
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    loadProfile();
  }, []);

  const userCars: Car[] = [
    /* {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      plate: 'ABC 123',
    }, */
  ];

  // Opciones del menú de perfil
  const menuItems: MenuItem[] = [
    {
      id: '1',
      icon: 'person-outline',
      title: 'Información personal',
      route: '/profile/personal-info/'
    },
    {
      id: '2',
      icon: 'lock-closed-outline',
      title: 'Seguridad',
      route: '/profile/security'
    },
    {
      id: '3',
      icon: 'card-outline',
      title: 'Tarjeta de débito',
      route: '/profile/payment-methods'
    }
  ];

  const handleMenuItemPress = (route: string) => {
    router.push(route as any);
  };

  const handleCarPress = (carId: string) => {
    router.push(`/cars/detail/${carId}` as any);
  };

  const handleViewAllCars = () => {
    router.push('/(cars)/my-cars');
  };

  const handleAddCar = () => {
    router.push('/cars/add');
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pt-8">

          {/* Foto de perfil y nombre */}
          <View className="items-center mb-12">
            <View className="relative mb-6 mt-14">
              <View className="absolute inset-0 justify-center items-center">
                <Text className="text-6xl font-secondary text-axia-darkGray opacity-30">
                  93
                </Text>
              </View>
              
              <View className="w-36 h-36 rounded-full border-2 border-axia-green bg-axia-darkGray items-center justify-center">
                <Ionicons name="person" size={60} color="#FFFFFF" />
              </View>
            </View>
            
            {/* Nombre del usuario */}
            <Text className="text-white text-2xl font-primaryBold">
              {userProfile?.name}

            </Text>
          </View>

          {/* Opciones del menú */}
          <View className="mb-8">
            {menuItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleMenuItemPress(item.route || '')}
                className="flex-row items-center justify-between py-4 border-b border-axia-darkGray"
              >
                <View className="flex-row items-center">
                  <Ionicons 
                    name={item.icon as any} 
                    size={24} 
                    color="#FFFFFF" 
                    style={{ marginRight: 16 }}
                  />
                  <Text className="text-white text-lg font-primary">
                    {item.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </View>

          {/* Sección Mis Carros */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-primaryBold">
                Mis Carros
              </Text>
              <Pressable
                onPress={handleViewAllCars}
                className="bg-axia-darkGray px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-sm font-primary">
                  Todos
                </Text>
              </Pressable>
            </View>

            {userCars.length > 0 ? (
              <View>
                {userCars.map((car) => (
                  <Pressable
                    key={car.id}
                    onPress={() => handleCarPress(car.id)}
                    className="bg-axia-darkGray rounded-xl p-4 mb-4"
                  >
                    <View className="flex-row items-center">
                      <View className="w-20 h-16 rounded-lg bg-axia-gray items-center justify-center mr-4">
                        <Ionicons name="car-sport" size={24} color="#FFFFFF" />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="text-white text-lg font-primaryBold">
                          {car.brand} {car.model}
                        </Text>
                        <Text className="text-axia-gray text-sm font-primary">
                          Modelo: {car.year}
                        </Text>
                        <Text className="text-axia-gray text-sm font-primary">
                          Placa: {car.plate}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="bg-axia-darkGray rounded-xl p-6 items-center">
                <Ionicons name="car-outline" size={48} color="#9CA3AF" />
                <Text className="text-axia-gray text-center mt-4 mb-4 font-primary">
                  Aún no tienes carros registrados
                </Text>
                <Pressable
                  onPress={handleAddCar}
                  className="bg-axia-green px-6 py-2 rounded-lg"
                >
                  <Text className="text-axia-black font-primaryBold">
                    Agregar Carro
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

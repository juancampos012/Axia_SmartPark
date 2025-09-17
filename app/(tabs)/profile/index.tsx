import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Usar iconos por defecto en lugar de imágenes

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

  const userProfile = {
    name: "Fernando Alonso",
  };

  const userCars: Car[] = [
    {
      id: '1',
      brand: 'Toyota',
      model: 'Swift',
      year: 2022,
      plate: 'ABC 123',
    },
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
    console.log(`Menu item pressed: ${route}`);
    // Navegar a la ruta correspondiente
    router.push(route as any);
  };

  const handleCarPress = (carId: string) => {
    console.log(`Car pressed: ${carId}`);
    // Navegar a los detalles del carro
    router.push(`/(cars)/car-details/${carId}` as any);
  };

  const handleViewAllCars = () => {
    console.log('View all cars pressed');
    // Navegar a la lista completa de carros
    router.push('/(cars)/my-cars');
  };

  const handleAddCar = () => {
    console.log('Add car pressed');
    // Navegar a agregar nuevo carro
    router.push('/(cars)/add-car');
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <ScrollView className="flex-1">
        <View className="flex-1 px-6 pt-8">

          {/* Foto de perfil y nombre */}
          <View className="items-center mb-12">
            <View className="relative mb-6 mt-14">
              {/* Número grande de fondo */}
              <View className="absolute inset-0 justify-center items-center">
                <Text className="text-6xl font-bold text-axia-darkGray opacity-30">
                  93
                </Text>
              </View>
              
              {/* Icono de perfil circular */}
              <View className="w-36 h-36 rounded-full border-2 border-axia-green bg-axia-darkGray items-center justify-center">
                <Ionicons name="person" size={60} color="#FFFFFF" />
              </View>
            </View>
            
            {/* Nombre del usuario */}
            <Text className="text-white text-2xl font-normal">
              {userProfile.name}
            </Text>
          </View>

          {/* Opciones del menú */}
          <View className="mb-8">
            {menuItems.map((item, index) => (
              <TouchableOpacity
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
                  <Text className="text-white text-lg">
                    {item.title}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Sección Mis Carros */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-semibold">
                Mis Carros
              </Text>
              <TouchableOpacity
                onPress={handleViewAllCars}
                className="bg-axia-darkGray px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-sm">
                  Todos
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lista de carros */}
            {userCars.length > 0 ? (
              <View>
                {userCars.map((car) => (
                  <TouchableOpacity
                    key={car.id}
                    onPress={() => handleCarPress(car.id)}
                    className="bg-axia-darkGray rounded-xl p-4 mb-4"
                  >
                    <View className="flex-row items-center">
                      {/* Icono del carro */}
                      <View className="w-20 h-16 rounded-lg bg-axia-gray items-center justify-center mr-4">
                        <Ionicons name="car-sport" size={24} color="#FFFFFF" />
                      </View>
                      
                      {/* Información del carro */}
                      <View className="flex-1">
                        <Text className="text-white text-lg font-semibold">
                          {car.brand} {car.model}
                        </Text>
                        <Text className="text-axia-gray text-sm">
                          Modelo: {car.year}
                        </Text>
                        <Text className="text-axia-gray text-sm">
                          Placa: {car.plate}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              // Estado cuando no hay carros
              <View className="bg-axia-darkGray rounded-xl p-6 items-center">
                <Ionicons name="car-outline" size={48} color="#9CA3AF" />
                <Text className="text-axia-gray text-center mt-4 mb-4">
                  Aún no tienes carros registrados
                </Text>
                <TouchableOpacity
                  onPress={handleAddCar}
                  className="bg-axia-green px-6 py-2 rounded-lg"
                >
                  <Text className="text-axia-black font-semibold">
                    Agregar Carro
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
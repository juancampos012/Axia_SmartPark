import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUsersManagement } from '../../../../hooks/useUsersManagement';
import { AdminUserListItem } from '../../../../interfaces/Admin';
import { RoleGuard } from '../../../../components/atoms/RoleGuard';
import { Role } from '../../../../interfaces/User';

export default function UsersManagementScreen() {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.OPERATOR, Role.SUPER_ADMIN]}>
      <UsersManagementContent />
    </RoleGuard>
  );
}

function UsersManagementContent() {
  const {
    users,
    loading,
    refreshing,
    hasMore,
    // ARREGLO: El hook expone 'searchQuery' (antes se intentó usar 'filters')
    searchQuery,
    totalUsers,
    handleSearch,
    handleRefresh,
    loadMore,
    handleDeleteUser,
    navigateToCreate,
    navigateToEdit,
    // ARREGLO: Faltaba importar 'handleRoleFilter' aunque no se usa aquí
  } = useUsersManagement();

  const renderUserItem = ({ item }: { item: AdminUserListItem }) => (
    <Pressable
      onPress={() => navigateToEdit(item.id)}
      className="bg-axia-darkGray rounded-2xl px-5 py-4 mb-4 mx-3 active:scale-98"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <View className="w-12 h-12 bg-axia-green/20 rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={22} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-primaryBold">
                {item.name} {item.lastName}
              </Text>
              <Text className="text-axia-gray text-sm font-primary">
                {item.email}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-4 ml-12 mt-1">
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={14} color="#6B7280" />
              <Text className="text-axia-gray text-xs font-primary ml-1">
                {item.phoneNumber || 'Sin teléfono'}
              </Text>
            </View>

            <View className="flex-row items-center space-x-2 ml-2 mr-2">
              <View className={`px-2 py-1 rounded-md ${
                item.role === 'ADMIN' ? 'bg-purple-500/20' :
                item.role === 'OPERATOR' ? 'bg-blue-500/20' :
                'bg-gray-500/20'
              }`}>
                <Text className={`text-xs font-primaryBold ${
                  item.role === 'ADMIN' ? 'text-purple-400' :
                  item.role === 'OPERATOR' ? 'text-blue-400' :
                  'text-gray-400'
                }`}>
                  {item.role}
                </Text>
              </View>

              <View className={`w-2 h-2 rounded-full ${
                item.isActive ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </View>
          </View>
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            handleDeleteUser(item.id, `${item.name} ${item.lastName}`);
          }}
          className="ml-3 p-2"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </Pressable>
      </View>
    </Pressable>
  );

  const renderHeader = () => (
    <View className="px-6 pt-6 pb-4">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-white text-2xl font-primaryBold">
            Gestión de Usuarios
          </Text>
          <Text className="text-axia-gray text-sm font-primary mt-1">
            {totalUsers} usuario{totalUsers !== 1 ? 's' : ''} registrado{totalUsers !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <Pressable
          onPress={navigateToCreate}
          className="bg-axia-green px-4 py-3 rounded-xl flex-row items-center active:scale-95"
        >
          <Ionicons name="add" size={20} color="#000000" />
          <Text className="text-axia-black font-primaryBold ml-1">Nuevo</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="bg-axia-darkGray rounded-xl flex-row items-center px-4 py-3 mb-4">
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          // ARREGLO: Usar 'searchQuery' proporcionado por el hook
          value={searchQuery || ''}
          onChangeText={handleSearch}
          placeholder="Buscar por nombre o email..."
          placeholderTextColor="#6B7280"
          className="flex-1 text-white ml-3 font-primary"
        />
        {/* ARREGLO: Comprobar 'searchQuery' (y su length) */}
        {searchQuery && searchQuery.length > 0 && (
          <Pressable onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="items-center justify-center py-20">
      <View className="w-20 h-20 bg-axia-green/10 rounded-full items-center justify-center mb-4">
        <Ionicons name="people-outline" size={40} color="#10B981" />
      </View>
      <Text className="text-white text-lg font-primaryBold text-center mb-2">
        No hay usuarios
      </Text>
      <Text className="text-axia-gray text-sm font-primary text-center">
        {/* ARREGLO: Comprobar 'searchQuery' */}
        {searchQuery ? 'No se encontraron resultados' : 'Agrega el primer usuario'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    // ARREGLO: Mostrar spinner de carga si 'loading' es true pero NO es un 'refresh'
    if (loading && !refreshing) {
       return (
         <View className="py-4">
           <ActivityIndicator size="small" color="#10B981" />
         </View>
       );
    }
    if (!hasMore) return null;
    
    // (Este footer era para paginación, 'loading' arriba es para carga inicial)
    // Dejamos el de paginación
     if (loading) return null;
    
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      {/* ARREGLO: Lógica de carga inicial (loading && !refreshing) */}
      {loading && !refreshing && users.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-axia-gray text-sm font-primary mt-4">
            Cargando usuarios...
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#10B981"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}

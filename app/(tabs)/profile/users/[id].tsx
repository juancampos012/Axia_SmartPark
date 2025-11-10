import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useUserForm } from '../../../../hooks/useUserForm';
import { Role } from '../../../../interfaces/User';

const UserFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    loading,
    saving,
  isEditMode,
    name,
    setName,
    lastName,
    setLastName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole,
    isActive,
    setIsActive,
    handleSave,
    formErrors,
  } = useUserForm(id);

  const roles = [
    { value: Role.USER, label: 'Usuario' },
    { value: Role.OPERATOR, label: 'Operador' },
    { value: Role.ADMIN, label: 'Administrador' },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-axia-gray text-sm font-primary mt-4">
          Cargando...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-axia-gray/20">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="text-white text-lg font-primaryBold">
            {isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6 space-y-4">
            {/* Nombre */}
            <View>
              <Text className="text-white text-sm font-primaryBold mb-2">Nombre</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ingresa el nombre"
                placeholderTextColor="#6B7280"
                className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
              />
              {formErrors?.name ? (
                <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.name}</Text>
              ) : null}
            </View>

            {/* Apellido */}
            <View className="mt-4">
              <Text className="text-white text-sm font-primaryBold mb-2">Apellido</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Ingresa el apellido"
                placeholderTextColor="#6B7280"
                className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
              />
              {formErrors?.lastName ? (
                <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.lastName}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View className="mt-4">
              <Text className="text-white text-sm font-primaryBold mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
              />
              {formErrors?.email ? (
                <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.email}</Text>
              ) : null}
            </View>

            {/* Teléfono */}
            <View className="mt-4">
              <Text className="text-white text-sm font-primaryBold mb-2">Teléfono</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="300 123 4567"
                placeholderTextColor="#6B7280"
                keyboardType="phone-pad"
                className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
              />
              {formErrors?.phoneNumber ? (
                <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.phoneNumber}</Text>
              ) : null}
            </View>

            {/* Contraseña (solo al crear) */}
            {!isEditMode && (
              <>
                <View className="mt-4">
                  <Text className="text-white text-sm font-primaryBold mb-2">Contraseña</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Mínimo 8 caracteres"
                    placeholderTextColor="#6B7280"
                    secureTextEntry
                    className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
                  />
                  {formErrors?.password ? (
                    <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.password}</Text>
                  ) : null}
                </View>

                <View className="mt-4">
                  <Text className="text-white text-sm font-primaryBold mb-2">
                    Confirmar Contraseña
                  </Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repite la contraseña"
                    placeholderTextColor="#6B7280"
                    secureTextEntry
                    className="bg-axia-darkGray text-white px-4 py-3 rounded-xl font-primary"
                  />
                  {formErrors?.confirmPassword ? (
                    <Text className="text-red-500 text-sm mt-1 font-primary">{formErrors.confirmPassword}</Text>
                  ) : null}
                </View>
              </>
            )}

            {/* Rol */}
            <View className="mt-4">
              <Text className="text-white text-sm font-primaryBold mb-2">Rol</Text>
              <View className="bg-axia-darkGray rounded-xl overflow-hidden">
                {roles.map((r, index) => (
                  <Pressable
                    key={r.value}
                    onPress={() => setRole(r.value)}
                    className={`flex-row items-center justify-between px-4 py-3 ${
                      index < roles.length - 1 ? 'border-b border-axia-gray/20' : ''
                    }`}
                  >
                    <Text className="text-white font-primary">{r.label}</Text>
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        role === r.value
                          ? 'border-axia-green bg-axia-green'
                          : 'border-axia-gray'
                      }`}
                    >
                      {role === r.value && (
                        <Ionicons name="checkmark" size={14} color="#000000" />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Estado Activo (solo al editar) */}
            {isEditMode && (
              <View className="mt-4">
                <View className="bg-axia-darkGray rounded-xl px-4 py-3 flex-row items-center justify-between">
                  <Text className="text-white font-primary">Usuario Activo</Text>
                  <Switch
                    value={isActive}
                    onValueChange={setIsActive}
                    trackColor={{ false: '#6B7280', true: '#10B981' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Botón de Guardar */}
        <View className="px-6 py-4 border-t border-axia-gray/20">
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`bg-axia-green py-4 rounded-xl flex-row items-center justify-center ${
              saving ? 'opacity-50' : 'active:scale-98'
            }`}
          >
            {saving ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#000000" />
                <Text className="text-axia-black font-primaryBold ml-2">
                  {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserFormScreen;

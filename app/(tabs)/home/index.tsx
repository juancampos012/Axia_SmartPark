import { View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router'  
import Button from '../../../src/components/atoms/Button'

const home = () => {
  const home = () => {
    router.push('/');
  }
  return (
    <View className="flex-1 items-center justify-center bg-purple-100">
      <Text className="text-2xl font-bold text-purple-700">Inicio</Text>
    </View>
  )
}

export default home
import { View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router'  
import Button from '../../../components/atoms/Button'

const home = () => {
  const home = () => {
    router.push('/');
  }
  return (
    <View className="flex-1 items-center justify-center bg-axia-black">
      <Text className="text-2xl font-secondary text-axia-green">Inicio</Text>
    </View>
  )
}

export default home
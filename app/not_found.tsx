import { View, Text } from 'react-native'


const notFound = () => {
  return (
    <View className="flex-1 items-center justify-center bg-red-100">
      <Text className="text-xl font-semibold text-red-700">Página no encontrada</Text>
    </View>
  )
}

export default notFound
import React from 'react';
import { FlatList, View } from 'react-native';
import ParkingCard, { Parking } from '../../molecules/parking/ParkingCard';

interface ParkingsListProps {
  parkings: Parking[];
  onParkingPress: (parkingId: string) => void;
  onFavoritePress?: (parkingId: string) => void;
}

const ParkingsList: React.FC<ParkingsListProps> = ({
  parkings,
  onParkingPress,
  onFavoritePress
}) => {
  const renderParkingItem = ({ item }: { item: Parking }) => (
    <ParkingCard
      parking={item}
      onPress={onParkingPress}
      onFavoritePress={onFavoritePress}
    />
  );

  return (
    <View className="flex-1 px-4">
      {/* Lista de parqueaderos */}
      <FlatList
        data={parkings}
        renderItem={renderParkingItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
};

export default ParkingsList;
import React from 'react';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParkingMapView from './ParkingMapView';

interface ParkingMapModalProps {
  visible: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  parkingName: string;
  address: string;
}

const ParkingMapModal: React.FC<ParkingMapModalProps> = ({
  visible,
  onClose,
  latitude,
  longitude,
  parkingName,
  address,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        <ParkingMapView
          latitude={latitude}
          longitude={longitude}
          parkingName={parkingName}
          address={address}
          onClose={onClose}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ParkingMapModal;

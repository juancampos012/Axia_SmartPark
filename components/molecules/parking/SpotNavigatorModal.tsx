import React from 'react';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpotNavigator from './SpotNavigator';

interface SpotNavigatorModalProps {
  visible: boolean;
  onClose: () => void;
  floorNumber: number;
  spotNumber: string;
  spotType: 'STANDARD' | 'ELECTRIC' | 'HANDICAPPED';
  parkingName: string;
}

const SpotNavigatorModal: React.FC<SpotNavigatorModalProps> = ({
  visible,
  onClose,
  floorNumber,
  spotNumber,
  spotType,
  parkingName,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        <SpotNavigator
          floorNumber={floorNumber}
          spotNumber={spotNumber}
          spotType={spotType}
          parkingName={parkingName}
          onClose={onClose}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default SpotNavigatorModal;

import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateTimeModalProps {
  type: 'date' | 'start' | 'end';
  visible: boolean;
  onClose: () => void;
  onChange: (type: string, selected: Date) => void;
  selectedDate: Date;
  startTime: Date;
  endTime: Date;
}

export const DateTimeModal: React.FC<DateTimeModalProps> = ({
  type,
  visible,
  onClose,
  onChange,
  selectedDate,
  startTime,
  endTime
}) => {
  const [tempValue, setTempValue] = useState(() => {
    if (type === "date") return selectedDate;
    if (type === "start") return startTime;
    return endTime;
  });

  const handleConfirm = () => {
    if (tempValue) {
      onChange(type, tempValue);
    }
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case "date":
        return "Selecciona una fecha";
      case "start":
        return "Hora de inicio";
      case "end":
        return "Hora de fin";
      default:
        return "Seleccionar";
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 items-center justify-center p-4">
        <View className="bg-axia-darkGray rounded-2xl p-6 w-full max-w-md">
          <Text className="text-white text-center font-primaryBold mb-4 text-lg">
            {getTitle()}
          </Text>
          
          <DateTimePicker
            value={tempValue}
            mode={type === "date" ? "date" : "time"}
            display="spinner"
            minimumDate={type === "date" ? new Date() : undefined}
            onChange={(event, selected) => {
              if (selected) {
                setTempValue(selected);
              }
            }}
            style={{ 
              height: Platform.OS === "ios" ? 200 : 150,
              backgroundColor: '#1F2937'
            }}
            textColor="#FFFFFF"
            themeVariant="dark"
          />
          
          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-axia-gray/30 rounded-xl py-3 active:scale-95"
              accessibilityLabel="Cancelar selección"
              accessibilityRole="button"
            >
              <Text className="text-white text-center font-primaryBold text-lg">
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className="flex-1 bg-axia-green rounded-xl py-3 active:scale-95"
              accessibilityLabel="Confirmar selección"
              accessibilityRole="button"
            >
              <Text className="text-axia-black text-center font-primaryBold text-lg">
                Confirmar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DateTimeModal;
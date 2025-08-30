import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  title?: string;
  containerClassName?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  containerClassName = "",
  titleClassName = "",
  className = "",
  ...props
}) => {
  return (
    <View
      className={`
        bg-white rounded-xl p-4 my-2 mx-4 shadow-sm
        ${containerClassName}
        ${className}
      `}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      {...props}
    >
      {title && (
        <Text className={`text-lg font-bold text-gray-800 mb-3 ${titleClassName}`}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

export default Card;
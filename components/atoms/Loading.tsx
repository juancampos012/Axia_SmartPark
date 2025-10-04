import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingProps {
	label?: string;
	className?: string;
}

const Loading: React.FC<LoadingProps> = ({ label = 'Cargando...', className = '' }) => {
	return (
		<View className={`flex-row items-center justify-center ${className}`}>
			<ActivityIndicator size="small" color="#FFFFFF" />
			{label ? <Text className="text-white ml-2">{label}</Text> : null}
		</View>
	);
};

export default Loading;

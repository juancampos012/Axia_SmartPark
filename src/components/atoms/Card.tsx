import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
	children: React.ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...rest }) => {
	return (
		<View
			className={`bg-[#161B22] rounded-2xl p-5 shadow-card border border-white/5 ${className}`}
			{...rest}
		>
			{children}
		</View>
	);
};

export default Card;

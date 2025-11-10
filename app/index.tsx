import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Path } from 'react-native-svg';

export default function SplashScreen() {
  const router = useRouter();

  const triangle1Anim = useRef(new Animated.Value(0)).current;
  const triangle2Anim = useRef(new Animated.Value(0)).current;
  const rhombusAnim = useRef(new Animated.Value(0)).current;

  const triangle1Bounce = useRef(new Animated.Value(0)).current;
  const triangle2Bounce = useRef(new Animated.Value(0)).current;
  const rhombusBounce = useRef(new Animated.Value(0)).current;

  const letterA1Anim = useRef(new Animated.Value(0)).current;
  const letterXAnim = useRef(new Animated.Value(0)).current;
  const letterIAnim = useRef(new Animated.Value(0)).current;
  const letterA2Anim = useRef(new Animated.Value(0)).current;
  const smartparkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAccessToken = async () => {
      await AsyncStorage.getItem("accessToken");
    };
    checkAccessToken();
  }, []);

  useEffect(() => {
    // Animación de entrada
    Animated.sequence([
      Animated.parallel([
        Animated.timing(triangle1Anim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(triangle2Anim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(rhombusAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start(() => {
      const bounce = (anim: Animated.Value) => {
        Animated.loop(
          Animated.sequence([
            Animated.spring(anim, { toValue: 1, useNativeDriver: true, bounciness: 25, speed: 2 }),
            Animated.spring(anim, { toValue: 0, useNativeDriver: true, bounciness: 20, speed: 30 }),
          ])
        ).start();
      };

      bounce(triangle1Bounce);
      bounce(triangle2Bounce);
      bounce(rhombusBounce);
    });

    // Animación de letras
    Animated.stagger(100, [
      Animated.timing(letterA1Anim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(letterXAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(letterIAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(letterA2Anim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(smartparkAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => router.replace('/(auth)'), 3000);
    return () => clearTimeout(timer);
  }, []);

  const triangleSizeFactor = 1.5;
  const rhombusSizeFactor = 2.3;

  const triangle1Scale = triangle1Bounce.interpolate({ inputRange: [0, 1], outputRange: [triangleSizeFactor, triangleSizeFactor * 1.1] });
  const triangle2Scale = triangle2Bounce.interpolate({ inputRange: [0, 1], outputRange: [triangleSizeFactor, triangleSizeFactor * 1.1] });
  const rhombusScale = rhombusBounce.interpolate({ inputRange: [0, 1], outputRange: [rhombusSizeFactor, rhombusSizeFactor * 1.1] });

  return (
    <View className="flex-1 bg-axia-black justify-center items-center">
      <StatusBar style="light" />
      <View className="items-center justify-center mb-2">
        <View className="relative w-56 h-56 justify-center items-center">
          <Animated.View style={{
            position: 'absolute', left: 17, bottom: 25,
            transform: [
              { translateX: triangle1Anim.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) },
              { scale: triangle1Scale }
            ],
            opacity: triangle1Anim,
          }}>
            <Svg width="80" height="80" viewBox="0 0 200 200">
              <Path d="M50 150 L100 50 L150 150 Z" fill="#006B54" />
            </Svg>
          </Animated.View>

          <Animated.View style={{
            position: 'absolute', right: 17, bottom: 25,
            transform: [
              { translateX: triangle2Anim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) },
              { scale: triangle2Scale }
            ],
            opacity: triangle2Anim,
          }}>
            <Svg width="80" height="80" viewBox="0 0 200 200">
              <Path d="M50 150 L100 50 L150 150 Z" fill="#006B54" />
            </Svg>
          </Animated.View>

          <Animated.View style={{
            position: 'absolute', top: 53,
            transform: [
              { translateY: rhombusAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) },
              { scale: rhombusScale }
            ],
            opacity: rhombusAnim,
          }}>
            <Svg width="70" height="70" viewBox="0 0 200 200">
              <Path d="M100 40 L135 100 L100 160 L65 100 Z" fill="#006B54" />
            </Svg>
          </Animated.View>
        </View>
      </View>

      <View className="items-center">
        <View className="flex-row mb-2">
          <Animated.Text style={{ opacity: letterA1Anim, transform: [{ translateY: letterA1Anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] }} className="text-axia-green text-5xl font-bold">A</Animated.Text>
          <Animated.Text style={{ opacity: letterXAnim, transform: [{ translateY: letterXAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] }} className="text-axia-green text-5xl font-bold">X</Animated.Text>
          <Animated.Text style={{ opacity: letterIAnim, transform: [{ translateY: letterIAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] }} className="text-axia-green text-5xl font-bold">I</Animated.Text>
          <Animated.Text style={{ opacity: letterA2Anim, transform: [{ translateY: letterA2Anim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] }} className="text-axia-green text-5xl font-bold">A</Animated.Text>
        </View>
        <Animated.Text style={{ opacity: smartparkAnim, transform: [{ translateY: smartparkAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }} className="text-white text-xl font-medium">SMARTPARK</Animated.Text>
      </View>
    </View>
  );
}

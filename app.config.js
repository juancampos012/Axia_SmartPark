export default ({ config }) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProduction = process.env.APP_VARIANT === 'production';
  
  // API Base URL: usar la correcta según el entorno
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 
    (isProduction 
      ? (process.env.EXPO_PUBLIC_API_BASE_URL_PROD || 'https://api.axiasmartpark.lat/api')
      : (process.env.EXPO_PUBLIC_API_BASE_URL_DEV || 'http://192.168.39.131:3001/api')
    );
  
  // Google Maps API Keys
  // Soportar tanto EXPO_PUBLIC_GOOGLE_MAPS_DEV_KEY (EAS) como EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY (local)
  const googleMapsAndroidKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_DEV_KEY || process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY;
  const googleMapsIosKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY;

  return {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsAndroidKey
        }
      }
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios?.config,
        googleMapsApiKey: googleMapsIosKey
      }
    },
    extra: {
      // Variables disponibles en runtime vía Constants.expoConfig.extra
      EXPO_PUBLIC_API_BASE_URL: apiBaseUrl,
      EXPO_PUBLIC_API_BASE_URL_DEV: process.env.EXPO_PUBLIC_API_BASE_URL_DEV,
      EXPO_PUBLIC_API_BASE_URL_PROD: process.env.EXPO_PUBLIC_API_BASE_URL_PROD,
      APP_VARIANT: process.env.APP_VARIANT || 'development',
      eas: {
        projectId: config.extra?.eas?.projectId
      }
    }
  };
};

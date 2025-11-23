export default ({ config }) => {
  return {
    ...config,
    extra: {
      // Leer la variable de entorno de EAS Build
      EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.1:3001/api",
      eas: {
        projectId: config.extra?.eas?.projectId
      }
    }
  };
};

// Forzar backend WASM para lightningcss en Windows (evita búsqueda del binario nativo)
process.env.LIGHTNINGCSS_BACKEND = 'wasm';

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);
 
module.exports = withNativeWind(config, { input: './global.css' });
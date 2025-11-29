import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen() {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback a settings si no hay historial
      router.replace('/(tabs)/settings');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <TouchableOpacity
          onPress={handleBack}
          className="mr-3 p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-poppinsBold text-axia-black">
          Política de Privacidad
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-5 py-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-2 text-sm text-gray-500">
          Última actualización: 27 de noviembre de 2025
        </Text>

        {/* Sección 1 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            1. INTRODUCCIÓN
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Bienvenido a Axia SmartPark ("nosotros", "nuestro" o "la
            aplicación"). Nos comprometemos a proteger su privacidad y sus datos
            personales. Esta Política de Privacidad explica cómo recopilamos,
            usamos, almacenamos y protegemos su información cuando utiliza
            nuestra aplicación móvil de gestión de estacionamientos inteligentes.
          </Text>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            Al utilizar Axia SmartPark, usted acepta las prácticas descritas en
            esta política. Si no está de acuerdo con alguna parte de esta
            política, por favor no utilice nuestra aplicación.
          </Text>
        </View>

        {/* Sección 2 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            2. INFORMACIÓN QUE RECOPILAMOS
          </Text>

          <Text className="mb-2 mt-3 text-base font-poppinsMedium text-axia-black">
            2.1 Información Personal de Cuenta
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Cuando se registra en Axia SmartPark, recopilamos:
          </Text>
          <View className="ml-4 mt-2">
            <Text className="text-base leading-6 text-gray-700">
              • Datos de identificación: Nombre completo, apellidos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Datos de contacto: Correo electrónico, número de teléfono
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Credenciales de acceso: Contraseña (cifrada)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Fotografía de perfil: Imagen opcional
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Rol de usuario: Usuario, operador o administrador
            </Text>
          </View>

          <Text className="mb-2 mt-3 text-base font-poppinsMedium text-axia-black">
            2.2 Información de Vehículos
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Placa del vehículo (número de matrícula único)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tipo de vehículo (carro o motocicleta)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Marca, modelo y color
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tipo de motor (eléctrico, gasolina, híbrido, etc.)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Fotografía del vehículo (opcional)
            </Text>
          </View>

          <Text className="mb-2 mt-3 text-base font-poppinsMedium text-axia-black">
            2.3 Información de Ubicación
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Ubicación GPS para mostrar parqueaderos cercanos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Historial de ubicaciones (parqueaderos frecuentes)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Acceso solo mientras usa la aplicación
            </Text>
          </View>

          <Text className="mb-2 mt-3 text-base font-poppinsMedium text-axia-black">
            2.4 Información de Pagos
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Métodos de pago tokenizados (tarjetas crédito/débito)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Historial de transacciones (montos, fechas)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Estados de pago (exitosos, pendientes, fallidos)
            </Text>
          </View>

          <Text className="mb-2 mt-3 text-base font-poppinsMedium text-axia-black">
            2.5 Información de Reservas
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Historial de reservas (fecha, hora, duración)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Espacios reservados (número, planta/piso)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Estado de reserva (pendiente, confirmada, activa, etc.)
            </Text>
          </View>
        </View>

        {/* Sección 3 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            3. CÓMO UTILIZAMOS SU INFORMACIÓN
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Utilizamos la información recopilada para:
          </Text>
          <View className="ml-4 mt-2">
            <Text className="text-base leading-6 text-gray-700">
              • Crear y gestionar su cuenta de usuario
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Procesar reservas de espacios de estacionamiento
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Facilitar pagos y generar recibos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Mostrar parqueaderos disponibles según su ubicación
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Enviar notificaciones sobre reservas (5 min antes inicio/fin)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Mejorar el servicio y analizar patrones de uso
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Detectar y prevenir actividades fraudulentas
            </Text>
          </View>
        </View>

        {/* Sección 4 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            4. CÓMO COMPARTIMOS SU INFORMACIÓN
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Axia SmartPark NO vende ni alquila su información personal a
            terceros. Compartimos información solo en estas circunstancias:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Con propietarios/operadores de parqueaderos (solo datos de
              reserva necesarios)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Con procesadores de pagos (datos tokenizados y cifrados)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Con proveedores de servicios (almacenamiento, notificaciones,
              mapas)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Cuando sea requerido por ley o autoridad competente
            </Text>
          </View>
        </View>

        {/* Sección 5 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            5. SEGURIDAD DE DATOS
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Implementamos múltiples capas de seguridad:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Cifrado en tránsito (HTTPS/TLS)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Cifrado en reposo para datos sensibles
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Sistema JWT con tokens de acceso y renovación
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Hash de contraseñas con bcrypt
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Control de acceso basado en roles
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Monitoreo de intentos de inicio de sesión
            </Text>
          </View>
        </View>

        {/* Sección 6 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            6. SUS DERECHOS Y CONTROL
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Usted tiene derecho a:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Acceder a toda su información personal almacenada
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Actualizar datos incorrectos o desactualizados
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Ver su historial completo de reservas y pagos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Descargar una copia de sus datos (portabilidad)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Solicitar eliminación de vehículos y métodos de pago
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Eliminar su cuenta completa
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Controlar permisos de ubicación y notificaciones
            </Text>
          </View>
        </View>

        {/* Sección 7 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            7. RETENCIÓN DE DATOS
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Datos de cuenta: Mientras esté activa
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Historial de reservas: 2 años
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Registros de pago: 5 años (requisitos legales)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Vehículos eliminados: 90 días antes de eliminación permanente
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Logs de acceso: 6 meses
            </Text>
          </View>
        </View>

        {/* Sección 8 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            8. COOKIES Y TECNOLOGÍAS
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            La aplicación utiliza:
          </Text>
          <View className="ml-4 mt-2">
            <Text className="text-base leading-6 text-gray-700">
              • Tokens JWT para mantener su sesión activa
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • AsyncStorage para preferencias locales
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Expo Notifications para notificaciones push
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Mapbox para servicios de geolocalización
            </Text>
          </View>
        </View>

        {/* Sección 9 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            9. MENORES DE EDAD
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Axia SmartPark está diseñado para usuarios mayores de 18 años que
            posean licencia de conducir válida. No recopilamos intencionalmente
            información de menores de edad.
          </Text>
        </View>

        {/* Sección 10 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            10. LEGISLACIÓN APLICABLE
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Esta Política se rige por las leyes de Colombia, incluyendo:
          </Text>
          <View className="ml-4 mt-2">
            <Text className="text-base leading-6 text-gray-700">
              • Ley 1581 de 2012 (Protección de Datos Personales)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Decreto 1377 de 2013 (Reglamentación Ley 1581)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Ley 1266 de 2008 (Habeas Data)
            </Text>
          </View>
        </View>

        {/* Sección 11 - Contacto */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            11. CONTACTO
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Si tiene preguntas sobre esta Política de Privacidad:
          </Text>
          <View className="mt-3 rounded-lg bg-gray-50 p-4">
            <Text className="text-base font-poppinsMedium text-axia-black">
              Axia SmartPark
            </Text>
            <Text className="mt-1 text-base text-gray-700">
              Correo: privacy@axiasmartpark.lat
            </Text>
            <Text className="text-base text-gray-700">
              Web: https://axiasmartpark.lat
            </Text>
            <Text className="mt-2 text-sm text-gray-500">
              Tiempo de respuesta: Máximo 15 días hábiles
            </Text>
          </View>
        </View>

        {/* Sección 12 - Autoridad */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            12. AUTORIDAD DE CONTROL
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Si considera que sus derechos han sido vulnerados, puede presentar
            queja ante:
          </Text>
          <View className="mt-2 rounded-lg bg-gray-50 p-4">
            <Text className="text-base font-poppinsMedium text-axia-black">
              Superintendencia de Industria y Comercio (SIC)
            </Text>
            <Text className="mt-1 text-sm text-gray-700">
              Delegatura para la Protección de Datos Personales
            </Text>
            <Text className="text-sm text-gray-700">
              Carrera 13 No. 27 – 00, Pisos 3 y 4
            </Text>
            <Text className="text-sm text-gray-700">
              Bogotá D.C., Colombia
            </Text>
            <Text className="text-sm text-gray-700">Tel: +57 (1) 587 0000</Text>
            <Text className="text-sm text-gray-700">www.sic.gov.co</Text>
          </View>
        </View>

        {/* Footer */}
        <View className="mb-8 mt-4 border-t border-gray-200 pt-4">
          <Text className="text-center text-sm text-gray-500">
            © 2025 Axia SmartPark
          </Text>
          <Text className="text-center text-sm text-gray-500">
            Todos los derechos reservados
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

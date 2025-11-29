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

export default function TermsConditionsScreen() {
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
          Términos y Condiciones
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
            1. ACEPTACIÓN DE LOS TÉRMINOS
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Bienvenido a Axia SmartPark. Estos Términos y Condiciones
            constituyen un contrato legalmente vinculante entre usted y Axia
            SmartPark.
          </Text>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            Al descargar, instalar, registrarse o utilizar la aplicación móvil
            Axia SmartPark, usted acepta estos Términos en su totalidad. Si no
            está de acuerdo, debe abstenerse de utilizar nuestro Servicio.
          </Text>
        </View>

        {/* Sección 2 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            2. DESCRIPCIÓN DEL SERVICIO
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Axia SmartPark es una plataforma digital de gestión de
            estacionamientos inteligentes que conecta usuarios con operadores de
            parqueaderos. El Servicio incluye:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Búsqueda y localización de parqueaderos cercanos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Reservas en tiempo real
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Gestión de múltiples vehículos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Pagos digitales seguros
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Notificaciones inteligentes (5 min antes inicio/fin)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Historial y reportes de pagos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Sistema de valoraciones y reseñas
            </Text>
          </View>
        </View>

        {/* Sección 3 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            3. REQUISITOS Y ELEGIBILIDAD
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Para utilizar Axia SmartPark debe:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Tener al menos 18 años de edad
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Poseer licencia de conducir válida y vigente
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tener capacidad legal para celebrar contratos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Proporcionar información verdadera y completa
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Registrar al menos un vehículo válido
            </Text>
          </View>
        </View>

        {/* Sección 4 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            4. REGISTRO DE VEHÍCULOS
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Para realizar reservas debe registrar un vehículo con:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Placa válida (Carros: ABC123, Motos: ABC12D)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tipo de vehículo (carro o motocicleta)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Marca, modelo y color
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tipo de motor (opcional)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Fotografía del vehículo (recomendado)
            </Text>
          </View>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            Usted certifica ser propietario o usuario autorizado del vehículo
            registrado. El uso de información falsa puede resultar en cancelación
            de cuenta.
          </Text>
        </View>

        {/* Sección 5 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            5. RESERVAS DE ESTACIONAMIENTO
          </Text>

          <Text className="mb-2 mt-3 text-base font-poppinsMedium text-axia-black">
            Estados de Reserva:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • PENDING: Reserva creada, pago pendiente
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • CONFIRMED: Pago procesado, reserva confirmada
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • ACTIVE: Período de estacionamiento en curso
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • COMPLETED: Reserva finalizada correctamente
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • CANCELLED: Cancelada por usuario u operador
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • EXPIRED: Reserva no utilizada que venció
            </Text>
          </View>

          <Text className="mb-2 mt-3 text-base font-poppinsMedium text-axia-black">
            Compromisos al Reservar:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Llegar dentro de 30 min después del inicio
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Estacionar solo el vehículo registrado
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Ocupar únicamente el espacio asignado
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Respetar horarios de inicio y finalización
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Desocupar máximo 15 min después de finalizar
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • No subarrendar o transferir la reserva
            </Text>
          </View>
        </View>

        {/* Sección 6 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            6. POLÍTICA DE CANCELACIÓN
          </Text>
          <View className="rounded-lg bg-blue-50 p-4">
            <Text className="mb-2 text-base font-poppinsMedium text-axia-blue">
              Cancelación por el Usuario:
            </Text>
            <View className="ml-2">
              <Text className="text-base leading-6 text-gray-700">
                • Más de 24 horas antes: 100% de reembolso
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • Entre 6-24 horas: 50% de reembolso
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • Menos de 6 horas: Sin reembolso
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • No-show: Sin reembolso + posible penalización
              </Text>
            </View>
          </View>

          <View className="mt-3 rounded-lg bg-green-50 p-4">
            <Text className="mb-2 text-base font-poppinsMedium text-axia-green">
              Cancelación por el Operador:
            </Text>
            <View className="ml-2">
              <Text className="text-base leading-6 text-gray-700">
                • Reembolso completo + 20% de compensación
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • Ayuda para encontrar espacio alternativo
              </Text>
            </View>
          </View>
        </View>

        {/* Sección 7 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            7. TARIFAS Y PAGOS
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Las tarifas varían según tipo de vehículo, duración, parqueadero y
            ubicación. Tarifas típicas:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Carros por hora: Desde $3,000 COP
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Motos por hora: Desde $1,500 COP
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tarifa diaria: Desde $25,000 COP
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tarifa mensual: Desde $300,000 COP
            </Text>
          </View>

          <Text className="mt-3 text-base font-poppinsMedium text-axia-black">
            Métodos de Pago Aceptados:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Tarjetas de crédito (Visa, Mastercard, Amex)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Tarjetas débito
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • PSE (Pagos Seguros en Línea)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Billeteras digitales
            </Text>
          </View>

          <Text className="mt-3 text-base leading-6 text-gray-700">
            Los pagos se procesan a través de procesadores certificados PCI-DSS.
            Recibirá un recibo digital por cada transacción.
          </Text>
        </View>

        {/* Sección 8 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            8. LIMITACIÓN DE RESPONSABILIDAD
          </Text>
          <Text className="mb-2 text-base font-poppinsMedium text-axia-black">
            Axia SmartPark actúa como plataforma intermediaria.
          </Text>
          <View className="rounded-lg bg-yellow-50 p-4">
            <Text className="mb-2 text-base font-poppinsMedium text-gray-800">
              NO somos responsables por:
            </Text>
            <View className="ml-2">
              <Text className="text-base leading-6 text-gray-700">
                • Daños al vehículo, robo o vandalismo
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • Pérdida de objetos personales en vehículos
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • Accidentes en instalaciones de parqueaderos
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • Multas o infracciones de tránsito
              </Text>
              <Text className="text-base leading-6 text-gray-700">
                • Interrupciones del servicio por fuerza mayor
              </Text>
            </View>
          </View>

          <Text className="mt-3 text-base font-poppinsMedium text-axia-black">
            Su responsabilidad:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Cerrar puertas, ventanas y activar alarma
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • No dejar objetos de valor visibles
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Inspeccionar el espacio al llegar y salir
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Reportar daños preexistentes
            </Text>
          </View>

          <Text className="mt-3 text-base leading-6 text-gray-700">
            Responsabilidad máxima: Limitada al monto pagado por la reserva
            específica.
          </Text>
        </View>

        {/* Sección 9 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            9. CONDUCTA PROHIBIDA
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Está estrictamente prohibido:
          </Text>
          <View className="ml-4">
            <Text className="text-base leading-6 text-gray-700">
              • Proporcionar información falsa o fraudulenta
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Usar métodos de pago robados
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Crear múltiples cuentas para evadir restricciones
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Manipular calificaciones o reseñas
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Acosar o intimidar a operadores/usuarios
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Estacionar vehículos robados o con placas falsas
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Hacer ingeniería inversa de la app
            </Text>
          </View>

          <Text className="mt-3 text-base leading-6 text-gray-700">
            Consecuencias: Advertencia, suspensión temporal, cancelación
            permanente o acciones legales.
          </Text>
        </View>

        {/* Sección 10 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            10. PROPIEDAD INTELECTUAL
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Todos los derechos de propiedad intelectual sobre el Servicio
            (marca, diseño, código, algoritmos) son propiedad exclusiva de Axia
            SmartPark.
          </Text>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            Le otorgamos una licencia limitada, no exclusiva y revocable para
            usar la aplicación. No puede copiar, modificar, distribuir o crear
            obras derivadas.
          </Text>
        </View>

        {/* Sección 11 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            11. NOTIFICACIONES
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            La aplicación envía notificaciones para:
          </Text>
          <View className="ml-4 mt-2">
            <Text className="text-base leading-6 text-gray-700">
              • Confirmación de reservas y pagos
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Recordatorios 5 minutos antes de inicio/fin
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Alertas de cancelaciones
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Actualizaciones importantes del servicio
            </Text>
          </View>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            Puede desactivar notificaciones desde configuración, pero esto puede
            afectar su experiencia.
          </Text>
        </View>

        {/* Sección 12 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            12. RESEÑAS Y CALIFICACIONES
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Puede escribir reseñas sobre parqueaderos utilizados. Las reseñas
            deben:
          </Text>
          <View className="ml-4 mt-2">
            <Text className="text-base leading-6 text-gray-700">
              • Ser honestas y basadas en experiencia real
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Ser respetuosas y constructivas
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • No contener lenguaje ofensivo o discriminatorio
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • No incluir información personal de terceros
            </Text>
          </View>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            Nos reservamos el derecho de moderar y eliminar reseñas que violen
            estas normas.
          </Text>
        </View>

        {/* Sección 13 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            13. MODIFICACIONES
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Podemos actualizar estos Términos periódicamente. Le notificaremos
            mediante correo electrónico y/o notificación en la aplicación.
          </Text>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            Los cambios entrarán en vigencia 15 días después de la notificación.
            Su uso continuado constituye aceptación de los nuevos Términos.
          </Text>
        </View>

        {/* Sección 14 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            14. TERMINACIÓN
          </Text>
          <Text className="mb-2 text-base leading-6 text-gray-700">
            Puede cancelar su cuenta en cualquier momento desde Perfil {">"}{' '}
            Configuración {">"} Eliminar Cuenta.
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Podemos suspender o cancelar su cuenta si viola estos Términos,
            participa en actividades fraudulentas o presenta comportamiento
            abusivo.
          </Text>
        </View>

        {/* Sección 15 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            15. LEGISLACIÓN Y JURISDICCIÓN
          </Text>
          <Text className="text-base leading-6 text-gray-700">
            Estos Términos se rigen por las leyes de Colombia:
          </Text>
          <View className="ml-4 mt-2">
            <Text className="text-base leading-6 text-gray-700">
              • Ley 1480 de 2011 (Estatuto del Consumidor)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Ley 1581 de 2012 (Protección de Datos)
            </Text>
            <Text className="text-base leading-6 text-gray-700">
              • Ley 527 de 1999 (Comercio Electrónico)
            </Text>
          </View>
        </View>

        {/* Sección 16 */}
        <View className="mb-6">
          <Text className="mb-2 text-lg font-poppinsBold text-axia-black">
            16. SOPORTE Y CONTACTO
          </Text>
          <View className="mt-2 rounded-lg bg-gray-50 p-4">
            <Text className="text-base font-poppinsMedium text-axia-black">
              Axia SmartPark
            </Text>
            <Text className="mt-2 text-base text-gray-700">
              📧 Soporte: support@axiasmartpark.lat
            </Text>
            <Text className="text-base text-gray-700">
              ⚖️ Legal: legal@axiasmartpark.lat
            </Text>
            <Text className="text-base text-gray-700">
              🌐 Web: https://axiasmartpark.lat
            </Text>
            <Text className="mt-2 text-sm text-gray-500">
              Horario: Lun-Vie 8:00 AM - 6:00 PM
            </Text>
            <Text className="text-sm text-gray-500">
              Tiempo de respuesta: 24-48 horas hábiles
            </Text>
          </View>
        </View>

        {/* Aceptación */}
        <View className="mb-6 rounded-lg bg-axia-green p-4">
          <Text className="mb-2 text-center text-base font-poppinsBold text-white">
            ACEPTACIÓN DE TÉRMINOS
          </Text>
          <Text className="text-center text-sm leading-5 text-white">
            Al usar Axia SmartPark, usted reconoce que ha leído, comprende y
            acepta todos estos términos y nuestra Política de Privacidad.
          </Text>
        </View>

        {/* Footer */}
        <View className="mb-8 mt-4 border-t border-gray-200 pt-4">
          <Text className="text-center text-sm text-gray-500">
            © 2025 Axia SmartPark
          </Text>
          <Text className="text-center text-sm text-gray-500">
            Todos los derechos reservados
          </Text>
          <Text className="mt-2 text-center text-xs text-gray-400">
            Versión 1.0 • Última actualización: 27 de noviembre de 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

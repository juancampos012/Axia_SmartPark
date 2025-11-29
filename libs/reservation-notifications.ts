import { ReservationWithPaymentResponse } from './payments'; // Ajusta la ruta según tu estructura
import Constants from 'expo-constants';

// Detectar si estamos en Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Importación condicional de notificaciones
let Notifications: typeof import('expo-notifications') | null = null;

// Solo cargar expo-notifications si NO estamos en Expo Go
if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    // 🧩 Configuración global del manejador de notificaciones
    Notifications?.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch (error) {
    console.warn('⚠️ expo-notifications no disponible:', error);
  }
}

/**
 * 🔧 Convierte un Date a CalendarTriggerInput de Expo
 */
function dateToCalendarTrigger(date: Date): any {
  if (!Notifications) return null;

  return {
    type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
    year: date.getFullYear(),
    month: date.getMonth() + 1, // getMonth() va de 0 a 11
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    repeats: false,
  };
}

/**
 * 📅 Programa las notificaciones para una reserva (inicio y fin)
 */
export async function scheduleReservationNotifications(reservationData: ReservationWithPaymentResponse) {
  if (!Notifications) {
    console.warn('⚠️ Notificaciones no disponibles en Expo Go');
    return;
  }

  try {
    const reservation = reservationData.reservation;
    await cancelReservationNotifications(reservation.id);

    const startTime = new Date(reservation.startTime);
    const endTime = new Date(reservation.endTime);
    const now = new Date();

    // 🚗 Notificación 5 minutos antes del inicio
    const startNotificationTime = new Date(startTime.getTime() - 5 * 60 * 1000);
    if (startNotificationTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚗 Reserva por Empezar',
          body: `Tu reserva en ${reservation.parkingSpot.parking.name} inicia en 5 minutos`,
          sound: 'default',
          data: {
            type: 'reservation_starting',
            reservationId: reservation.id,
            screen: 'ReservationDetails',
            parkingName: reservation.parkingSpot.parking.name,
            spotNumber: reservation.parkingSpot.spotNumber,
          },
        },
        trigger: dateToCalendarTrigger(startNotificationTime),
      });

      console.log(
        '📆 Notificación de inicio programada para:',
        startNotificationTime.toLocaleString(), // hora local
        '(UTC:', startNotificationTime.toISOString(), ')'
      );
    }

    // ⏰ Notificación 5 minutos antes de finalizar
    const endNotificationTime = new Date(endTime.getTime() - 5 * 60 * 1000);
    if (endNotificationTime > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏰ Reserva por Terminar',
          body: `Tu reserva en ${reservation.parkingSpot.parking.name} finaliza en 5 minutos`,
          sound: 'default',
          data: {
            type: 'reservation_ending',
            reservationId: reservation.id,
            screen: 'ExtendTime',
            parkingName: reservation.parkingSpot.parking.name,
            spotNumber: reservation.parkingSpot.spotNumber,
          },
        },
        trigger: dateToCalendarTrigger(endNotificationTime),
      });

      console.log(
        '📆 Notificación de fin programada para:',
        endNotificationTime.toLocaleString(), // hora local
        '(UTC:', endNotificationTime.toISOString(), ')'
      );
    }

    console.log(`✅ Notificaciones programadas para reserva ${reservation.id}`);
  } catch (error) {
    console.error('❌ Error programando notificaciones:', error);
    throw error;
  }
}

/**
 * 🗑️ Cancela las notificaciones asociadas a una reserva específica
 */
export async function cancelReservationNotifications(reservationId: string) {
  if (!Notifications) {
    console.warn('⚠️ Notificaciones no disponibles en Expo Go');
    return;
  }

  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    const reservationNotifications = scheduledNotifications.filter(
      n => n.content.data?.reservationId === reservationId
    );

    for (const notification of reservationNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }

    console.log(
      `🧹 Canceladas ${reservationNotifications.length} notificaciones para la reserva ${reservationId}`
    );
  } catch (error) {
    console.error('❌ Error cancelando notificaciones:', error);
    throw error;
  }
}

/**
 * 🔄 Programa notificaciones para todas las reservas activas
 */
export async function scheduleNotificationsForActiveReservations(reservations: ReservationWithPaymentResponse[]) {
  if (!Notifications) {
    console.warn('⚠️ Notificaciones no disponibles en Expo Go');
    return;
  }

  const now = new Date();

  const activeReservations = reservations.filter(reservationData => {
    const reservation = reservationData.reservation;
    const endTime = new Date(reservation.endTime);
    return (
      (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') &&
      endTime > now
    );
  });

  console.log(`📱 Programando notificaciones para ${activeReservations.length} reservas activas`);

  for (const reservationData of activeReservations) {
    await scheduleReservationNotifications(reservationData);
  }
}

/**
 * 🚫 Cancela todas las notificaciones programadas
 */
export async function clearAllScheduledNotifications() {
  if (!Notifications) {
    console.warn('⚠️ Notificaciones no disponibles en Expo Go');
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('🧽 Todas las notificaciones programadas fueron canceladas');
}

/**
 * 🧪 Programa una notificación de prueba (10 s en el futuro)
 */
export async function testNotification() {
  if (!Notifications) {
    console.warn('⚠️ Notificaciones no disponibles en Expo Go');
    return;
  }

  const triggerDate = new Date();
  triggerDate.setSeconds(triggerDate.getSeconds() + 10);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧪 Test Notificación',
      body: '¡Las notificaciones programadas funcionan!',
      sound: 'default',
      data: { test: true },
    },
    trigger: dateToCalendarTrigger(triggerDate),
  });

  console.log('✅ Notificación de prueba programada para 10 s');
}

/**
 * 📋 Obtiene la lista de notificaciones programadas
 */
export async function getScheduledNotifications() {
  if (!Notifications) {
    console.warn('⚠️ Notificaciones no disponibles en Expo Go');
    return [];
  }

  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`📋 ${notifications.length} notificaciones programadas:`);
  notifications.forEach(notification => {
    console.log(' -', notification.identifier, notification.content.title);
  });
  return notifications;
}

/**
 * 🔐 Solicitar permisos de notificación
 */
export async function requestNotificationPermissions() {
  if (!Notifications) {
    console.warn('⚠️ Notificaciones no disponibles en Expo Go');
    return 'unavailable';
  }

  try {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus;
    }
    
    return status;
  } catch (error) {
    console.error('❌ Error solicitando permisos:', error);
    return 'denied';
  }
}

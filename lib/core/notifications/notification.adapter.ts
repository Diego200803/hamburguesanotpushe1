import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export const NotificationAdapter = {
  // 1. Configuración Global
  setup: () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  },

  // 2. Método Principal: Obtener el Token
  registerForPushNotificationsAsync: async (): Promise<string | null> => {
    let token;

    // A. Configuración específica para ANDROID
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // B. Verificación de Dispositivo Físico
    if (Device.isDevice) {
      // C. Gestión de Permisos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('¡Permiso denegado por el usuario!');
        return null;
      }

      // D. Obtener el Token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.error('⚠️ No se encontró projectId en app.json');
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync({
        projectId,
      })).data;

    } else {
      console.log('⚠️ Debes usar un dispositivo físico para probar Push Notifications');
    }

    return token || null;
  }
};
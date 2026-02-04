import { useEffect } from 'react';
import { Platform } from 'react-native';
import { supabase } from '../supabase/client.supabase';
import { NotificationAdapter } from './notification.adapter';

// Setup inicial fuera del componente
NotificationAdapter.setup();

export const usePushNotifications = (userId?: string) => {
  useEffect(() => {
    // Cláusula de guardia
    if (!userId) return;

    const register = async () => {
      // Llamada al adaptador
      const token = await NotificationAdapter.registerForPushNotificationsAsync();
      
      if (token) {
        console.log('✅ Token obtenido:', token);
        // Guardar en la base de datos
        await saveTokenToDatabase(token, userId);
      }
    };

    register();
    
  }, [userId]);
};

// Función auxiliar de Supabase
async function saveTokenToDatabase(token: string, userId: string) {
  const { error } = await supabase
    .from('devices')
    .upsert({ 
      user_id: userId,
      token: token,
      platform: Platform.OS,
      last_used_at: new Date().toISOString()
    }, { onConflict: 'token' });

  if (error) {
    console.error('❌ Error guardando device:', error);
  } else {
    console.log('✅ Dispositivo registrado en Supabase');
  }
}

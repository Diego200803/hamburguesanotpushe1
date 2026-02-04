import { usePushNotifications } from "@/lib/core/notifications/usePushNotifications";
import { AuthProvider, useAuth } from "@/lib/modules/auth/AuthProvider";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function AuthLayout() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // 1. Iniciamos el sistema de notificaciones
  const userId = session?.user.id;
  usePushNotifications(userId);

  // 2. Efecto de Protección de Rutas
  useEffect(() => {
    if (loading) return; // Esperamos a saber si hay sesión o no

    // Verificamos si estamos en el grupo de rutas de autenticación
    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // ⛔ Si NO hay usuario y NO estamos en login -> Mandar a Login
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      // ✅ Si HAY usuario y estamos en login -> Mandar al Home
      router.replace('/');
    }
  }, [session, loading, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ headerShown: false }} />
      <Stack.Screen 
        name="games/hamburguesa" 
        options={{ 
          headerShown: false,
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthLayout />
    </AuthProvider>
  );
}
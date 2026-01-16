import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function NavigationGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Si todavía está leyendo AsyncStorage, no hacemos nada
    if (loading) return;

    // Verificamos en qué grupo de rutas estamos
    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Si no hay usuario y no está en login/register, mandarlo a login
      router.replace('/auth/login' as any);
    } else if (user && inAuthGroup) {
      // Si hay usuario y está en el grupo de login, mandarlo a la app principal
      router.replace('/(tabs)' as any);
    }
  }, [user, loading, segments]);

  // MIENTRAS CARGA: Mostramos un spinner. 
  // Esto evita que la app parpadee o intente renderizar rutas protegidas.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFD700' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationGuard />
    </AuthProvider>
  );
}
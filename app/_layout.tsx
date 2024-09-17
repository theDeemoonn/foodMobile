import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {  Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { observer } from 'mobx-react-lite';
import authStore from '@/store/auth.store';

void SplashScreen.preventAutoHideAsync();



const RootLayout = observer(() => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  const [loaded, error] = useFonts({
    FiraCode: require('../assets/fonts/FiraCode-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      await authStore.checkAuth();
      setIsReady(true);
    };

    checkAuthAndNavigate();
  }, []);

  useEffect(() => {
    if (isReady) {
      const inAuthGroup = segments[0] === '(auth)';

      if (authStore.isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      } else if (!authStore.isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)');
      }
    }
  }, [isReady, authStore.isAuthenticated, segments]);

  if (!loaded || !isReady) {
    return null;
  }

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
  );
});

export default RootLayout;
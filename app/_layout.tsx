import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { observer } from 'mobx-react-lite';

import authStore from '@/store/auth.store';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authStore.isAuthenticated && segments[0] !== 'auth') {
      router.replace('/auth/login');
    } else if (authStore.isAuthenticated && segments[0] === 'auth') {
      router.replace('/(tabs)');
    }
  }, [authStore.isAuthenticated, segments]);

  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
  );
}

const RootLayout = observer(() => {
  const [loaded, error] = useFonts({
    FiraCode: require('../assets/fonts/FiraCode-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useEffect(() => {
  //   authStore.checkAuth();
  // }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
});

export default RootLayout;
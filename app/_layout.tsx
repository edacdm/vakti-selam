import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme';
import { I18nProvider } from '../i18n';
import VipSplash from '../components/VipSplash';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashFinished, setSplashFinished] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <I18nProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="Ayarlar" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
        {!splashFinished && (
          <VipSplash onFinish={() => setSplashFinished(true)} />
        )}
      </ThemeProvider>
    </I18nProvider>
  );
}
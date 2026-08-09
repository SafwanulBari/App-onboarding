import { Asset } from 'expo-asset';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreenModule from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  BalooDa2_400Regular,
  BalooDa2_500Medium,
  BalooDa2_600SemiBold,
  BalooDa2_700Bold,
} from '@expo-google-fonts/baloo-da-2';
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import OnboardingCarouselScreen from './src/screens/OnboardingCarouselScreen';
import { ONBOARDING_IMAGE_MODULES } from './src/onboarding/preload';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    BalooDa2_400Regular,
    BalooDa2_500Medium,
    BalooDa2_600SemiBold,
    BalooDa2_700Bold,
    SpaceGrotesk_300Light,
    SpaceGrotesk_700Bold,
  });
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    Asset.loadAsync(ONBOARDING_IMAGE_MODULES)
      .catch((e) => console.warn('Failed to preload onboarding images', e))
      .finally(() => setAssetsLoaded(true));
  }, []);

  const ready = fontsLoaded && assetsLoaded;

  const onLayout = useCallback(async () => {
    if (ready) {
      await SplashScreenModule.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        <StatusBar style="light" />
        <OnboardingCarouselScreen onFinish={() => console.log('Continue pressed')} />
      </View>
    </SafeAreaProvider>
  );
}

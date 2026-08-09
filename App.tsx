import { Asset } from 'expo-asset';
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
import LoginMobileNumberScreen from './src/screens/LoginMobileNumberScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import RegistrationNameScreen from './src/screens/RegistrationNameScreen';
import { APP_IMAGE_MODULES } from './src/onboarding/preload';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

type Screen = 'onboarding' | 'login' | 'otp' | 'registrationName';

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
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    Asset.loadAsync(APP_IMAGE_MODULES)
      .catch((e) => console.warn('Failed to preload app images', e))
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
        {screen === 'onboarding' && (
          <OnboardingCarouselScreen onFinish={() => setScreen('login')} />
        )}
        {screen === 'login' && (
          <LoginMobileNumberScreen
            onContinue={(phone) => {
              setPhoneNumber(phone);
              setScreen('otp');
            }}
            onSkip={() => console.log('Skipped login')}
          />
        )}
        {screen === 'otp' && (
          <OtpVerificationScreen
            phoneNumber={phoneNumber}
            onBack={() => setScreen('login')}
            onVerify={() => setScreen('registrationName')}
            onResend={() => console.log('Resend OTP requested')}
          />
        )}
        {screen === 'registrationName' && (
          <RegistrationNameScreen onContinue={(name) => console.log('Name entered:', name)} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

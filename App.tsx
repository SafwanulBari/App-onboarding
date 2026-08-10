import { Asset } from 'expo-asset';
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
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
import RegistrationClassScreen from './src/screens/RegistrationClassScreen';
import { APP_IMAGE_MODULES } from './src/onboarding/preload';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

type Screen = 'onboarding' | 'login' | 'otp' | 'registrationName' | 'registrationClass';

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
      {/* RN doesn't dismiss the keyboard on an outside tap by default —
          this wrapper does it globally for every screen. Touches on actual
          controls (TextInput, Pressable, etc.) are still handled by those
          elements first; only otherwise-unhandled taps reach this.
          Using Pressable, not TouchableWithoutFeedback: the Touchable*
          legacy components are built on the old responder system and are
          known to be unreliable under React Native's New Architecture,
          which Expo SDK 54 enables by default — that's the likely reason
          the first attempt (TouchableWithoutFeedback) didn't work on
          device despite being structurally correct. Pressable is the
          actively-maintained, New-Architecture-safe equivalent. */}
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
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
            <RegistrationNameScreen onContinue={() => setScreen('registrationClass')} />
          )}
          {screen === 'registrationClass' && (
            <RegistrationClassScreen
              onBack={() => setScreen('registrationName')}
              onSelectClass={(classId) => console.log('Class selected:', classId)}
            />
          )}
        </View>
      </Pressable>
    </SafeAreaProvider>
  );
}

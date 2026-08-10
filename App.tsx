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
import { NotoSansBengali_600SemiBold } from '@expo-google-fonts/noto-sans-bengali';
import OnboardingCarouselScreen from './src/screens/OnboardingCarouselScreen';
import LoginMobileNumberScreen from './src/screens/LoginMobileNumberScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import RegistrationNameScreen from './src/screens/RegistrationNameScreen';
import RegistrationClassScreen from './src/screens/RegistrationClassScreen';
import RegistrationBatchScreen from './src/screens/RegistrationBatchScreen';
import RegistrationGroupScreen from './src/screens/RegistrationGroupScreen';
import { APP_IMAGE_MODULES } from './src/onboarding/preload';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

type Screen =
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'registrationName'
  | 'registrationClass'
  | 'registrationBatch'
  | 'registrationGroup';

export default function App() {
  const [fontsLoaded] = useFonts({
    BalooDa2_400Regular,
    BalooDa2_500Medium,
    BalooDa2_600SemiBold,
    BalooDa2_700Bold,
    SpaceGrotesk_300Light,
    SpaceGrotesk_700Bold,
    NotoSansBengali_600SemiBold,
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
      {/* Keyboard-dismiss-on-outside-tap is handled per-screen (inside
          each screen that actually has a TextInput, via a ScrollView's
          built-in tap behavior) rather than with one global wrapper here
          — see LoginMobileNumberScreen / OtpVerificationScreen /
          RegistrationNameScreen. Two earlier attempts at a single global
          wrapper (TouchableWithoutFeedback, then Pressable) both failed
          on-device despite working in every other check, so this scopes
          the fix precisely to where it's needed instead of wrapping
          the whole app (including the onboarding carousel's animation-
          heavy absolute-positioned layout, which a ScrollView wrapper
          could risk disturbing). */}
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
            onSelectClass={(classId) => {
              console.log('Class selected:', classId);
              setScreen('registrationBatch');
            }}
          />
        )}
        {screen === 'registrationBatch' && (
          <RegistrationBatchScreen
            onBack={() => setScreen('registrationClass')}
            onSelectBatch={(batch) => {
              console.log('Batch selected:', batch);
              setScreen('registrationGroup');
            }}
          />
        )}
        {screen === 'registrationGroup' && (
          <RegistrationGroupScreen
            onBack={() => setScreen('registrationBatch')}
            onSelectGroup={(groupId) => console.log('Group selected:', groupId)}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

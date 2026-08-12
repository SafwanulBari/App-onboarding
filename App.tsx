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
import ScreenTransition from './src/components/ScreenTransition';
import { colors } from './src/theme/theme';
import OnboardingCarouselScreen from './src/screens/OnboardingCarouselScreen';
import LoginMobileNumberScreen from './src/screens/LoginMobileNumberScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import RegistrationFlowScreen from './src/screens/RegistrationFlowScreen';
import GuestFlowScreen from './src/screens/GuestFlowScreen';
import ConfirmationScreen from './src/screens/ConfirmationScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { APP_IMAGE_MODULES } from './src/onboarding/preload';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

type Screen =
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'registration'
  | 'guestFlow'
  | 'confirmation'
  | 'home'
  | 'profile';

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
          RegistrationFlowScreen's NameBody. Two earlier attempts at a single global
          wrapper (TouchableWithoutFeedback, then Pressable) both failed
          on-device despite working in every other check, so this scopes
          the fix precisely to where it's needed instead of wrapping
          the whole app (including the onboarding carousel's animation-
          heavy absolute-positioned layout, which a ScrollView wrapper
          could risk disturbing). */}
      <View style={{ flex: 1, backgroundColor: colors.white }} onLayout={onLayout}>
        {/* Every screen-to-screen move in this app goes through this one
            spot (there's no navigation library — `screen` is just state,
            see the type above), so wrapping the switch here gives every
            transition in the app the same subtle fade + slide-up "arrival"
            motion in one place, instead of adding it per-screen. See
            ScreenTransition for why it's entrance-only. */}
        <ScreenTransition screenKey={screen}>
          {screen === 'onboarding' && (
            <OnboardingCarouselScreen onFinish={() => setScreen('login')} />
          )}
          {screen === 'login' && (
            <LoginMobileNumberScreen
              onContinue={(phone) => {
                setPhoneNumber(phone);
                setScreen('otp');
              }}
              onSkip={() => setScreen('guestFlow')}
            />
          )}
          {screen === 'guestFlow' && (
            <GuestFlowScreen
              onExit={() => setScreen('login')}
              onComplete={(selection) => {
                console.log('Guest flow complete:', selection);
                setScreen('home');
              }}
            />
          )}
          {screen === 'otp' && (
            <OtpVerificationScreen
              phoneNumber={phoneNumber}
              onBack={() => setScreen('login')}
              onVerify={() => setScreen('registration')}
              onResend={() => console.log('Resend OTP requested')}
            />
          )}
          {screen === 'registration' && (
            <RegistrationFlowScreen
              onComplete={(password) => {
                console.log('Password saved, length:', password.length);
                setScreen('confirmation');
              }}
            />
          )}
          {screen === 'confirmation' && (
            <ConfirmationScreen onGoHome={() => setScreen('home')} />
          )}
          {screen === 'home' && (
            <HomeScreen
              onOpenProfile={() => setScreen('profile')}
              onSelectCourse={() => console.log('Course tab tapped (not built yet)')}
              onSelectAi={() => console.log('Shikho AI tab tapped (not built yet)')}
            />
          )}
          {screen === 'profile' && (
            <ProfileScreen
              onSelectHome={() => setScreen('home')}
              onSelectCourse={() => console.log('Course tab tapped (not built yet)')}
              onSelectAi={() => console.log('Shikho AI tab tapped (not built yet)')}
              onEditAvatar={() => console.log('Edit avatar pencil tapped')}
              onSaveProfilePicture={(selection) => console.log('Profile picture saved:', selection)}
              onOpenNotifications={() => console.log('Notifications tapped (not built yet)')}
              onEditProfile={() => console.log('Profile edit tapped (not built yet)')}
              onChangeSyllabus={() => console.log('Syllabus change tapped (not built yet)')}
              onOpenSavedQuestions={() => console.log('Saved questions tapped (not built yet)')}
              onOpenVideoDownloads={() => console.log('Video downloads tapped (not built yet)')}
              onOpenAdmissionInfo={() => console.log('Admission info tapped (not built yet)')}
              onOpenSettings={() => console.log('Settings tapped (not built yet)')}
            />
          )}
        </ScreenTransition>
      </View>
    </SafeAreaProvider>
  );
}

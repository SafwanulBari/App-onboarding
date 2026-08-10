import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { CHECK_SMALL_SVG_XML } from '../assets/svg/checkSmall';
import PasswordBoxInput from '../components/PasswordBoxInput';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, fonts, useScale } from '../theme/theme';

const PASSWORD_LENGTH = 6;
// Full progress — this is the last step of the registration flow.
const PROGRESS = 1;

type Props = {
  onBack?: () => void;
  onSave?: (password: string) => void;
};

// Figma: "7. Registration - Set Pasword" — node 54:1870
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-1870
export default function RegistrationPasswordScreen({ onBack, onSave }: Props) {
  const scale = useScale();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordComplete = password.length === PASSWORD_LENGTH;
  // The design shows the confirm-password field in a visibly disabled
  // state (gray50 boxes, gray500 label) with no "both filled" reference
  // shown — the standard, safe reading is that it unlocks once the first
  // password is fully entered, rather than being enterable from the start.
  const isConfirmEnabled = isPasswordComplete;
  const isSaveEnabled =
    isPasswordComplete && confirmPassword.length === PASSWORD_LENGTH && password === confirmPassword;

  const handleSave = () => {
    if (isSaveEnabled) {
      onSave?.(password);
    }
  };

  return (
    <LinearGradient
      colors={[colors.registrationGradientStart, colors.registrationGradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* ScrollView so tapping outside the keyboard dismisses it — see
            LoginMobileNumberScreen for why "handled" (not "never"). */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <RegistrationHeader progress={PROGRESS} onBack={onBack} />

          <View style={{ marginTop: scale(28) }}>
            <RegistrationMascotCard
              title="পাসওয়ার্ড সেট করো"
              subtitle="পরবর্তীতে সহজেই লগ ইন করতে পাসওয়ার্ড সেট করে নাও"
            />
          </View>

          <View style={{ marginTop: scale(64), paddingHorizontal: scale(20), gap: scale(40) }}>
            <View style={{ alignItems: 'center', gap: scale(8) }}>
              <View style={{ alignItems: 'center', gap: scale(8) }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: scale(18),
                    lineHeight: scale(18) * 1.5,
                    color: colors.secondaryNeutral950,
                  }}
                >
                  পাসওয়ার্ড
                </Text>
                <PasswordBoxInput length={PASSWORD_LENGTH} value={password} onChangeValue={setPassword} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                <SvgXml xml={CHECK_SMALL_SVG_XML} width={scale(14)} height={scale(14)} />
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: scale(12),
                    lineHeight: scale(12) * 1.6,
                    color: colors.gray600,
                  }}
                >
                  *৬ সংখ্যার পাসওয়ার্ড
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', gap: scale(8) }}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: scale(18),
                  lineHeight: scale(18) * 1.5,
                  color: isConfirmEnabled ? colors.secondaryNeutral950 : colors.gray500,
                }}
              >
                পাসওয়ার্ড কনফার্ম করো
              </Text>
              <PasswordBoxInput
                length={PASSWORD_LENGTH}
                value={confirmPassword}
                onChangeValue={setConfirmPassword}
                disabled={!isConfirmEnabled}
              />
            </View>
          </View>

          {/* marginTop: 'auto' pins this to the bottom of the screen
              (matching the design's fixed bottom:20 placement) rather than
              flowing directly under the fields, same technique as the
              skip-link on LoginMobileNumberScreen. */}
          <View style={{ marginTop: 'auto', paddingHorizontal: scale(20), paddingBottom: scale(20), paddingTop: scale(40) }}>
            <Pressable
              onPress={handleSave}
              disabled={!isSaveEnabled}
              style={({ pressed }) => ({
                height: scale(48),
                borderRadius: scale(12),
                backgroundColor: isSaveEnabled ? colors.primary500 : colors.gray400,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed && isSaveEnabled ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: scale(14),
                  lineHeight: scale(14) * 1.6,
                  color: colors.white,
                }}
              >
                সেভ করো
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

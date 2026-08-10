import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import {
  CHECK_SMALL_SVG_XML,
  CHECK_SMALL_SUCCESS_SVG_XML,
  CHECK_SMALL_SUCCESS_14_SVG_XML,
} from '../assets/svg/checkSmall';
import { ERROR_X_SVG_XML } from '../assets/svg/errorX';
import { EYE_HIDE_SVG_XML } from '../assets/svg/eyeHide';
import { EYE_SHOW_SVG_XML } from '../assets/svg/eyeShow';
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
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const [isConfirmRevealed, setIsConfirmRevealed] = useState(false);

  const isPasswordComplete = password.length === PASSWORD_LENGTH;
  // The design shows the confirm-password field in a visibly disabled
  // state (gray50 boxes, gray500 label) with no "both filled" reference
  // shown — the standard, safe reading is that it unlocks once the first
  // password is fully entered, rather than being enterable from the start.
  const isConfirmEnabled = isPasswordComplete;
  const isConfirmComplete = confirmPassword.length === PASSWORD_LENGTH;
  // "7. Registration - Set Pasword - Wrong Pasword" (node 54:2196): only
  // flag a mismatch once confirm-password is fully entered, not while
  // it's still partway through being typed.
  const hasMismatchError = isConfirmEnabled && isConfirmComplete && password !== confirmPassword;
  const isSaveEnabled = isPasswordComplete && isConfirmComplete && password === confirmPassword;

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
              titleWeight="semiBold"
              mascotVariant={isSaveEnabled ? 'success' : 'default'}
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
                <PasswordBoxInput
                  length={PASSWORD_LENGTH}
                  value={password}
                  onChangeValue={setPassword}
                  revealed={isPasswordRevealed}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
                  <SvgXml
                    xml={isPasswordComplete ? CHECK_SMALL_SUCCESS_SVG_XML : CHECK_SMALL_SVG_XML}
                    width={scale(isPasswordComplete ? 16 : 14)}
                    height={scale(isPasswordComplete ? 16 : 14)}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: scale(12),
                      lineHeight: scale(12) * 1.6,
                      color: isPasswordComplete ? colors.success600 : colors.gray600,
                    }}
                  >
                    *৬ সংখ্যার পাসওয়ার্ড
                  </Text>
                </View>
                <Pressable
                  onPress={() => setIsPasswordRevealed((v) => !v)}
                  hitSlop={8}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}
                >
                  <SvgXml
                    xml={isPasswordRevealed ? EYE_HIDE_SVG_XML : EYE_SHOW_SVG_XML}
                    width={scale(16)}
                    height={scale(16)}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: scale(12),
                      lineHeight: scale(12) * 1.6,
                      color: colors.primary500,
                      textDecorationLine: 'underline',
                    }}
                  >
                    {isPasswordRevealed ? 'হাইড পিন' : 'পিন দেখো'}
                  </Text>
                </Pressable>
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
                revealed={isConfirmRevealed}
                error={hasMismatchError}
              />
              {/* This helper/toggle row only exists once confirm-password
                  has content in the design (54:2287) — there's no row
                  here at all while it's empty/disabled. */}
              {isConfirmEnabled && confirmPassword.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  {hasMismatchError ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                      <SvgXml xml={ERROR_X_SVG_XML} width={scale(14)} height={scale(14)} />
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: scale(12),
                          lineHeight: scale(12) * 1.6,
                          color: colors.error500,
                        }}
                      >
                        পাসওয়ার্ড সঠিক নয়
                      </Text>
                    </View>
                  ) : isConfirmComplete ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
                      <SvgXml xml={CHECK_SMALL_SUCCESS_14_SVG_XML} width={scale(14)} height={scale(14)} />
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: scale(12),
                          lineHeight: scale(12) * 1.6,
                          color: colors.success600,
                        }}
                      >
                        সঠিক
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                  <Pressable
                    onPress={() => setIsConfirmRevealed((v) => !v)}
                    hitSlop={8}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}
                  >
                    <SvgXml
                      xml={isConfirmRevealed ? EYE_HIDE_SVG_XML : EYE_SHOW_SVG_XML}
                      width={scale(16)}
                      height={scale(16)}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: scale(12),
                        lineHeight: scale(12) * 1.6,
                        color: colors.primary500,
                        textDecorationLine: 'underline',
                      }}
                    >
                      {isConfirmRevealed ? 'হাইড পিন' : 'পিন দেখো'}
                    </Text>
                  </Pressable>
                </View>
              )}
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

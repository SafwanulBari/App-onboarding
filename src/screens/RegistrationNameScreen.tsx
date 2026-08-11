import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, fonts, useScale } from '../theme/theme';

// This is step 1 of the registration flow (progress fill = 66/372, the
// exact ratio Figma shows on node 54:3221) — later steps pass their own
// `progress` to RegistrationHeader.
const PROGRESS = 66 / 372;

type Props = {
  onContinue?: (name: string) => void;
};

// Figma: "2. Registration - Name" — node 54:3221
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-3221
export default function RegistrationNameScreen({ onContinue }: Props) {
  const scale = useScale();
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isEnabled = name.trim().length > 0;

  const handleContinue = () => {
    if (isEnabled) {
      onContinue?.(name.trim());
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
        {/* Figma's "typing" state (node 54:3293) shows the CTA sitting
            right above the keyboard and the name field re-centered in the
            shrunken space above it, instead of the CTA staying pinned to
            the (now keyboard-covered) screen bottom. KeyboardAvoidingView
            is RN's own built-in mechanism for this — same "prefer RN's
            built-ins over a hand-wired solution" call as the ScrollView
            dismiss-on-tap approach below: it shrinks this container by the
            keyboard's height, which in turn shrinks the ScrollView's
            flexGrow content, so the input's `flex: 1, justifyContent:
            'center'` wrapper re-centers in the smaller visible area and
            the CTA (last in the content flow) lands right above the
            keyboard automatically — no manual keyboard-height listener
            needed. */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* ScrollView so tapping outside the keyboard dismisses it — RN's
              own built-in behavior, not a manual wrapper. See
              LoginMobileNumberScreen for why, and why
              keyboardShouldPersistTaps is "handled" and not "never" (the
              latter also swallows taps on the CTA button, verified
              in-browser before shipping). */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <RegistrationHeader progress={PROGRESS} />

            <View style={{ marginTop: scale(28) }}>
              <RegistrationMascotCard
                title="তোমার নাম কি?"
                subtitle="এই নামটি তোমার প্রোফাইল, সার্টিফিকেট এবং শেখার অগ্রগতিতে ব্যবহার করা হবে।"
              />
            </View>

            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scale(20) }}>
              <View style={{ height: scale(24) * 1.6 }}>
                {/* Custom placeholder (regular gray700) instead of the native
                    `placeholder` prop, since typed text needs a different
                    weight/color (semibold, #0A0A0A) than the placeholder, and
                    RN's TextInput style applies to both. */}
                {name.length === 0 && (
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontFamily: fonts.regular,
                      fontSize: scale(24),
                      lineHeight: scale(24) * 1.6,
                      color: colors.gray700,
                      pointerEvents: 'none',
                    }}
                  >
                    তোমার নাম লেখো
                  </Text>
                )}
                <TextInput
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoFocus
                  cursorColor={colors.primary500}
                  selectionColor={colors.primary500}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    fontFamily: fonts.semiBold,
                    fontSize: scale(24),
                    lineHeight: scale(24) * 1.6,
                    color: colors.secondaryNeutral950,
                    textAlign: 'center',
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: scale(12),
                  height: scale(1.5),
                  borderRadius: scale(1),
                  backgroundColor: isFocused ? colors.primary500 : colors.secondaryNeutral600,
                }}
              />
            </View>

            <View style={{ backgroundColor: colors.white, padding: scale(20) }}>
              <Pressable
                onPress={handleContinue}
                disabled={!isEnabled}
                style={({ pressed }) => ({
                  height: scale(48),
                  borderRadius: scale(12),
                  backgroundColor: isEnabled ? colors.primary500 : colors.gray400,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed && isEnabled ? 0.85 : 1,
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
                  এগিয়ে যাও
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

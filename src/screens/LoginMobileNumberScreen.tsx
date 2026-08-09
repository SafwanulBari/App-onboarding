import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { ARROW_RIGHT_SVG_XML } from '../assets/svg/arrowRight';
import { CHEVRON_DOWN_SVG_XML } from '../assets/svg/chevronDown';
import { LOGIN_ILLUSTRATION_SVG_XML } from '../assets/svg/loginIllustration';
import { resolveCrop } from '../onboarding/resolveCrop';
import { colors, fonts, useScale } from '../theme/theme';
import { toBengaliDigits } from '../utils/bengaliDigits';

const flagImage = require('../../assets/login/flag-bd.png');

// A local BD mobile number (with leading 0, no country code) is 11 digits,
// e.g. 01712345678 — the CTA only enables at the full length.
const REQUIRED_DIGITS = 11;

type Props = {
  onContinue?: (phoneNumber: string) => void;
  onSkip?: () => void;
};

// Figma: "Login - Mobile Number" (+ its "Typing" and "Filled" states) — nodes
// 54:18912, 54:19068, 54:18990
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-18912
export default function LoginMobileNumberScreen({ onContinue, onSkip }: Props) {
  const scale = useScale();
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const flagCrop = resolveCrop(
    { left: '-6.17%', top: '0%', width: '123.46%', height: '100%' },
    scale(20),
    scale(14.815)
  );

  const isEnabled = phone.length >= REQUIRED_DIGITS;

  const handleChangeText = (text: string) => {
    setPhone(text.replace(/\D/g, '').slice(0, REQUIRED_DIGITS));
  };

  const handleContinue = () => {
    if (isEnabled) {
      onContinue?.(phone);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, paddingHorizontal: scale(20), alignItems: 'center' }}>
          <View style={{ marginTop: scale(48), width: scale(98.4), height: scale(163.744) }}>
            <SvgXml
              xml={LOGIN_ILLUSTRATION_SVG_XML}
              width={scale(98.4)}
              height={scale(163.744)}
            />
          </View>

          <View style={{ marginTop: scale(48.26), width: '100%', alignItems: 'center', gap: scale(4) }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: scale(20),
                lineHeight: scale(20) * 1.5,
                color: colors.gray900,
                textAlign: 'center',
              }}
            >
              মোবাইল নম্বর দিয়ে এগিয়ে যাও
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: scale(12),
                lineHeight: scale(12) * 1.6,
                color: colors.gray600,
                textAlign: 'center',
                width: scale(338),
              }}
            >
              আপনার যে নম্বরে One Time Password (OTP) পাঠানো হবে অথবা যে নম্বর দিয়ে আপনি ইতোমধ্যে
              রেজিস্ট্রেশন করেছেন
            </Text>
          </View>

          <View style={{ marginTop: scale(32), width: '100%' }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: scale(14),
                lineHeight: scale(14) * 1.5,
                color: colors.gray800,
              }}
            >
              মোবাইল নম্বর
            </Text>
            <View
              style={{
                marginTop: scale(6),
                height: scale(54),
                borderRadius: scale(12),
                backgroundColor: isFocused ? colors.accent100 : colors.gray200,
                borderWidth: isFocused ? 1 : 0,
                borderColor: colors.primary500,
                flexDirection: 'row',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  margin: scale(2),
                  height: scale(50),
                  borderRadius: scale(10),
                  backgroundColor: colors.white,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: scale(10),
                  gap: scale(6),
                }}
              >
                <View
                  style={{
                    width: scale(20),
                    height: scale(14.815),
                    borderRadius: scale(2),
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={flagImage}
                    style={{
                      position: 'absolute',
                      left: flagCrop.left,
                      top: flagCrop.top,
                      width: flagCrop.width,
                      height: flagCrop.height,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: scale(14),
                    lineHeight: scale(14) * 1.6,
                    color: colors.gray900,
                  }}
                >
                  +88
                </Text>
                <SvgXml xml={CHEVRON_DOWN_SVG_XML} width={scale(8)} height={scale(5.15)} />
              </View>

              <View style={{ flex: 1, justifyContent: 'center' }}>
                {phone.length === 0 && (
                  <Text
                    pointerEvents="none"
                    style={{
                      position: 'absolute',
                      left: scale(12),
                      fontFamily: fonts.regular,
                      fontSize: scale(14),
                      lineHeight: scale(14) * 1.6,
                      color: colors.gray700,
                    }}
                  >
                    মোবাইল নম্বর দিন
                  </Text>
                )}
                <TextInput
                  value={toBengaliDigits(phone)}
                  onChangeText={handleChangeText}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  keyboardType="phone-pad"
                  maxLength={REQUIRED_DIGITS}
                  cursorColor={colors.primary500}
                  selectionColor={colors.primary500}
                  style={{
                    paddingHorizontal: scale(12),
                    fontFamily: fonts.semiBold,
                    fontSize: scale(14),
                    color: colors.secondaryNeutral950,
                  }}
                />
              </View>
            </View>

            <Pressable
              onPress={handleContinue}
              disabled={!isEnabled}
              style={({ pressed }) => ({
                marginTop: scale(32),
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

          <Pressable
            onPress={onSkip}
            style={{
              marginTop: 'auto',
              marginBottom: scale(60),
              flexDirection: 'row',
              alignItems: 'center',
              gap: scale(4),
            }}
          >
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: scale(14),
                lineHeight: scale(14) * 1.6,
                color: colors.primary500,
                textDecorationLine: 'underline',
              }}
            >
              অ্যাকাউন্ট ছাড়াই ব্যবহার করো
            </Text>
            <SvgXml xml={ARROW_RIGHT_SVG_XML} width={scale(16)} height={scale(16)} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

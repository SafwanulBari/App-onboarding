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

const flagImage = require('../../assets/login/flag-bd.png');

// A real BD mobile number is 10 digits after the +88 country code
// (e.g. 1XXXXXXXXX) — used only to gate the CTA, not full validation.
const MIN_DIGITS = 10;

type Props = {
  onContinue?: (phoneNumber: string) => void;
  onSkip?: () => void;
};

// Figma: "Login - Mobile Number" — node 54:18912
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-18912
export default function LoginMobileNumberScreen({ onContinue, onSkip }: Props) {
  const scale = useScale();
  const [phone, setPhone] = useState('');

  const flagCrop = resolveCrop(
    { left: '-6.17%', top: '0%', width: '123.46%', height: '100%' },
    scale(20),
    scale(14.815)
  );

  const digitCount = phone.replace(/\D/g, '').length;
  const isEnabled = digitCount >= MIN_DIGITS;

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
              তোমার যে নম্বরে One Time Password (OTP) পাঠানো হবে অথবা যে নম্বর দিয়ে আপনি ইতোমধ্যে
              রেজিস্ট্রেশন করেছো
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
                backgroundColor: colors.gray200,
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
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="মোবাইল নম্বর দিন"
                placeholderTextColor={colors.gray700}
                keyboardType="phone-pad"
                style={{
                  flex: 1,
                  paddingHorizontal: scale(12),
                  fontFamily: fonts.regular,
                  fontSize: scale(14),
                  color: colors.gray900,
                }}
              />
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

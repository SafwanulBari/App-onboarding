import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { ARROW_LEFT_SVG_XML } from '../assets/svg/arrowLeft';
import { OTP_ILLUSTRATION_SVG_XML } from '../assets/svg/otpIllustration';
import OtpBoxInput from '../components/OtpBoxInput';
import { colors, fonts, useScale } from '../theme/theme';
import { toBengaliDigits } from '../utils/bengaliDigits';
import { maskPhoneNumber } from '../utils/maskPhoneNumber';

const OTP_LENGTH = 4;
const RESEND_COOLDOWN_SECONDS = 45;

type Props = {
  phoneNumber: string;
  onBack?: () => void;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
};

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return toBengaliDigits(`${minutes}:${seconds}`);
}

// Figma: "OTP Verification" — node 54:18560
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-18560
export default function OtpVerificationScreen({ phoneNumber, onBack, onVerify, onResend }: Props) {
  const scale = useScale();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [secondsLeft <= 0]);

  const isEnabled = otp.length >= OTP_LENGTH;

  const handleVerify = () => {
    if (isEnabled) {
      onVerify?.(otp);
    }
  };

  const handleResend = () => {
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    onResend?.();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, paddingHorizontal: scale(20) }}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={{ marginTop: scale(12), width: scale(24), height: scale(24) }}
          >
            <SvgXml xml={ARROW_LEFT_SVG_XML} width={scale(24)} height={scale(24)} />
          </Pressable>

          <View style={{ marginTop: scale(12), alignItems: 'center' }}>
            <SvgXml
              xml={OTP_ILLUSTRATION_SVG_XML}
              width={scale(157.926)}
              height={scale(163.478)}
            />
          </View>

          <View style={{ marginTop: scale(40), alignItems: 'center' }}>
            <View style={{ alignItems: 'center', gap: scale(4) }}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: scale(20),
                  lineHeight: scale(20) * 1.5,
                  color: colors.gray900,
                }}
              >
                মোবাইল নম্বর ভেরিফাই করো
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
                আপনার {maskPhoneNumber(phoneNumber)} নম্বরে{' '}
                <Text style={{ fontFamily: fonts.semiBold, color: colors.gray900 }}>৪ সংখ্যার</Text>{' '}
                One Time Password (OTP) পাঠানো হয়েছে
              </Text>
            </View>

            <View style={{ marginTop: scale(32), alignItems: 'center' }}>
              <OtpBoxInput length={OTP_LENGTH} value={otp} onChangeValue={setOtp} />
            </View>

            <View style={{ marginTop: scale(24), alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: scale(12),
                  lineHeight: scale(12) * 1.6,
                  color: colors.gray600,
                  textAlign: 'center',
                }}
              >
                কোনো OTP পাওনি?{'\n'}আবার OTP পাঠানোর অনুরোধ জানাতে অপেক্ষা করো:{' '}
                {secondsLeft > 0 ? (
                  <Text style={{ fontFamily: fonts.medium, color: colors.secondary500 }}>
                    {formatCountdown(secondsLeft)} সেকেন্ড
                  </Text>
                ) : (
                  <Text
                    onPress={handleResend}
                    style={{ fontFamily: fonts.medium, color: colors.primary500, textDecorationLine: 'underline' }}
                  >
                    আবার পাঠাও
                  </Text>
                )}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleVerify}
            disabled={!isEnabled}
            style={({ pressed }) => ({
              marginTop: scale(48),
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
              ভেরিফাই করো
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

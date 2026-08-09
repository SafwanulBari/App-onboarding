import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { REGISTRATION_BUBBLE_SVG_XML } from '../assets/svg/registrationBubble';
import RegistrationProgressBar from '../components/RegistrationProgressBar';
import { resolveCrop } from '../onboarding/resolveCrop';
import { colors, fonts, useScale } from '../theme/theme';

const mascotImage = require('../../assets/registration/mascot.png');

// This is step 1 of the registration flow (progress fill = 66/372, the
// exact ratio Figma shows on node 54:3221) — later steps will pass their
// own `progress` to RegistrationProgressBar once those screens exist.
const PROGRESS = 66 / 372;

type Props = {
  onContinue?: (name: string) => void;
};

// Figma: "2. Registration - Name" — node 54:3221
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-3221
export default function RegistrationNameScreen({ onContinue }: Props) {
  const scale = useScale();
  const [name, setName] = useState('');

  const mascotCrop = resolveCrop(
    { left: '-16.37%', top: '-5.37%', width: '130.52%', height: '110.72%' },
    scale(56),
    scale(54)
  );

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
        <View style={{ paddingHorizontal: scale(20), paddingTop: scale(8) }}>
          <RegistrationProgressBar progress={PROGRESS} />
        </View>

        <View
          style={{
            marginTop: scale(28),
            paddingHorizontal: scale(20),
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <View
            style={{
              width: scale(56),
              height: scale(54),
              borderRadius: scale(8),
              overflow: 'hidden',
            }}
          >
            <Image
              source={mascotImage}
              style={{
                position: 'absolute',
                left: mascotCrop.left,
                top: mascotCrop.top,
                width: mascotCrop.width,
                height: mascotCrop.height,
              }}
            />
          </View>

          <View style={{ flex: 1, height: scale(107), marginLeft: scale(4) }}>
            <SvgXml
              xml={REGISTRATION_BUBBLE_SVG_XML}
              width="100%"
              height={scale(107)}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
            <View style={{ paddingLeft: scale(24.48), paddingRight: scale(20), paddingTop: scale(16) }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: scale(18),
                  lineHeight: scale(18) * 1.5,
                  color: colors.gray900,
                }}
              >
                তোমার নাম কি?
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: scale(14),
                  lineHeight: scale(14) * 1.6,
                  color: colors.gray900,
                  marginTop: scale(4),
                }}
              >
                এই নামটি তোমার প্রোফাইল, সার্টিফিকেট এবং শেখার অগ্রগতিতে ব্যবহার করা হবে।
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scale(20) }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="তোমার নাম লেখো"
            placeholderTextColor={colors.gray700}
            autoFocus
            style={{
              fontFamily: fonts.regular,
              fontSize: scale(24),
              lineHeight: scale(24) * 1.6,
              color: colors.gray900,
              textAlign: 'center',
            }}
          />
          <View
            style={{
              marginTop: scale(12),
              height: scale(1.5),
              borderRadius: scale(1),
              backgroundColor: colors.secondaryNeutral600,
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
      </SafeAreaView>
    </LinearGradient>
  );
}

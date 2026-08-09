import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  onContinue?: () => void;
};

// Sticky CTA button + microcopy shown under every onboarding slide. Identical
// across slides, so it's rendered once by OnboardingCarouselScreen and never
// moves during the carousel's slide transition.
export default function OnboardingFooter({ onContinue }: Props) {
  const scale = useScale();

  return (
    <View
      style={{
        marginTop: 'auto',
        paddingHorizontal: scale(20),
        paddingBottom: scale(30),
        alignItems: 'center',
        gap: scale(12),
      }}
    >
      <Pressable
        onPress={onContinue}
        style={({ pressed }) => ({
          width: '100%',
          height: scale(48),
          borderRadius: scale(12),
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: scale(14),
            lineHeight: scale(14) * 1.5,
            color: colors.gray900,
          }}
        >
          এগিয়ে যাও
        </Text>
      </Pressable>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: scale(12),
          lineHeight: scale(12) * 1.6,
          color: colors.white,
          textAlign: 'center',
        }}
      >
        <Text style={{ fontFamily: fonts.semiBold }}>৩০ লক্ষ+</Text> শিক্ষার্থীদের সাথে শেখা শুরু
        করো
      </Text>
    </View>
  );
}

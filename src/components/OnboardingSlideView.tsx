import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import PaginationDots from './PaginationDots';
import type { OnboardingSlideData } from '../onboarding/types';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  slide: OnboardingSlideData;
  totalDots: number;
  onContinue?: () => void;
};

// Shared chrome for every onboarding splash screen (Figma "Splash Screen 9/10/…"):
// gradient bg, headline+subhead, hero photo w/ swirl, pagination dots, CTA + microcopy.
// Per-slide content comes from `slide` (see src/onboarding/slides.ts).
export default function OnboardingSlideView({ slide, totalDots, onContinue }: Props) {
  const scale = useScale();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ paddingHorizontal: scale(20), paddingTop: scale(32), alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: scale(24),
              lineHeight: scale(24) * 1.5,
              color: colors.white,
              textAlign: 'center',
            }}
          >
            {slide.title}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: scale(14),
              lineHeight: scale(14) * 1.6,
              color: colors.gray100,
              textAlign: 'center',
              marginTop: scale(8),
              width: slide.subtitleWidth ? scale(slide.subtitleWidth) : undefined,
            }}
          >
            {slide.subtitle}
          </Text>
        </View>

        <View style={{ marginTop: scale(slide.gapBeforeHero), height: scale(slide.heroHeight), width: '100%' }}>
          <View
            style={{
              position: 'absolute',
              top: scale(slide.swirl.top),
              left: 0,
              width: '100%',
              height: scale(slide.swirl.height),
            }}
          >
            <SvgXml xml={slide.swirl.xml} width="100%" height={scale(slide.swirl.height)} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: scale(20),
              width: scale(372),
              height: scale(320),
              overflow: 'hidden',
            }}
          >
            {/* Reproduces Figma's image-fill crop exactly: the source photo is
                scaled/offset per slide.imageCrop rather than a centered "cover"
                fit, so the intended focal point (faces, etc.) stays in frame. */}
            <Image
              source={slide.image}
              style={{
                position: 'absolute',
                left: slide.imageCrop.left,
                top: slide.imageCrop.top,
                width: slide.imageCrop.width,
                height: slide.imageCrop.height,
              }}
            />
          </View>
        </View>

        <PaginationDots count={totalDots} activeIndex={slide.activeDotIndex} />

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
            <Text style={{ fontFamily: fonts.semiBold }}>৩০ লক্ষ+</Text> শিক্ষার্থীদের সাথে শেখা
            শুরু করো
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

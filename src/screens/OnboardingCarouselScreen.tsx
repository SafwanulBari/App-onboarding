import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingFooter from '../components/OnboardingFooter';
import OnboardingSlideContent from '../components/OnboardingSlideContent';
import PaginationDots from '../components/PaginationDots';
import { ONBOARDING_SLIDES, SLIDE_CONTENT_HEIGHT, TOTAL_ONBOARDING_DOTS } from '../onboarding/slides';
import { colors, useScale } from '../theme/theme';

const AUTO_ADVANCE_DELAY_MS = 1500;
const SLIDE_TRANSITION_MS = 450;

type Props = {
  onFinish?: () => void;
};

// Auto-advancing onboarding intro. Only the headline/subhead + hero image
// section slide horizontally (carousel-style, outgoing pushed left as the
// next one enters from the right); the gradient background, pagination
// dots, and CTA footer are sticky chrome rendered once and never move.
// Loops continuously — after the last slide it wraps back to the first.
export default function OnboardingCarouselScreen({ onFinish }: Props) {
  const { width } = useWindowDimensions();
  const scale = useScale();
  const [index, setIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  // 0 -> 1 progress through the current transition, not a width-scaled value —
  // interpolated below via .interpolate(), the standard/well-tested RN
  // pattern for this, rather than mixing Animated.multiply/subtract with a
  // window-width operand (which was never actually confirmed correct on a
  // real device, only reasoned about).
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Don't schedule a transition until we have a real, measured window
    // width — animating against width=0 (possible for a frame on some
    // devices before layout settles) would make outgoing/incoming both
    // render at the same position instead of off-screen.
    if (!width) {
      return;
    }

    const timer = setTimeout(() => {
      const next = (index + 1) % ONBOARDING_SLIDES.length;
      progress.setValue(0);
      setIncomingIndex(next);
      Animated.timing(progress, {
        toValue: 1,
        duration: SLIDE_TRANSITION_MS,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIndex(next);
        setIncomingIndex(null);
        progress.setValue(0);
      });
    }, AUTO_ADVANCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [index, width, progress]);

  const outgoingTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });
  const incomingTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0],
  });
  const activeDotIndex = incomingIndex ?? index;

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ width: '100%', height: scale(SLIDE_CONTENT_HEIGHT), overflow: 'hidden' }}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { width, transform: [{ translateX: outgoingTranslateX }] }]}
          >
            <OnboardingSlideContent slide={ONBOARDING_SLIDES[index]} />
          </Animated.View>
          {incomingIndex !== null && (
            <Animated.View
              style={[StyleSheet.absoluteFill, { width, transform: [{ translateX: incomingTranslateX }] }]}
            >
              <OnboardingSlideContent slide={ONBOARDING_SLIDES[incomingIndex]} />
            </Animated.View>
          )}
        </View>

        <PaginationDots count={TOTAL_ONBOARDING_DOTS} activeIndex={activeDotIndex} />

        <OnboardingFooter onContinue={onFinish} />
      </SafeAreaView>
    </LinearGradient>
  );
}

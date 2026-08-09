import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = (index + 1) % ONBOARDING_SLIDES.length;
      shift.setValue(0);
      setIncomingIndex(next);
      Animated.timing(shift, {
        toValue: width,
        duration: SLIDE_TRANSITION_MS,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIndex(next);
        setIncomingIndex(null);
        shift.setValue(0);
      });
    }, AUTO_ADVANCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [index, width, shift]);

  const outgoingTranslateX = Animated.multiply(shift, -1);
  const incomingTranslateX = Animated.subtract(width, shift);
  const activeDotIndex = incomingIndex ?? index;

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <Animated.View style={{ height: scale(SLIDE_CONTENT_HEIGHT), overflow: 'hidden' }}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { transform: [{ translateX: outgoingTranslateX }] }]}
          >
            <OnboardingSlideContent slide={ONBOARDING_SLIDES[index]} />
          </Animated.View>
          {incomingIndex !== null && (
            <Animated.View
              style={[StyleSheet.absoluteFill, { transform: [{ translateX: incomingTranslateX }] }]}
            >
              <OnboardingSlideContent slide={ONBOARDING_SLIDES[incomingIndex]} />
            </Animated.View>
          )}
        </Animated.View>

        <PaginationDots count={TOTAL_ONBOARDING_DOTS} activeIndex={activeDotIndex} />

        <OnboardingFooter onContinue={onFinish} />
      </SafeAreaView>
    </LinearGradient>
  );
}

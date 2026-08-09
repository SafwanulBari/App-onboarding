import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import OnboardingSlideView from '../components/OnboardingSlideView';
import { ONBOARDING_SLIDES, TOTAL_ONBOARDING_DOTS } from '../onboarding/slides';

const AUTO_ADVANCE_DELAY_MS = 1500;
const SLIDE_TRANSITION_MS = 450;

type Props = {
  onFinish?: () => void;
};

// Auto-advancing onboarding intro: shows each slide in ONBOARDING_SLIDES for
// 1.5s, then smoothly slides (carousel-style, outgoing slide pushed left as
// the next one enters from the right) into the next one. Loops continuously
// — after the last slide it wraps back around to the first. The CTA button
// (onFinish) is the way out, independent of this loop.
export default function OnboardingCarouselScreen({ onFinish }: Props) {
  const { width } = useWindowDimensions();
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

  return (
    <Animated.View style={{ flex: 1, overflow: 'hidden' }}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX: outgoingTranslateX }] }]}
      >
        <OnboardingSlideView
          slide={ONBOARDING_SLIDES[index]}
          totalDots={TOTAL_ONBOARDING_DOTS}
          onContinue={onFinish}
        />
      </Animated.View>
      {incomingIndex !== null && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { transform: [{ translateX: incomingTranslateX }] }]}
        >
          <OnboardingSlideView
            slide={ONBOARDING_SLIDES[incomingIndex]}
            totalDots={TOTAL_ONBOARDING_DOTS}
            onContinue={onFinish}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import OnboardingSlideView from '../components/OnboardingSlideView';
import { ONBOARDING_SLIDES, TOTAL_ONBOARDING_DOTS } from '../onboarding/slides';

const AUTO_ADVANCE_DELAY_MS = 1500;
const FADE_DURATION_MS = 200;

type Props = {
  onFinish?: () => void;
};

// Auto-advancing onboarding intro: shows each slide in ONBOARDING_SLIDES for
// 1.5s, then crossfades to the next one. Stops on the last slide currently
// available — add more entries to ONBOARDING_SLIDES and it keeps advancing.
export default function OnboardingCarouselScreen({ onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (index >= ONBOARDING_SLIDES.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION_MS,
        useNativeDriver: true,
      }).start(() => {
        setIndex((i) => Math.min(i + 1, ONBOARDING_SLIDES.length - 1));
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_DURATION_MS,
          useNativeDriver: true,
        }).start();
      });
    }, AUTO_ADVANCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [index, opacity]);

  const slide = ONBOARDING_SLIDES[index];

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <OnboardingSlideView slide={slide} totalDots={TOTAL_ONBOARDING_DOTS} onContinue={onFinish} />
    </Animated.View>
  );
}

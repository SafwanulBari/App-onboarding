import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

type Props = {
  // Whatever the current sub-step is (e.g. RegistrationFlowScreen's
  // 'name' | 'class' | ...) — used only to detect "this content just
  // changed" via the effect below, not rendered directly.
  stepKey: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const DURATION_MS = 220;
const SLIDE_PX = 8;

// Lighter sibling of ScreenTransition (see App.tsx) for content that swaps
// *within* an already-sticky screen shell — e.g. RegistrationFlowScreen's
// mascot text and step body, which change on every step but must not look
// like a full page navigation since the header/mascot/background around
// them never move. Shorter duration and a smaller slide than the
// top-level page transition, so it reads as "this bit of content updated"
// rather than "we went to a new screen".
export default function StepContentTransition({ stepKey, children, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // Only `stepKey` should retrigger this — `progress` is a stable ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SLIDE_PX, 0],
  });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

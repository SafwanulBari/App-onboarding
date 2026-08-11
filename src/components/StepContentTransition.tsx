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

const DURATION_MS = 260;
const SLIDE_PX = 10;
const SCALE_FROM = 0.97;
// A "smart animate"-style ease-out-quint curve (fast start, long smooth
// settle) — reads noticeably more premium than a plain Easing.out(cubic)
// at the same duration, without needing to slow the duration down to get
// there. Used for the same reason across every StepContentTransition
// instance (mascot text + step body) so the two stay visually consistent.
const SMART_ANIMATE_EASING = Easing.bezier(0.22, 1, 0.36, 1);

// Lighter sibling of ScreenTransition (see App.tsx) for content that swaps
// *within* an already-sticky screen shell — e.g. RegistrationFlowScreen's
// mascot text and step body, which change on every step but must not look
// like a full page navigation since the header/mascot/background around
// them never move. Shorter duration and a smaller slide than the
// top-level page transition, so it reads as "this bit of content updated"
// rather than "we went to a new screen". Combines fade + slide + a subtle
// scale-in (0.97 -> 1) — closer to Figma's "smart animate" feel than a
// bare opacity/translate pair — while staying quick enough not to read as
// sluggish.
export default function StepContentTransition({ stepKey, children, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: DURATION_MS,
      easing: SMART_ANIMATE_EASING,
      useNativeDriver: true,
    }).start();
    // Only `stepKey` should retrigger this — `progress` is a stable ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepKey]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SLIDE_PX, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SCALE_FROM, 1],
  });

  return (
    <Animated.View style={[{ opacity: progress, transform: [{ translateY }, { scale }] }, style]}>
      {children}
    </Animated.View>
  );
}

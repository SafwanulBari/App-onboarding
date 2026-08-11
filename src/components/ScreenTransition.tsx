import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

type Props = {
  // Whatever App.tsx's `screen` state currently is — used only to detect
  // "we just navigated" (see the effect below), not rendered directly.
  screenKey: string;
  children: React.ReactNode;
};

// Wraps the app's top-level screen switch (App.tsx swaps screens via plain
// state, not a navigation library, so there's no built-in route transition
// to hook into) so moving from one screen to the next gets a short, subtle
// fade + slide-up instead of an instant, flat cut — that small bit of
// motion is what reads as "premium" rather than "quick"/abrupt.
//
// Deliberately entrance-only (no matching exit animation on the outgoing
// screen): the conditional `screen === '...' && <Screen />` rendering in
// App.tsx unmounts the old screen and mounts the new one in the same
// commit, so there's nothing to animate out. Re-running a short
// Animated.timing on whichever screen just mounted, every time `screenKey`
// changes, is the cheap version of the same effect without needing a real
// two-screen crossfade/overlap system.
export default function ScreenTransition({ screenKey, children }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // Only `screenKey` should retrigger this — `progress` is a stable ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: progress, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

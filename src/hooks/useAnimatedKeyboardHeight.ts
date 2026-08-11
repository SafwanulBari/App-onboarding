import { useEffect, useRef } from 'react';
import { Animated, Easing, Keyboard, Platform } from 'react-native';

// Tracks the on-screen keyboard's height as an Animated.Value, synced to
// the keyboard's own show/hide animation duration so a consumer using it
// for e.g. `paddingBottom: keyboardHeight` moves in lockstep with the
// real keyboard instead of snapping.
//
// Deliberately NOT React Native's `KeyboardAvoidingView`: that component
// derives its padding by measuring its own view's distance to the screen
// bottom via onLayout, and on a screen where the input is `autoFocus`ed
// (the keyboard opens essentially immediately on mount, often before that
// measurement has settled), it can compute a wildly wrong padding value —
// reproduced on-device on the registration Name screen as the entire
// mascot/input area going blank while the keyboard was up. A real
// browser-viewport-shrink test proved the underlying flex layout itself
// is fine (see git history), which narrowed it down to this race.
// `event.endCoordinates.height` from the OS keyboard event is
// authoritative regardless of our own layout timing, so driving padding
// from that directly sidesteps the race entirely.
export default function useAnimatedKeyboardHeight() {
  const height = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const animateTo = (toValue: number, duration?: number) => {
      Animated.timing(height, {
        toValue,
        // The keyboard event carries the OS's own animation duration —
        // reuse it so our padding finishes exactly as the keyboard does,
        // falling back to a reasonable default if a platform ever omits it.
        duration: duration && duration > 0 ? duration : 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // padding isn't a native-driver-eligible property
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, (e) => {
      animateTo(e.endCoordinates?.height ?? 0, e.duration);
    });
    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      animateTo(0, e?.duration);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [height]);

  return height;
}

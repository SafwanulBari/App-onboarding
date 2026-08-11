import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, useScale } from '../theme/theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  /** 0 to 1 — how far through the registration flow this step is. */
  progress: number;
};

// The step indicator at the top of each registration screen (Figma node
// 54:3238, e.g. on "2. Registration - Name"). A plain white pill track
// with a gradient-filled pill showing progress. `progress` is a fraction
// so later registration steps can reuse this with their own fill amount.
//
// RegistrationFlowScreen keeps this one instance mounted for the whole
// registration flow (see that file for why) instead of remounting a fresh
// bar per step, so a step change now needs to visibly *move* the fill
// rather than just appear at a new value — animated via Animated.Value
// instead of a plain style width, same Animated.timing/Easing.out(cubic)
// convention used elsewhere in the app. Width isn't a native-driver-
// eligible property, so useNativeDriver stays false here specifically.
export default function RegistrationProgressBar({ progress }: Props) {
  const scale = useScale();
  const clamped = Math.max(0, Math.min(1, progress));
  const widthProgress = useRef(new Animated.Value(clamped)).current;

  useEffect(() => {
    Animated.timing(widthProgress, {
      toValue: clamped,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [clamped, widthProgress]);

  const width = widthProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={{
        height: scale(12),
        borderRadius: scale(111),
        backgroundColor: colors.white,
        overflow: 'hidden',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 0.5,
          },
          android: { elevation: 1 },
          default: {},
        }),
      }}
    >
      <AnimatedLinearGradient
        colors={['#111973', '#5468FF']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width,
          height: '100%',
          borderRadius: scale(16),
        }}
      />
    </View>
  );
}

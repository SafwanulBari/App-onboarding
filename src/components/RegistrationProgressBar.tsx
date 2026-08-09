import React from 'react';
import { Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, useScale } from '../theme/theme';

type Props = {
  /** 0 to 1 — how far through the registration flow this step is. */
  progress: number;
};

// The step indicator at the top of each registration screen (Figma node
// 54:3238, e.g. on "2. Registration - Name"). A plain white pill track
// with a gradient-filled pill showing progress. `progress` is a fraction
// so later registration steps can reuse this with their own fill amount.
export default function RegistrationProgressBar({ progress }: Props) {
  const scale = useScale();
  const clamped = Math.max(0, Math.min(1, progress));

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
      <LinearGradient
        colors={['#111973', '#5468FF']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: `${clamped * 100}%`,
          height: '100%',
          borderRadius: scale(16),
        }}
      />
    </View>
  );
}

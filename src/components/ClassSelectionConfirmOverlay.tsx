import React from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { resolveCrop } from '../onboarding/resolveCrop';
import { colors, fonts, useScale } from '../theme/theme';

// Re-fetched from a fresh check of node 54:2371: the design's thumbs-up
// mascot is now the blue-head/pink-arm bird (matching the rest of the
// mascot family, see RegistrationMascotCard) rather than the orange/blue
// one this originally shipped with. The re-fetch also carried small
// (single-digit px) position/size shifts for the mascot and bubble below,
// from Figma's own layout recalculating around the new asset's slightly
// different natural proportions — applied here for exact fidelity, even
// though the bubble's own design (shape, text, colors) is unchanged.
const mascotThumbsUpImage = require('../../assets/registration/mascot-thumbsup.png');

// Design px the mascot/bubble group starts offscreen to the right of the
// 372-wide content column before it slides in.
const OFFSCREEN_X = 140;

type Props = {
  progress: Animated.Value; // 0 = hidden/offscreen right, 1 = fully shown
};

// The "4. Registration - Class - Thums UP" state (Figma node 54:2371) — a
// brief confirmation that slides in from the right after a class is
// tapped. Purely presentational: the parent screen (RegistrationClassScreen)
// owns the enter/hold/exit timeline via `progress` and drives the class
// list's dim-opacity off the same value, so both stay in sync.
export default function ClassSelectionConfirmOverlay({ progress }: Props) {
  const scale = useScale();

  const mascotCrop = resolveCrop(
    { left: '-6.12%', top: '-12.59%', width: '106.09%', height: '115.01%' },
    scale(167.71),
    scale(164)
  );

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [scale(OFFSCREEN_X), 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: scale(289),
        height: scale(164),
        opacity: progress,
        transform: [{ translateX }],
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: scale(51),
          top: scale(27),
          width: scale(211),
          height: scale(88),
          borderRadius: scale(16),
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: scale(24),
          shadowColor: '#000',
          shadowOffset: { width: scale(1), height: scale(2) },
          shadowOpacity: 0.15,
          shadowRadius: scale(18),
          elevation: 6,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.semiBold,
            fontSize: scale(20),
            lineHeight: scale(20) * 1.5,
            color: colors.secondaryNeutral950,
            textAlign: 'center',
          }}
        >
          তুমি প্রায় শেষে চলে এসেছো, চালিয়ে যাও
        </Text>
      </View>

      <View
        style={{
          position: 'absolute',
          left: scale(254),
          top: 0,
          width: scale(167.71),
          height: scale(164),
          overflow: 'hidden',
        }}
      >
        <Image
          source={mascotThumbsUpImage}
          style={{
            position: 'absolute',
            left: mascotCrop.left,
            top: mascotCrop.top,
            width: mascotCrop.width,
            height: mascotCrop.height,
          }}
        />
      </View>
    </Animated.View>
  );
}

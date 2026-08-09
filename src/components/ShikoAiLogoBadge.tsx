import React from 'react';
import { Image, Text, View } from 'react-native';
import { resolveCrop } from '../onboarding/resolveCrop';
import type { LogoBadgeData } from '../onboarding/types';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  badge: LogoBadgeData;
};

// The rotated "SHIKHO AI" wordmark lockup floating over the slide 3 hero
// illustration (Figma node 54:18505). Position/size/rotation come from
// slide data; the wordmark itself is fixed brand text, so it's hardcoded here.
export default function ShikoAiLogoBadge({ badge }: Props) {
  const scale = useScale();
  const iconSize = scale(badge.iconSize);
  const iconCrop = resolveCrop(badge.iconCrop, iconSize, iconSize);

  return (
    <View
      style={{
        position: 'absolute',
        left: scale(badge.left),
        top: scale(badge.top),
        width: scale(badge.width),
        height: scale(badge.height),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'center',
          flexShrink: 0,
          gap: scale(5),
          transform: [{ rotate: `${badge.rotationDeg}deg` }],
        }}
      >
        <View
          style={{
            width: iconSize,
            height: iconSize,
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <Image
            source={badge.icon}
            fadeDuration={0}
            style={{
              position: 'absolute',
              left: iconCrop.left,
              top: iconCrop.top,
              width: iconCrop.width,
              height: iconCrop.height,
            }}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.spaceGroteskLight,
            fontSize: scale(24),
            lineHeight: scale(24) * 1.3,
            color: colors.white,
            letterSpacing: scale(-0.48),
            flexShrink: 0,
          }}
        >
          SHIKHO
          <Text
            style={{
              fontFamily: fonts.spaceGroteskBold,
              letterSpacing: scale(-0.36),
            }}
          >
            {' AI'}
          </Text>
        </Text>
      </View>
    </View>
  );
}

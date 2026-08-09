import React from 'react';
import { Image, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ShikoAiLogoBadge from './ShikoAiLogoBadge';
import { resolveCrop } from '../onboarding/resolveCrop';
import type { OnboardingSlideData } from '../onboarding/types';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  slide: OnboardingSlideData;
};

// The part of each onboarding screen that actually slides during the
// carousel transition: headline + subhead, and the hero image/swirl/badge
// section below it. The gradient background, pagination dots, and CTA
// footer are sticky chrome owned by OnboardingCarouselScreen — they don't
// live here and don't move.
export default function OnboardingSlideContent({ slide }: Props) {
  const scale = useScale();
  const heroBoxWidth = scale(slide.heroBox.width);
  const heroBoxHeight = scale(slide.heroBox.height);
  const imageCrop = resolveCrop(slide.imageCrop, heroBoxWidth, heroBoxHeight);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: scale(20), paddingTop: scale(32), alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: scale(24),
            lineHeight: scale(24) * 1.5,
            color: colors.white,
            textAlign: 'center',
          }}
        >
          {slide.title}
        </Text>
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: scale(14),
            lineHeight: scale(14) * 1.6,
            color: colors.gray100,
            textAlign: 'center',
            marginTop: scale(8),
            width: slide.subtitleWidth ? scale(slide.subtitleWidth) : undefined,
          }}
        >
          {slide.subtitle}
        </Text>
      </View>

      <View style={{ marginTop: scale(slide.gapBeforeHero), height: scale(slide.heroHeight), width: '100%' }}>
        <View
          style={{
            position: 'absolute',
            top: scale(slide.swirl.top),
            left: 0,
            width: '100%',
            height: scale(slide.swirl.height),
          }}
        >
          <SvgXml xml={slide.swirl.xml} width="100%" height={scale(slide.swirl.height)} />
        </View>
        <View
          style={{
            position: 'absolute',
            top: scale(slide.heroBox.top),
            left: scale(slide.heroBox.left),
            width: heroBoxWidth,
            height: heroBoxHeight,
            overflow: 'hidden',
          }}
        >
          {/* Reproduces Figma's image-fill crop exactly: the source photo is
              scaled/offset per slide.imageCrop rather than a centered "cover"
              fit, so the intended focal point (faces, etc.) stays in frame.
              Resolved to plain pixel numbers (not percentage strings) so
              positioning is unambiguous on native, not just on web. */}
          <Image
            source={slide.image}
            fadeDuration={0}
            style={{
              position: 'absolute',
              left: imageCrop.left,
              top: imageCrop.top,
              width: imageCrop.width,
              height: imageCrop.height,
            }}
          />
        </View>
        {slide.logoBadge && <ShikoAiLogoBadge badge={slide.logoBadge} />}
      </View>
    </View>
  );
}

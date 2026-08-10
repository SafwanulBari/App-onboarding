import React from 'react';
import { Image, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { REGISTRATION_BUBBLE_SVG_XML } from '../assets/svg/registrationBubble';
import { REGISTRATION_BUBBLE_TALL_SVG_XML } from '../assets/svg/registrationBubbleTall';
import { resolveCrop } from '../onboarding/resolveCrop';
import { colors, fonts, useScale } from '../theme/theme';

const mascotImage = require('../../assets/registration/mascot.png');

type Props = {
  title: string;
  subtitle: string;
  // "5. Registration - Batch" (node 54:2452) has a two-line title, so its
  // speech bubble is taller than the other registration steps' — pass
  // "tall" there. Defaults to the standard single-line-title bubble.
  bubbleSize?: 'default' | 'tall';
  // Every registration step's title is Bold except "7. Registration -
  // Set Pasword" (node 54:1870 etc.), which specs SemiBold — pass
  // "semiBold" there. Defaults to Bold to match every other screen.
  titleWeight?: 'bold' | 'semiBold';
};

// Mascot + speech-bubble question card shared by every registration step
// (Figma nodes 54:3240 "2. Registration - Name", 54:2318 "4. Registration
// - Class", etc. use the identical mascot/bubble geometry, just with
// different title/subtitle copy) — factored out here so future
// registration screens reuse it instead of duplicating this layout.
//
// The mascot image/crop below was re-verified against a fresh fetch of
// node 54:3221 ("2. Registration - Name") — it's the blue-head/pink-arm
// "writing a checklist" pose, not the earlier orange/blue mascot.png this
// component originally shipped with. That earlier asset was simply wrong
// (grabbed before this project was being careful about re-verifying each
// node instead of assuming one early fetch generalized) — confirmed by
// diffing it byte-for-byte against the asset a later, more careful fetch
// used for "7. Registration - Set Pasword"'s password-match state
// (previously modeled here as a separate `mascotVariant: 'success'`),
// which turned out to be pixel-identical. There was never a second pose;
// every registration screen's default mascot is this one.
export default function RegistrationMascotCard({ title, subtitle, bubbleSize = 'default', titleWeight = 'bold' }: Props) {
  const scale = useScale();
  const isTall = bubbleSize === 'tall';
  const bubbleHeight = isTall ? 134 : 107;

  const mascotCrop = resolveCrop(
    { left: '-17.09%', top: '0%', width: '131.14%', height: '108.42%' },
    scale(56),
    scale(55.166)
  );

  return (
    <View
      style={{
        paddingHorizontal: scale(20),
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <View
        style={{
          width: scale(56),
          height: scale(55.166),
          borderRadius: scale(8),
          overflow: 'hidden',
        }}
      >
        <Image
          source={mascotImage}
          style={{
            position: 'absolute',
            left: mascotCrop.left,
            top: mascotCrop.top,
            width: mascotCrop.width,
            height: mascotCrop.height,
          }}
        />
      </View>

      <View style={{ flex: 1, height: scale(bubbleHeight), marginLeft: scale(4) }}>
        <SvgXml
          xml={isTall ? REGISTRATION_BUBBLE_TALL_SVG_XML : REGISTRATION_BUBBLE_SVG_XML}
          width="100%"
          height={scale(bubbleHeight)}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <View style={{ paddingLeft: scale(24.48), paddingRight: scale(20), paddingTop: scale(16) }}>
          <Text
            style={{
              fontFamily: titleWeight === 'semiBold' ? fonts.semiBold : fonts.bold,
              fontSize: scale(18),
              lineHeight: scale(18) * 1.5,
              color: colors.gray900,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: scale(14),
              lineHeight: scale(14) * 1.6,
              color: colors.gray900,
              marginTop: scale(4),
            }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

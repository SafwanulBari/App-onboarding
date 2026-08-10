import React from 'react';
import { Image, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { REGISTRATION_BUBBLE_SVG_XML } from '../assets/svg/registrationBubble';
import { REGISTRATION_BUBBLE_TALL_SVG_XML } from '../assets/svg/registrationBubbleTall';
import { resolveCrop } from '../onboarding/resolveCrop';
import { colors, fonts, useScale } from '../theme/theme';

const mascotImage = require('../../assets/registration/mascot.png');
// The "everything checks out" pose (Figma node 77:2143, image520) used
// once on "7. Registration - Set Pasword - Typing - Filled" (node
// 54:2095) when both password fields are complete and match — a
// genuinely different source image, not a recolor/crop of the default one.
const mascotCheckImage = require('../../assets/registration/mascot-check.png');

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
  // See mascotCheckImage above. Defaults to the usual writing-mascot pose.
  mascotVariant?: 'default' | 'success';
};

// Mascot + speech-bubble question card shared by every registration step
// (Figma nodes 54:3240 "2. Registration - Name" and 54:2318 "4.
// Registration - Class" use the identical mascot/bubble geometry, just
// with different title/subtitle copy) — factored out here so future
// registration screens reuse it instead of duplicating this layout.
export default function RegistrationMascotCard({
  title,
  subtitle,
  bubbleSize = 'default',
  titleWeight = 'bold',
  mascotVariant = 'default',
}: Props) {
  const scale = useScale();
  const isTall = bubbleSize === 'tall';
  const bubbleHeight = isTall ? 134 : 107;
  const isSuccess = mascotVariant === 'success';

  const mascotCrop = resolveCrop(
    isSuccess
      ? { left: '-17.09%', top: '0%', width: '131.14%', height: '108.42%' }
      : { left: '-16.37%', top: '-5.37%', width: '130.52%', height: '110.72%' },
    scale(56),
    scale(54)
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
          height: scale(54),
          borderRadius: scale(8),
          overflow: 'hidden',
        }}
      >
        <Image
          source={isSuccess ? mascotCheckImage : mascotImage}
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

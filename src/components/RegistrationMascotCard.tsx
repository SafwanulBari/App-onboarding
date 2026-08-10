import React from 'react';
import { Image, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { REGISTRATION_BUBBLE_SVG_XML } from '../assets/svg/registrationBubble';
import { resolveCrop } from '../onboarding/resolveCrop';
import { colors, fonts, useScale } from '../theme/theme';

const mascotImage = require('../../assets/registration/mascot.png');

type Props = {
  title: string;
  subtitle: string;
};

// Mascot + speech-bubble question card shared by every registration step
// (Figma nodes 54:3240 "2. Registration - Name" and 54:2318 "4.
// Registration - Class" use the identical mascot/bubble geometry, just
// with different title/subtitle copy) — factored out here so future
// registration screens reuse it instead of duplicating this layout.
export default function RegistrationMascotCard({ title, subtitle }: Props) {
  const scale = useScale();

  const mascotCrop = resolveCrop(
    { left: '-16.37%', top: '-5.37%', width: '130.52%', height: '110.72%' },
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

      <View style={{ flex: 1, height: scale(107), marginLeft: scale(4) }}>
        <SvgXml
          xml={REGISTRATION_BUBBLE_SVG_XML}
          width="100%"
          height={scale(107)}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <View style={{ paddingLeft: scale(24.48), paddingRight: scale(20), paddingTop: scale(16) }}>
          <Text
            style={{
              fontFamily: fonts.bold,
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

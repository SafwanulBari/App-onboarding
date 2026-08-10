import React from 'react';
import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CHEVRON_RIGHT_SVG_XML } from '../assets/svg/chevronRight';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  icon: ImageSourcePropType;
  // Each group icon is a differently-proportioned flattened illustration
  // (Figma auto-traced "Rectangle [Vectorized]" layers) that floats above
  // the card's top edge by a slightly different amount, so its geometry
  // is passed in per-row rather than assumed fixed.
  iconWidth: number;
  iconHeight: number;
  iconLeft: number;
  iconTop: number;
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

// A selectable row on the Group-selection screen (Figma node 54:2502,
// e.g. 54:2534 "বিজ্ঞান") — same card chrome as
// RegistrationClassOptionCard/RegistrationBatchOptionCard, but the leading
// visual is a floating illustration overlapping the card's top edge
// instead of a numeral, so the label sits at a fixed left offset (106)
// regardless of how wide any given icon is.
export default function RegistrationGroupOptionCard({
  icon,
  iconWidth,
  iconHeight,
  iconLeft,
  iconTop,
  label,
  selected,
  onPress,
}: Props) {
  const scale = useScale();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height: scale(64),
        borderRadius: scale(16),
        backgroundColor: colors.white,
        borderWidth: scale(1),
        borderBottomWidth: scale(4),
        borderColor: colors.gray300,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Image
        source={icon}
        style={{
          position: 'absolute',
          left: scale(iconLeft),
          top: scale(iconTop),
          width: scale(iconWidth),
          height: scale(iconHeight),
        }}
        resizeMode="contain"
      />
      <View
        style={{
          position: 'absolute',
          left: scale(106),
          top: 0,
          bottom: 0,
          right: scale(60),
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.semiBold,
            fontSize: scale(18),
            lineHeight: scale(18) * 1.6,
            color: selected ? colors.secondaryNeutral950 : colors.gray800,
          }}
        >
          {label}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          right: scale(20),
          top: 0,
          bottom: 0,
          width: scale(40),
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: '-90deg' }],
        }}
      >
        <SvgXml xml={CHEVRON_RIGHT_SVG_XML} width={scale(24)} height={scale(28.6)} />
      </View>
    </Pressable>
  );
}

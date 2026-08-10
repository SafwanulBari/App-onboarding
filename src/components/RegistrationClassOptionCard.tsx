import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CHEVRON_RIGHT_SVG_XML } from '../assets/svg/chevronRight';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  numeral: string;
  label: string;
  onPress?: () => void;
};

// A selectable row on the Class-selection screen (Figma node 54:2297,
// e.g. 54:2329 "ক্লাস ৬"). Two deliberate deviations from the design here:
// 1. The numeral uses a flat color (classNumeralBlue, the gradient's
//    midtone) rather than the design's radial-gradient text — reproducing
//    gradient text in RN needs a native masked-view, and this project
//    already got burned once this session shipping an unverified native
//    dependency (WebP images) that failed on a real device; a flat color
//    is a safe, low-risk approximation instead of gambling on that again.
// 2. Everything else on this screen uses Baloo Da 2, but the design specs
//    the numeral glyph itself in Noto Sans Bengali — kept faithfully here
//    since it's a plain Google Font (same install pattern as Baloo Da 2 /
//    Space Grotesk already in use), not a native module, so there's no
//    WebP-style on-device risk in matching it.
export default function RegistrationClassOptionCard({ numeral, label, onPress }: Props) {
  const scale = useScale();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height: scale(54),
        borderRadius: scale(16),
        backgroundColor: colors.white,
        borderWidth: scale(1),
        borderBottomWidth: scale(4),
        borderColor: colors.gray300,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View style={{ width: scale(88), alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: fonts.notoSansBengaliSemiBold,
            fontSize: scale(38),
            color: colors.classNumeralBlue,
          }}
        >
          {numeral}
        </Text>
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.semiBold,
          fontSize: scale(18),
          lineHeight: scale(18) * 1.6,
          color: colors.gray800,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: scale(40),
          height: scale(40),
          marginRight: scale(20),
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

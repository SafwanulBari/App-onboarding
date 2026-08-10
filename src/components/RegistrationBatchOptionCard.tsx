import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { CHEVRON_RIGHT_SVG_XML } from '../assets/svg/chevronRight';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

// A selectable row on the Batch-selection screen (Figma node 54:2452,
// e.g. 54:2484 "২০২৪") — the same card chrome (border, radius, chevron) as
// RegistrationClassOptionCard, just taller (64 vs 54) and without a
// leading numeral. The first/current-year option is selected by default
// in the design (54:2484 renders its label in secondaryNeutral950 instead
// of gray800) — reproduced here via the `selected` prop rather than
// hardcoding it to the first row, so selection can move on tap.
export default function RegistrationBatchOptionCard({ label, selected, onPress }: Props) {
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(20),
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.semiBold,
          fontSize: scale(18),
          lineHeight: scale(18) * 1.6,
          color: selected ? colors.secondaryNeutral950 : colors.gray800,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: scale(40),
          height: scale(40),
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

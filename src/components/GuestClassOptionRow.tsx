import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { CHEVRON_RIGHT_SVG_XML } from '../assets/svg/chevronRight';
import { colors, fonts, useScale } from '../theme/theme';

type Props = {
  numeral: string;
  label: string;
  onPress?: () => void;
};

// A selectable row on the guest ("no account") Class-selection screen
// (Figma node 54:20049, e.g. 112:4053 "ক্লাস ৬"). Same list-row shape as
// the main registration flow's own class step (RegistrationClassOptionCard,
// node 54:2297), but this design's numeral is white text on a solid
// gradient badge instead of flat-colored text on a plain background — a
// real, deliberate difference between the two frames, not a fidelity
// shortcut, so this is its own small component rather than forcing
// RegistrationClassOptionCard to serve two different looks.
export default function GuestClassOptionRow({ numeral, label, onPress }: Props) {
  const scale = useScale();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        height: scale(60),
        borderRadius: scale(14),
        backgroundColor: colors.white,
        borderWidth: scale(1),
        borderBottomWidth: scale(4),
        borderColor: colors.gray300,
        flexDirection: 'row',
        alignItems: 'center',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <LinearGradient
        colors={['#4558E6', '#263180']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          width: scale(56),
          height: scale(56),
          borderRadius: scale(12),
          marginLeft: scale(2),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.notoSansBengaliSemiBold,
            fontSize: scale(30),
            letterSpacing: scale(-2.4),
            color: colors.white,
          }}
        >
          {numeral}
        </Text>
      </LinearGradient>
      <Text
        style={{
          flex: 1,
          marginLeft: scale(16),
          fontFamily: fonts.semiBold,
          fontSize: scale(16),
          lineHeight: scale(16) * 1.6,
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

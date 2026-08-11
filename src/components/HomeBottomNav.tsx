import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { HOME_NAV_AI_ICON_SVG_XML, HOME_NAV_COURSE_ICON_SVG_XML, homeNavHomeIconXml } from '../assets/svg/homeNavIcons';
import { colors, fonts, useScale } from '../theme/theme';

type Tab = 'home' | 'course' | 'ai';

type Props = {
  // Omit (or pass undefined) when none of the 3 tabs should read as
  // active — e.g. the Profile page (node 78:3357) sits "under" Home but
  // shows all three tabs gray, matching the design exactly.
  active?: Tab;
  onSelectHome?: () => void;
  onSelectCourse?: () => void;
  onSelectAi?: () => void;
};

// Bottom tab bar (Figma node 78:4621 "Bottom navigation") — shared chrome
// for the Home screen, the Profile page, and (once built) the Course/AI
// screens it links to. Only Home and Profile have real screens behind
// them right now, so Course/AI are inert taps (optional callbacks)
// rather than routed anywhere yet.
export default function HomeBottomNav({ active, onSelectHome, onSelectCourse, onSelectAi }: Props) {
  const scale = useScale();
  const isHomeActive = active === 'home';

  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        paddingHorizontal: scale(20),
        paddingTop: scale(12),
        paddingBottom: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Platform.select({
          ios: {
            shadowColor: '#1D1616',
            shadowOpacity: 0.11,
            shadowOffset: { width: 0, height: scale(-1) },
            shadowRadius: scale(2.5),
          },
          android: { elevation: 8 },
          default: {},
        }),
      }}
    >
      <Pressable onPress={onSelectHome} style={{ alignItems: 'center', gap: scale(8), width: scale(60) }}>
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <SvgXml
            xml={homeNavHomeIconXml(isHomeActive ? colors.secondary500 : colors.homeNavInactiveIcon)}
            width={scale(20)}
            height={scale(20)}
          />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: scale(14),
              color: isHomeActive ? colors.secondary500 : colors.homeNavInactiveText,
            }}
          >
            হোম
          </Text>
        </View>
        <View
          style={{
            height: scale(4),
            width: '100%',
            borderTopLeftRadius: scale(10),
            borderTopRightRadius: scale(10),
            backgroundColor: isHomeActive ? colors.secondary500 : 'transparent',
          }}
        />
      </Pressable>

      <Pressable onPress={onSelectCourse} style={{ alignItems: 'center', gap: scale(8), width: scale(60) }}>
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <SvgXml xml={HOME_NAV_COURSE_ICON_SVG_XML} width={scale(20)} height={scale(20)} />
          <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.homeNavInactiveText }}>
            কোর্স
          </Text>
        </View>
        <View style={{ height: scale(4), width: '100%' }} />
      </Pressable>

      <Pressable onPress={onSelectAi} style={{ alignItems: 'center', gap: scale(8), width: scale(60) }}>
        <View style={{ alignItems: 'center', gap: scale(2) }}>
          <SvgXml xml={HOME_NAV_AI_ICON_SVG_XML} width={scale(22)} height={scale(22)} />
          <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.homeNavInactiveText }}>
            শিখো AI
          </Text>
        </View>
        <View style={{ height: scale(4), width: '100%' }} />
      </Pressable>
    </View>
  );
}

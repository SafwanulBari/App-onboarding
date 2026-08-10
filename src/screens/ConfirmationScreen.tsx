import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { CONFIRMATION_BURST_SVG_XML } from '../assets/svg/confirmationBurst';
import { resolveCrop } from '../onboarding/resolveCrop';
import { colors, fonts, useScale } from '../theme/theme';

const mascotImage = require('../../assets/confirmation/mascot-celebrate.png');
const learnIcon = require('../../assets/confirmation/feature-learn.png');
const ebookIcon = require('../../assets/confirmation/feature-ebook.png');
const examIcon = require('../../assets/confirmation/feature-exam.png');
const reportIcon = require('../../assets/confirmation/feature-report.png');
const aiIcon = require('../../assets/confirmation/feature-ai.png');

type Feature = {
  id: string;
  icon: ReturnType<typeof require>;
  iconWidth: number;
  iconHeight: number;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    id: 'learn',
    icon: learnIcon,
    iconWidth: 56.953,
    iconHeight: 54,
    title: 'শিখুন',
    description: 'লাইভ ক্লাস ও অ্যানিমেটেড ভিডিওর মাধ্যমে পড়াশোনা হোক আরও সহজ।',
  },
  {
    id: 'ebook',
    icon: ebookIcon,
    iconWidth: 48.24,
    iconHeight: 53.893,
    title: 'ই-বুক ও রিসোর্স',
    description: 'প্রতিটি অধ্যায়ের প্র্যাকটিস মেটেরিয়াল দিয়ে পড়াশোনা হোক আরও নিখুঁত।',
  },
  {
    id: 'exam',
    icon: examIcon,
    iconWidth: 56.109,
    iconHeight: 54,
    title: 'পরীক্ষা ও মূল্যায়ন',
    description: 'কুইজ, চ্যাপ্টার টেস্ট এবং মডেল টেস্ট দিয়ে পরীক্ষার সেরা প্রস্তুতি নিন।',
  },
  {
    id: 'report',
    icon: reportIcon,
    iconWidth: 42.3,
    iconHeight: 53.866,
    title: 'রিপোর্ট',
    description: 'আপনার পড়াশোনার অগ্রগতি এবং পারফরম্যান্সের বিস্তারিত গ্রাফ ও ট্র্যাকিং।',
  },
  {
    id: 'ai',
    icon: aiIcon,
    iconWidth: 55.055,
    iconHeight: 54,
    title: 'AI সহায়তা',
    description: 'স্মার্ট লার্নিং ও এআই ডাউট সলভিং-এর মাধ্যমে পড়া হোক আরও দ্রুত।',
  },
];

type Props = {
  onGoHome?: () => void;
};

// Figma: "Confirmation Page" — node 54:1541, shown after the password is
// successfully saved (end of the registration flow).
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-1541
export default function ConfirmationScreen({ onGoHome }: Props) {
  const scale = useScale();

  const mascotCrop = resolveCrop(
    { left: '-13.28%', top: '-10.12%', width: '126.57%', height: '114.16%' },
    scale(105.512),
    scale(124)
  );

  return (
    <LinearGradient
      colors={[colors.confirmationGradientStart, colors.white]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Background is a saturated blue at the top, so the status bar text
          needs to be light here — every other screen in the app is on a
          light background and uses "dark". */}
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, overflow: 'hidden' }}>
          {/* Decorative background layer — a large, very faint radial
              starburst behind the mascot (54:1868) and a soft glow ellipse
              (54:1557) behind it, both purely decorative and layered
              behind the real content below. */}
          <SvgXml
            xml={CONFIRMATION_BURST_SVG_XML}
            width={scale(975.95)}
            height={scale(973.828)}
            style={{ position: 'absolute', left: scale(-282), top: scale(-586) }}
          />
          <View
            style={{
              position: 'absolute',
              left: scale(120),
              top: scale(-25),
              width: scale(174),
              height: scale(174),
              borderRadius: scale(87),
              backgroundColor: '#DFDFDF',
              opacity: 0.55,
            }}
          />

          <View style={{ alignItems: 'center', marginTop: scale(8) }}>
            <View style={{ width: scale(105.512), height: scale(124), overflow: 'hidden' }}>
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
          </View>

          <View style={{ alignItems: 'center', marginTop: scale(24), paddingHorizontal: scale(20) }}>
            <Text style={{ textAlign: 'center' }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: scale(28),
                  lineHeight: scale(28) * 1.5,
                  color: colors.secondary500,
                }}
              >
                অভিনন্দন
              </Text>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: scale(32),
                  lineHeight: scale(28) * 1.5,
                  color: colors.secondary500,
                }}
              >
                !
              </Text>
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.semiBold,
                fontSize: scale(20),
                lineHeight: scale(20) * 1.5,
                color: colors.secondaryNeutral950,
                marginTop: scale(4),
              }}
            >
              শেখা হোক নিজের নিয়মে, সব সময়, সব জায়গায়
            </Text>
          </View>

          <View style={{ marginTop: scale(24), paddingHorizontal: scale(69), gap: scale(24) }}>
            {FEATURES.map((feature) => (
              <View key={feature.id} style={{ flexDirection: 'row', alignItems: 'center', gap: scale(24) }}>
                <View style={{ width: scale(60), height: scale(54), alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={feature.icon}
                    style={{ width: scale(feature.iconWidth), height: scale(feature.iconHeight) }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ flex: 1, gap: scale(4) }}>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: scale(16),
                      lineHeight: scale(16) * 1.5,
                      color: colors.secondaryNeutral950,
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: scale(12),
                      lineHeight: scale(12) * 1.6,
                      color: colors.gray900,
                    }}
                  >
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 'auto', paddingHorizontal: scale(20), paddingBottom: scale(20) }}>
            <Pressable
              onPress={onGoHome}
              style={({ pressed }) => ({
                height: scale(48),
                borderRadius: scale(12),
                backgroundColor: colors.primary500,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: scale(14),
                  lineHeight: scale(14) * 1.6,
                  color: colors.white,
                }}
              >
                হোমপেজে যাও
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

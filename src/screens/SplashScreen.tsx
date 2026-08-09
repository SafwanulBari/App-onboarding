import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import PaginationDots from '../components/PaginationDots';
import { SWIRL_SVG_XML } from '../assets/svg/swirl';
import { colors, fonts, useScale } from '../theme/theme';

const heroImage = require('../../assets/onboarding/hero-splash.png');

type Props = {
  onContinue?: () => void;
};

// Figma: "Splash Screen 9" — node 54:18407
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-18407
export default function SplashScreen({ onContinue }: Props) {
  const scale = useScale();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
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
            {"Shikho'র দুনিয়ায় স্বাগত!"}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: scale(14),
              lineHeight: scale(14) * 1.6,
              color: colors.gray100,
              textAlign: 'center',
              marginTop: scale(8),
            }}
          >
            ইন্টারঅ্যাকটিভ ভিডিও লেসন, লাইভ ক্লাস এবং ব্যক্তিগতকৃত শেখার অভিজ্ঞতার মাধ্যমে প্রতিটি
            বিষয় আত্মবিশ্বাসের সঙ্গে বুঝে শেখো।
          </Text>
        </View>

        <View style={{ marginTop: scale(95), height: scale(338), width: '100%' }}>
          <View
            style={{
              position: 'absolute',
              top: scale(141),
              left: 0,
              width: '100%',
              height: scale(197),
            }}
          >
            <SvgXml xml={SWIRL_SVG_XML} width="100%" height={scale(197)} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: scale(20),
              width: scale(372),
              height: scale(320),
              overflow: 'hidden',
            }}
          >
            {/* Reproduces Figma's image-fill crop exactly (node 54:18430): the
                source photo is scaled to 127.46% / 321.99% of the box and offset
                by -12.49% / -73.49%, rather than a centered "cover" fit — this
                keeps the students' faces in frame instead of centering the tall
                source photo. */}
            <Image
              source={heroImage}
              style={{
                position: 'absolute',
                left: '-12.49%',
                top: '-73.49%',
                width: '127.46%',
                height: '321.99%',
              }}
            />
          </View>
        </View>

        <PaginationDots count={3} activeIndex={0} />

        <View
          style={{
            marginTop: 'auto',
            paddingHorizontal: scale(20),
            paddingBottom: scale(30),
            alignItems: 'center',
            gap: scale(12),
          }}
        >
          <Pressable
            onPress={onContinue}
            style={({ pressed }) => ({
              width: '100%',
              height: scale(48),
              borderRadius: scale(12),
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: scale(14),
                lineHeight: scale(14) * 1.5,
                color: colors.gray900,
              }}
            >
              এগিয়ে যাও
            </Text>
          </Pressable>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: scale(12),
              lineHeight: scale(12) * 1.6,
              color: colors.white,
              textAlign: 'center',
            }}
          >
            <Text style={{ fontFamily: fonts.semiBold }}>৩০ লক্ষ+</Text> শিক্ষার্থীদের সাথে শেখা
            শুরু করো
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

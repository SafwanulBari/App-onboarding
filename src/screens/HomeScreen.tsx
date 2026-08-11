import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { HOME_AVATAR_DEFAULT_SVG_XML } from '../assets/svg/homeAvatarDefault';
import { HOME_LOGO_BIRD_SVG_XML } from '../assets/svg/homeLogo';
import { HOME_SEARCH_ICON_SVG_XML } from '../assets/svg/homeSearchIcon';
import HomeBottomNav from '../components/HomeBottomNav';
import { colors, fonts, useScale } from '../theme/theme';

const giftBoxImage = require('../../assets/home/gift-box-confetti.png');
const courseThumbnailImage = require('../../assets/home/course-thumbnail.jpg');
const quizKingImage = require('../../assets/home/quiz-king.png');
const iconLiveClass = require('../../assets/home/icon-live-class.png');
const iconAnimatedVideo = require('../../assets/home/icon-animated-video.png');
const iconLiveMcq = require('../../assets/home/icon-live-mcq.png');
const iconNotes = require('../../assets/home/icon-notes.png');

type Feature = { id: string; icon: ReturnType<typeof require>; label: string };

const FREE_FEATURES: Feature[] = [
  { id: 'class', icon: iconLiveClass, label: 'ক্লাস' },
  { id: 'video', icon: iconAnimatedVideo, label: 'অ্যানিমেটেড লেসন' },
  { id: 'exam', icon: iconLiveMcq, label: 'চ্যাপ্টার এক্সাম' },
  { id: 'notes', icon: iconNotes, label: 'স্মার্ট নোট, ক্লাস নোট ও প্র্যাকটিস বুক' },
];

type Props = {
  studentName?: string;
  studentClass?: string;
  onSelectCourse?: () => void;
  onSelectAi?: () => void;
};

// Figma: "Home (Free User)" — node 78:3913
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=78-3913
//
// This is a long, multi-section scrollable page (hero, several promo
// carousels, a full "All Feature Cards" section, more card grids below
// that). Per an explicit scoping decision, this first pass covers
// everything visible without scrolling on the design's own first screen:
// the hero header, the "3 days everything free" trial promo, and the
// practice-quiz card, plus the (always-present) bottom nav. The
// carousels/feature-card sections further down the design are left for a
// follow-up pass — see the section comments below for exactly where this
// stops matching the Figma frame 1:1.
export default function HomeScreen({
  studentName = 'আরিয়ান',
  studentClass = "ক্লাস ৯ - এসএসসি'২৭",
  onSelectCourse,
  onSelectAi,
}: Props) {
  const scale = useScale();

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Hero is a saturated dark blue, so status bar text needs to be light
          here — unlike every other (light-background) screen in the app. */}
      <StatusBar style="light" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scale(24) }}>
        <LinearGradient
          colors={[colors.homeHeroGradientStart, colors.homeHeroGradientEnd]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ paddingBottom: scale(175) }}
        >
          <SafeAreaView edges={['top']}>
            <View
              style={{
                paddingHorizontal: scale(20),
                marginTop: scale(10),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <SvgXml xml={HOME_LOGO_BIRD_SVG_XML} width={scale(42.44)} height={scale(28)} />
              <Pressable hitSlop={8}>
                <SvgXml xml={HOME_SEARCH_ICON_SVG_XML} width={scale(24)} height={scale(24)} />
              </Pressable>
            </View>

            <View
              style={{
                paddingHorizontal: scale(20),
                marginTop: scale(48),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ gap: scale(5), flexShrink: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                  <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(20), lineHeight: scale(20) * 1.5, color: colors.white }}>
                    {`হ্যালো, ${studentName}`}
                  </Text>
                  <Text style={{ fontSize: scale(20) }}>👋</Text>
                </View>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    fontSize: scale(12),
                    color: 'rgba(255,255,255,0.88)',
                  }}
                >
                  {studentClass}
                </Text>
              </View>
              <View
                style={{
                  width: scale(60),
                  height: scale(60),
                  borderRadius: scale(30),
                  borderWidth: 1,
                  borderColor: colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SvgXml xml={HOME_AVATAR_DEFAULT_SVG_XML} width={scale(56)} height={scale(56)} />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Rising white sheet — overlaps the hero's bottom (185 design-px,
            Figma's own sheet-vs-hero overlap on node 78:3913/78:3915)
            rather than starting a hard seam right under the avatar row. */}
        <View
          style={{
            marginTop: -scale(185),
            backgroundColor: colors.white,
            borderTopLeftRadius: scale(20),
            borderTopRightRadius: scale(20),
            paddingTop: scale(38),
            paddingHorizontal: scale(20),
          }}
        >
          {/* "3 Days Everything Free" trial promo (node 78:4008) */}
          <View style={{ position: 'relative' }}>
            <Image
              source={giftBoxImage}
              style={{ position: 'absolute', top: -scale(18), right: -scale(20), width: scale(132), height: scale(176) }}
              resizeMode="contain"
            />
            <View style={{ gap: scale(16), paddingRight: scale(90) }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: scale(24), lineHeight: scale(24) * 1.5, color: colors.homeAccent800 }}>
                ৩ দিন সবকিছু ফ্রি!
              </Text>
            </View>
            <View style={{ gap: scale(12), marginTop: scale(16) }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: scale(14), lineHeight: scale(14) * 1.6, color: colors.homeMutedText }}>
                ফ্রিতে যা যা পাবে-
              </Text>
              <View style={{ gap: scale(10) }}>
                {FREE_FEATURES.map((feature) => (
                  <View key={feature.id} style={{ flexDirection: 'row', alignItems: 'center', gap: scale(16) }}>
                    <Image source={feature.icon} style={{ width: scale(20), height: scale(20) }} resizeMode="contain" />
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: fonts.semiBold,
                        fontSize: scale(14),
                        lineHeight: scale(14) * 1.6,
                        color: colors.homeBodyText,
                      }}
                    >
                      {feature.label}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={{ fontFamily: fonts.regular, fontSize: scale(14), lineHeight: scale(14) * 1.6, color: colors.homeBodyText }}>
                এছাড়াও বাকি সব ফিচার এক্সপেরিয়েন্স করতে ফ্রিতে শেখা শুরু করো এখনই!
              </Text>
            </View>
          </View>

          {/* Course promo sub-card (node 78:4319) */}
          <View
            style={{
              marginTop: scale(24),
              backgroundColor: colors.white,
              borderRadius: scale(12),
              padding: scale(12),
              gap: scale(20),
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: scale(2) },
              shadowRadius: scale(8),
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', gap: scale(12) }}>
              <Image
                source={courseThumbnailImage}
                style={{ width: scale(156), height: scale(88), borderRadius: scale(8) }}
                resizeMode="cover"
              />
              <View style={{ flex: 1, justifyContent: 'center', gap: scale(10) }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: scale(14), lineHeight: scale(14) * 1.5, color: colors.homeBodyText }}>
                  {`ক্লাস ৯ - SSC '28 বিজ্ঞান`}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                  <Text
                    style={{
                      fontFamily: fonts.regular,
                      fontSize: scale(16),
                      lineHeight: scale(16) * 1.6,
                      color: colors.gray600,
                      textDecorationLine: 'line-through',
                    }}
                  >
                    ৳৬০০০/-
                  </Text>
                  <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(16), lineHeight: scale(16) * 1.5, color: colors.homePriceGreen }}>
                    ৳৫৭০০/=
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ gap: scale(12) }}>
              <Pressable
                style={({ pressed }) => ({
                  height: scale(40),
                  borderRadius: scale(6),
                  backgroundColor: colors.secondary500,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(14), color: colors.white }}>৩ দিন ফ্রিতে শিখো</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => ({
                  height: scale(40),
                  borderRadius: scale(6),
                  backgroundColor: colors.accent100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(14), color: colors.primary500 }}>প্রোগ্রামে ভর্তি হও</Text>
              </Pressable>
            </View>
          </View>

          {/* "নিজেকে যাচাই করো" practice-quiz card (node 78:4334) */}
          <LinearGradient
            colors={[colors.homeQuizGradientStart, colors.homeQuizGradientEnd]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.9 }}
            style={{
              marginTop: scale(20),
              borderRadius: scale(16),
              paddingTop: scale(19),
              paddingBottom: scale(18),
              paddingHorizontal: scale(20),
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              source={quizKingImage}
              style={{ position: 'absolute', right: -scale(10), top: scale(2), width: scale(140), height: scale(101) }}
              resizeMode="contain"
            />
            <View style={{ gap: scale(4), width: scale(206) }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: scale(18), lineHeight: scale(18) * 1.5, color: '#FAFAFA' }}>
                নিজেকে যাচাই করো
              </Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: scale(12), lineHeight: scale(12) * 1.4, color: '#EFEFEF' }}>
                চ্যালেঞ্জ নাও - সাবজেক্ট, চ্যাপ্টার, টপিক সিলেক্ট করে প্রশ্ন বানাও আর টেস্ট দিয়ে নিজেকে যাচাই করে নাও!
              </Text>
            </View>

            <View
              style={{
                marginTop: scale(13),
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: scale(111),
                paddingHorizontal: scale(12),
                paddingVertical: scale(4),
                flexDirection: 'row',
                gap: scale(4),
              }}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: scale(12), lineHeight: scale(12) * 1.6, color: colors.white }}>
                ডেইলি লিমিট:
              </Text>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(12), lineHeight: scale(12) * 1.6, color: colors.white }}>
                ০০/০৩
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => ({
                marginTop: scale(19),
                height: scale(40),
                borderRadius: scale(10),
                backgroundColor: colors.primary500,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.white }}>প্র্যাকটিস কুইজ দাও</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.white }}>
        <HomeBottomNav active="home" onSelectCourse={onSelectCourse} onSelectAi={onSelectAi} />
      </SafeAreaView>
    </View>
  );
}

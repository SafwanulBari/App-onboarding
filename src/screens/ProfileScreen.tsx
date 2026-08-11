import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PROFILE_FLAME_SVG_XML } from '../assets/svg/profileFlame';
import {
  PROFILE_AVATAR_DEFAULT_SVG_XML,
  PROFILE_CHEVRON_RIGHT_SVG_XML,
  PROFILE_DAY_RING_SVG_XML,
  PROFILE_PENCIL_SVG_XML,
} from '../assets/svg/profileIcons';
import HomeBottomNav from '../components/HomeBottomNav';
import { colors, fonts, useScale } from '../theme/theme';

const chipNotification = require('../../assets/profile/chip-notification.png');
const chipProfileEdit = require('../../assets/profile/chip-profile-edit.png');
const chipSyllabus = require('../../assets/profile/chip-syllabus.png');
const chipSaved = require('../../assets/profile/chip-saved.png');
const chipDownload = require('../../assets/profile/chip-download.png');
const chipSubscriptions = require('../../assets/profile/chip-subscriptions.png');
const chipSettings = require('../../assets/profile/chip-settings.png');

// The 7 day-of-week labels exactly as spelled in the design (node
// 78:3387..78:3394), including its own "শক্র." abbreviation for Friday.
const WEEK_DAYS = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ.', 'শক্র.'];

type MenuItem = {
  id: string;
  icon: ReturnType<typeof require>;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

type Props = {
  studentName?: string;
  school?: string;
  classLabel?: string;
  subjectLabel?: string;
  sscYear?: string;
  streakDays?: number;
  // Which of WEEK_DAYS (0 = শনি) are already completed — the design shows
  // the first 4 of a 4-day streak lit, matching `streakDays` below.
  activeDayIndices?: number[];
  onBack?: () => void;
  onEditAvatar?: () => void;
  onOpenNotifications?: () => void;
  onEditProfile?: () => void;
  onChangeSyllabus?: () => void;
  onOpenSavedQuestions?: () => void;
  onOpenVideoDownloads?: () => void;
  onOpenAdmissionInfo?: () => void;
  onOpenSettings?: () => void;
  onSelectHome?: () => void;
  onSelectCourse?: () => void;
  onSelectAi?: () => void;
};

// Figma: "Profile Page" — node 78:3357
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=78-3357
export default function ProfileScreen({
  studentName = 'সায়েদা ওয়াফিয়া বারী',
  school = 'ঢাকা রেসিডেন্সিয়াল মডেল স্কুল & কলেজ',
  classLabel = 'ক্লাস ৯',
  subjectLabel = 'বিজ্ঞান',
  sscYear = "এসএসসি'২৭",
  streakDays = 4,
  activeDayIndices = [0, 1, 2, 3],
  onBack,
  onEditAvatar,
  onOpenNotifications,
  onEditProfile,
  onChangeSyllabus,
  onOpenSavedQuestions,
  onOpenVideoDownloads,
  onOpenAdmissionInfo,
  onOpenSettings,
  onSelectHome,
  onSelectCourse,
  onSelectAi,
}: Props) {
  const scale = useScale();
  const insets = useSafeAreaInsets();

  const MENU_ITEMS: MenuItem[] = [
    { id: 'notification', icon: chipNotification, title: 'নোটিফিকেশন', subtitle: 'সর্বশেষ আপডেট দেখো', onPress: onOpenNotifications },
    { id: 'profile-edit', icon: chipProfileEdit, title: 'প্রোফাইল এডিট', subtitle: 'তোমার তথ্য পরিবর্তন করো', onPress: onEditProfile },
    { id: 'syllabus', icon: chipSyllabus, title: 'সিলেবাস পরিবর্তন', subtitle: 'ক্লাস এবং ব্যাচ পরিবর্তন করো', onPress: onChangeSyllabus },
    { id: 'saved', icon: chipSaved, title: 'সেভড প্রশ্ন', subtitle: 'সেভ করা প্রশ্নগুলো দেখো', onPress: onOpenSavedQuestions },
    { id: 'download', icon: chipDownload, title: 'ভিডিয়ো ডাউনলোড', subtitle: 'ডাউনলোডেড ভিডিয়ো দেখো', onPress: onOpenVideoDownloads },
    { id: 'admission', icon: chipSubscriptions, title: 'ভর্তি সম্পর্কিত তথ্য', subtitle: 'ভর্তির বিস্তারিত তথ্য দেখো', onPress: onOpenAdmissionInfo },
    { id: 'settings', icon: chipSettings, title: 'সেটিংস', subtitle: 'হেল্প এবং যোগাযোগ', onPress: onOpenSettings },
  ];

  // Figma's hero background (node 78:3358) is a 424 design-px tall,
  // 3-stop gradient — its own y=0 already sits behind a 52px mocked
  // status bar the same way every other hero in this app does (see
  // HomeScreen), so this is measured from insets.top instead.
  const heroHeight = insets.top + scale(424 - 52);

  return (
    <View style={{ flex: 1, backgroundColor: colors.profileBg }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.profileHeroGradientStart, colors.white, colors.profileHeroGradientEnd]}
        locations={[0, 0.68265, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: heroHeight }}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scale(24) }}>
        <View style={{ alignItems: 'center', paddingTop: insets.top + scale(72 - 52), paddingHorizontal: scale(20) }}>
          <View style={{ position: 'relative' }}>
            <View
              style={{
                width: scale(88),
                height: scale(88),
                borderRadius: scale(44),
                borderWidth: scale(2.2),
                borderColor: colors.white,
                backgroundColor: colors.gray300,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SvgXml xml={PROFILE_AVATAR_DEFAULT_SVG_XML} width={scale(61.6)} height={scale(61.6)} />
            </View>
            <Pressable
              onPress={onEditAvatar}
              hitSlop={8}
              style={{
                position: 'absolute',
                right: -scale(3),
                bottom: -scale(3),
                width: scale(24),
                height: scale(24),
                borderRadius: scale(12),
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowOffset: { width: 0, height: scale(2) },
                shadowRadius: scale(2),
                elevation: 3,
              }}
            >
              <SvgXml xml={PROFILE_PENCIL_SVG_XML} width={scale(16)} height={scale(16)} />
            </Pressable>
          </View>

          <View style={{ marginTop: scale(20), alignItems: 'center', gap: scale(4), width: scale(262) }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: scale(20),
                lineHeight: scale(20) * 1.5,
                color: colors.secondaryNeutral950,
                textAlign: 'center',
              }}
            >
              {studentName}
            </Text>
            <View style={{ alignItems: 'center', gap: scale(2) }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), lineHeight: scale(20), color: colors.gray800 }}>
                {school}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.gray800 }}>{classLabel}</Text>
                <View style={{ width: scale(3), height: scale(3), borderRadius: scale(1.5), backgroundColor: colors.gray400 }} />
                <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.gray800 }}>{subjectLabel}</Text>
                <View style={{ width: scale(3), height: scale(3), borderRadius: scale(1.5), backgroundColor: colors.gray400 }} />
                <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.gray800 }}>{sscYear}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: scale(24), paddingHorizontal: scale(16), gap: scale(20) }}>
          {/* Streak card (node 78:3362) */}
          <LinearGradient
            colors={[colors.profileStreakGradientStart, colors.profileStreakGradientEnd]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ borderRadius: scale(20), height: scale(154), paddingTop: scale(1) }}
          >
            <View
              style={{
                height: scale(65),
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255,255,255,0.25)',
                paddingHorizontal: scale(16),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                <SvgXml xml={PROFILE_FLAME_SVG_XML} width={scale(28.67)} height={scale(34)} />
                <Text style={{ fontFamily: fonts.medium, fontSize: scale(16), color: colors.white }}>তোমার স্ট্রিক</Text>
              </View>
              <Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: scale(32), lineHeight: scale(32) * 1.5, color: colors.white }}>
                  {String(streakDays).padStart(2, '0').replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)])}
                </Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.white }}> দিন</Text>
              </Text>
            </View>

            <View style={{ marginTop: scale(20), paddingHorizontal: scale(16), height: scale(56) }}>
              <View style={{ flexDirection: 'row' }}>
                {WEEK_DAYS.map((day) => (
                  <Text
                    key={day}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: fonts.medium,
                      fontSize: scale(14),
                      lineHeight: scale(14) * 1.6,
                      color: colors.white,
                    }}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              <View style={{ position: 'absolute', left: scale(8), top: scale(31) }}>
                <LinearGradient
                  colors={[colors.profileStreakPillStart, colors.profileStreakPillEnd]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ width: scale(179), height: scale(26), borderRadius: scale(111) }}
                />
              </View>
              {WEEK_DAYS.map((_, index) => {
                const left = 9 + index * 51;
                const isActive = activeDayIndices.includes(index);
                return (
                  <View key={index} style={{ position: 'absolute', left: scale(left), top: scale(32) }}>
                    {isActive ? (
                      <View
                        style={{
                          width: scale(24),
                          height: scale(24),
                          borderRadius: scale(12),
                          backgroundColor: colors.white,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SvgXml xml={PROFILE_FLAME_SVG_XML} width={scale(13.5)} height={scale(16)} />
                      </View>
                    ) : (
                      <SvgXml xml={PROFILE_DAY_RING_SVG_XML} width={scale(24)} height={scale(24)} />
                    )}
                  </View>
                );
              })}
            </View>
          </LinearGradient>

          {/* Menu list card (node 78:3470) */}
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: scale(24),
              paddingHorizontal: scale(20),
              paddingVertical: scale(16),
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: scale(1) },
              shadowRadius: scale(1.5),
              elevation: 2,
            }}
          >
            {MENU_ITEMS.map((item, index) => (
              <View key={item.id}>
                <Pressable
                  onPress={item.onPress}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: scale(20),
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(16), flex: 1 }}>
                    <Image source={item.icon} style={{ width: scale(48), height: scale(48), borderRadius: scale(16) }} />
                    <View style={{ flex: 1, gap: scale(2) }}>
                      <Text style={{ fontFamily: fonts.medium, fontSize: scale(16), lineHeight: scale(16) * 1.5, color: colors.profileMenuTitle }}>
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: scale(12),
                          lineHeight: scale(12) * 1.4,
                          color: colors.profileMenuSubtitle,
                        }}
                      >
                        {item.subtitle}
                      </Text>
                    </View>
                  </View>
                  <SvgXml xml={PROFILE_CHEVRON_RIGHT_SVG_XML} width={scale(24)} height={scale(24)} />
                </Pressable>
                {index < MENU_ITEMS.length - 1 && (
                  <View style={{ height: 1, backgroundColor: colors.gray200, marginVertical: scale(14) }} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.white }}>
        <HomeBottomNav onSelectHome={onSelectHome ?? onBack} onSelectCourse={onSelectCourse} onSelectAi={onSelectAi} />
      </SafeAreaView>
    </View>
  );
}

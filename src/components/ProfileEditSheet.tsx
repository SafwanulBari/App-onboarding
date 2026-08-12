import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PROFILE_AVATAR_DEFAULT_SVG_XML, PROFILE_UPLOAD_SVG_XML } from '../assets/svg/profileIcons';
import { colors, fonts, useScale } from '../theme/theme';

const waveBackground = require('../../assets/profile/edit-hero-waves.png');

const AVATAR_OPTIONS = [
  require('../../assets/profile/edit-avatars/avatar-01.png'),
  require('../../assets/profile/edit-avatars/avatar-02.png'),
  require('../../assets/profile/edit-avatars/avatar-03.png'),
  require('../../assets/profile/edit-avatars/avatar-04.png'),
  require('../../assets/profile/edit-avatars/avatar-05.png'),
  require('../../assets/profile/edit-avatars/avatar-06.png'),
  require('../../assets/profile/edit-avatars/avatar-07.png'),
  require('../../assets/profile/edit-avatars/avatar-08.png'),
  require('../../assets/profile/edit-avatars/avatar-09.png'),
  require('../../assets/profile/edit-avatars/avatar-10.png'),
  require('../../assets/profile/edit-avatars/avatar-11.png'),
  require('../../assets/profile/edit-avatars/avatar-12.png'),
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onUploadPhoto?: () => void;
  onSave?: (selectedAvatarIndex: number | null) => void;
};

// "Profile Picture Edit" bottom sheet (Figma node 78:2870, the modal state
// of the Profile page) — opens from the pencil badge on the avatar. Same
// Modal + PanResponder + Animated approach as StreakCalendarSheet (see
// that file for why: no bottom-sheet/gesture library in this project),
// just sized near-full-screen (the design leaves only a 54px sliver of
// the dimmed page visible above it, vs. the streak sheet's much shorter
// height) instead of hugging its own content height.
export default function ProfileEditSheet({ visible, onClose, onUploadPhoto, onSave }: Props) {
  const scale = useScale();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.setValue(windowHeight);
      backdropOpacity.setValue(0);
      setSelectedAvatar(null);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      });
    } else if (isMounted) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: windowHeight, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setIsMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120 || gesture.vy > 0.6) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
    })
  ).current;

  if (!isMounted) return null;

  const isSaveEnabled = selectedAvatar !== null;
  const sheetTop = insets.top + scale(54 - 52);
  const sheetHeight = windowHeight - sheetTop;

  const handleSave = () => {
    if (isSaveEnabled) {
      onSave?.(selectedAvatar);
    }
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ width: windowWidth, height: windowHeight }}>
        <Pressable style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} onPress={onClose}>
          <Animated.View style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropOpacity }} />
        </Pressable>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: sheetTop,
            height: sheetHeight,
            backgroundColor: colors.white,
            borderTopLeftRadius: scale(32),
            borderTopRightRadius: scale(32),
            overflow: 'hidden',
            transform: [{ translateY }],
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scale(96) }}>
            <View {...panResponder.panHandlers}>
              <Image source={waveBackground} style={{ width: windowWidth, height: scale(160) }} resizeMode="cover" />
              <View style={{ alignItems: 'center', position: 'absolute', left: 0, right: 0, top: scale(12) }}>
                <View style={{ width: scale(88), height: scale(4), borderRadius: scale(2), backgroundColor: 'rgba(255,255,255,0.6)' }} />
              </View>

              <View style={{ alignItems: 'center', marginTop: -scale(96) }}>
                <View
                  style={{
                    width: scale(120),
                    height: scale(120),
                    borderRadius: scale(60),
                    borderWidth: scale(2),
                    borderColor: colors.white,
                    backgroundColor: colors.gray300,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedAvatar !== null ? (
                    <Image source={AVATAR_OPTIONS[selectedAvatar]} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <SvgXml xml={PROFILE_AVATAR_DEFAULT_SVG_XML} width={scale(84)} height={scale(84)} />
                  )}
                </View>
              </View>
            </View>

            <View style={{ marginTop: scale(28), paddingHorizontal: scale(20), alignItems: 'center', gap: scale(12) }}>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(16), color: colors.secondaryNeutral950, textAlign: 'center' }}>
                প্রোফাইল পিকচার পরিবর্তন করো
              </Text>

              <Pressable
                onPress={onUploadPhoto}
                style={({ pressed }) => ({
                  width: '100%',
                  height: scale(90),
                  borderRadius: scale(20),
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: colors.homeAccent800,
                  backgroundColor: '#F7FBFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12), paddingHorizontal: scale(16) }}>
                  <LinearGradient
                    colors={[colors.primary500, '#323E99']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ width: scale(48), height: scale(48), borderRadius: scale(24), alignItems: 'center', justifyContent: 'center' }}
                  >
                    <SvgXml xml={PROFILE_UPLOAD_SVG_XML} width={scale(24)} height={scale(24)} />
                  </LinearGradient>
                  <View style={{ flex: 1, gap: scale(2) }}>
                    <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(14), color: '#171717' }}>ছবি যোগ করো</Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: scale(12), lineHeight: scale(12) * 1.6, color: colors.gray700 }}>
                      ব্রাউজ করতে ট্যাপ করুন, অথবা এখানে একটি ফাইল টেনে আনুন। JPG বা PNG, সর্বোচ্চ ৫ MB পর্যন্ত।
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>

            <View style={{ marginTop: scale(24), paddingHorizontal: scale(20), gap: scale(12) }}>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(16), color: colors.secondaryNeutral950, textAlign: 'center' }}>
                এভাটার সিলেক্ট করো
              </Text>
              {/* 4 per row (the design's own grouping — node 78:3115 etc.
                  each hold exactly 4). Explicit rows instead of a single
                  flexWrap container: 4*84 + 3*12 rounds to a hair over
                  372 at some scale() outputs, which made flexWrap silently
                  wrap to 3 per row instead of 4. */}
              {[0, 1, 2].map((rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {AVATAR_OPTIONS.slice(rowIndex * 4, rowIndex * 4 + 4).map((avatar, colIndex) => {
                    const index = rowIndex * 4 + colIndex;
                    const isSelected = selectedAvatar === index;
                    return (
                      <Pressable key={index} onPress={() => setSelectedAvatar(index)}>
                        <LinearGradient
                          colors={['#E2E8F1', '#C3CFE2']}
                          start={{ x: 0.5, y: 0 }}
                          end={{ x: 0.5, y: 1 }}
                          style={{
                            width: scale(84),
                            height: scale(84),
                            borderRadius: scale(42),
                            overflow: 'hidden',
                            borderWidth: isSelected ? scale(3) : 0,
                            borderColor: colors.primary500,
                          }}
                        >
                          <Image source={avatar} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        </LinearGradient>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>

          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: scale(20),
              paddingTop: scale(12),
              paddingBottom: insets.bottom + scale(12),
              backgroundColor: colors.white,
            }}
          >
            <Pressable
              onPress={handleSave}
              disabled={!isSaveEnabled}
              style={({ pressed }) => ({
                height: scale(48),
                borderRadius: scale(12),
                backgroundColor: isSaveEnabled ? colors.primary500 : colors.gray400,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed && isSaveEnabled ? 0.85 : 1,
              })}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.white }}>সেভ করো</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PROFILE_AVATAR_DEFAULT_SVG_XML, PROFILE_UPLOAD_SVG_XML } from '../assets/svg/profileIcons';
import { CHECK_SMALL_SUCCESS_SVG_XML } from '../assets/svg/checkSmall';
import { colors, fonts, useScale } from '../theme/theme';

const waveBackground = require('../../assets/profile/edit-hero-waves.png');

// Exported so ProfileScreen can render the same avatar image in the header
// circle after a save, without duplicating the require() list.
export const AVATAR_OPTIONS = [
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

// What the sheet hands back to the caller on save: either one of the 12
// preset avatars, or a real photo the user picked from their device. The two
// are mutually exclusive in the UI (picking one clears the other), so this
// is a discriminated union rather than a single nullable index.
export type ProfilePictureSelection =
  | { type: 'avatar'; avatarIndex: number }
  | { type: 'photo'; uri: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave?: (selection: ProfilePictureSelection) => void;
};

// "Profile Picture Edit" bottom sheet (Figma node 78:2870, the modal state
// of the Profile page) — opens from the pencil badge on the avatar. Same
// Modal + PanResponder + Animated approach as StreakCalendarSheet (see
// that file for why: no bottom-sheet/gesture library in this project),
// just sized near-full-screen (the design leaves only a 54px sliver of
// the dimmed page visible above it, vs. the streak sheet's much shorter
// height) instead of hugging its own content height.
export default function ProfileEditSheet({ visible, onClose, onSave }: Props) {
  const scale = useScale();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [uploadedPhotoUri, setUploadedPhotoUri] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.setValue(windowHeight);
      backdropOpacity.setValue(0);
      setSelectedAvatar(null);
      setUploadedPhotoUri(null);
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

  // `onClose` is a fresh arrow function from the parent on every render, but
  // the PanResponder below is only ever created once (useRef's initializer
  // runs once). Route through a ref instead of capturing `onClose` directly
  // in the responder's closures, so onPanResponderRelease always calls
  // whatever onClose the parent most recently passed in.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const panResponder = useRef(
    PanResponder.create({
      // Both the plain and *Capture variants are set to the same check.
      // The Capture variant runs before any nested child gets a chance to
      // claim the gesture — needed here since the drag zone sits above a
      // ScrollView-adjacent layout, and without it a child can win the
      // responder negotiation and the drag silently never starts.
      // onPanResponderTerminationRequest: false stops anything from
      // stealing the gesture back mid-drag once we do have it.
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onMoveShouldSetPanResponderCapture: (_, gesture) => gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100 || gesture.vy > 0.5) {
          onCloseRef.current();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
      },
    })
  ).current;

  if (!isMounted) return null;

  const isSaveEnabled = selectedAvatar !== null || uploadedPhotoUri !== null;
  const sheetTop = insets.top + scale(54 - 52);
  const sheetHeight = windowHeight - sheetTop;

  // Real image-library picker: request permission, launch the native
  // picker, and (if the user didn't cancel) preview the picked photo —
  // clearing any preset-avatar selection since the two are mutually
  // exclusive in this UI.
  const handleUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'অনুমতি প্রয়োজন',
        'প্রোফাইল ছবি বেছে নিতে তোমার ফটো লাইব্রেরিতে প্রবেশাধিকার প্রয়োজন। সেটিংস থেকে অনুমতি দাও।'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploadedPhotoUri(result.assets[0].uri);
      setSelectedAvatar(null);
    }
  };

  const handleSelectAvatar = (index: number) => {
    setSelectedAvatar(index);
    setUploadedPhotoUri(null);
  };

  const handleSave = () => {
    if (uploadedPhotoUri !== null) {
      onSave?.({ type: 'photo', uri: uploadedPhotoUri });
    } else if (selectedAvatar !== null) {
      onSave?.({ type: 'avatar', avatarIndex: selectedAvatar });
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
          {/* Drag zone: wave header + handle bar + avatar preview, kept
              OUTSIDE the ScrollView below on purpose. A PanResponder
              nested inside a ScrollView has to compete with the
              ScrollView's own native scroll responder for the same
              downward drag gesture — on native that competition usually
              goes to the ScrollView, which is why drag-to-dismiss from
              this zone wasn't working. Living outside it removes that
              conflict entirely (mirrors StreakCalendarSheet's drag zone,
              which was never inside its ScrollView). */}
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
                {uploadedPhotoUri !== null ? (
                  <Image source={{ uri: uploadedPhotoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : selectedAvatar !== null ? (
                  <Image source={AVATAR_OPTIONS[selectedAvatar]} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <SvgXml xml={PROFILE_AVATAR_DEFAULT_SVG_XML} width={scale(84)} height={scale(84)} />
                )}
              </View>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: scale(96) }}>
            <View style={{ marginTop: scale(28), paddingHorizontal: scale(20), alignItems: 'center', gap: scale(12) }}>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(16), color: colors.secondaryNeutral950, textAlign: 'center' }}>
                প্রোফাইল পিকচার পরিবর্তন করো
              </Text>

              <Pressable
                onPress={handleUploadPhoto}
                style={({ pressed }) => ({
                  width: '100%',
                  height: scale(90),
                  borderRadius: scale(20),
                  borderWidth: uploadedPhotoUri !== null ? scale(1.5) : 1,
                  borderStyle: uploadedPhotoUri !== null ? 'solid' : 'dashed',
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
                    {uploadedPhotoUri !== null ? (
                      <SvgXml xml={CHECK_SMALL_SUCCESS_SVG_XML} width={scale(24)} height={scale(24)} />
                    ) : (
                      <SvgXml xml={PROFILE_UPLOAD_SVG_XML} width={scale(24)} height={scale(24)} />
                    )}
                  </LinearGradient>
                  <View style={{ flex: 1, gap: scale(2) }}>
                    <Text style={{ fontFamily: fonts.semiBold, fontSize: scale(14), color: '#171717' }}>
                      {uploadedPhotoUri !== null ? 'ছবি নির্বাচিত হয়েছে' : 'ছবি যোগ করো'}
                    </Text>
                    <Text style={{ fontFamily: fonts.regular, fontSize: scale(12), lineHeight: scale(12) * 1.6, color: colors.gray700 }}>
                      {uploadedPhotoUri !== null
                        ? 'পরিবর্তন করতে আবার ট্যাপ করো।'
                        : 'ব্রাউজ করতে ট্যাপ করুন, অথবা এখানে একটি ফাইল টেনে আনুন। JPG বা PNG, সর্বোচ্চ ৫ MB পর্যন্ত।'}
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
                      <Pressable key={index} onPress={() => handleSelectAvatar(index)}>
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

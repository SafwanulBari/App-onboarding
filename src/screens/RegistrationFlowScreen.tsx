import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import {
  CHECK_SMALL_SVG_XML,
  CHECK_SMALL_SUCCESS_SVG_XML,
  CHECK_SMALL_SUCCESS_14_SVG_XML,
} from '../assets/svg/checkSmall';
import { ERROR_X_SVG_XML } from '../assets/svg/errorX';
import { EYE_HIDE_SVG_XML } from '../assets/svg/eyeHide';
import { EYE_SHOW_SVG_XML } from '../assets/svg/eyeShow';
import ClassSelectionConfirmOverlay from '../components/ClassSelectionConfirmOverlay';
import PasswordBoxInput from '../components/PasswordBoxInput';
import RegistrationBatchOptionCard from '../components/RegistrationBatchOptionCard';
import RegistrationClassOptionCard from '../components/RegistrationClassOptionCard';
import RegistrationGroupOptionCard from '../components/RegistrationGroupOptionCard';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import StepContentTransition from '../components/StepContentTransition';
import useAnimatedKeyboardHeight from '../hooks/useAnimatedKeyboardHeight';
import { colors, fonts, useScale } from '../theme/theme';

const scienceIcon = require('../../assets/registration/group-science.png');
const businessIcon = require('../../assets/registration/group-business.png');
const humanitiesIcon = require('../../assets/registration/group-humanities.png');

// This file consolidates what used to be 5 separate top-level screens
// (RegistrationNameScreen, RegistrationClassScreen, RegistrationBatchScreen,
// RegistrationGroupScreen, RegistrationPasswordScreen — all deleted).
// They each rendered their own full copy of the top progress bar, mascot
// card, and gradient background, so App.tsx swapping between them (even
// with a fade/slide transition) unmounted and remounted that whole shell
// every step, making the *entire page* look like it was moving/scrolling
// to the next one. The fix: one persistent shell (background + header +
// mascot, mounted once for the whole flow, below) with only the
// step-specific body/CTA swapping underneath via StepContentTransition —
// see that component for why its motion is deliberately lighter than the
// top-level ScreenTransition used for actual page navigation in App.tsx.

type Step = 'name' | 'class' | 'batch' | 'group' | 'password';

type StepMeta = {
  progress: number;
  title: string;
  subtitle: string;
  bubbleSize?: 'default' | 'tall';
  titleWeight?: 'bold' | 'semiBold';
};

// Progress fractions and mascot copy, verbatim from each step's original
// screen file / Figma node (see each STEP_META entry's node comment below)
// — unchanged by this refactor, just centralized so the persistent header/
// mascot can look them up by `step` instead of receiving them as props
// from 5 different screen components.
const STEP_META: Record<Step, StepMeta> = {
  // "2. Registration - Name" — node 54:3221
  name: {
    progress: 66 / 372,
    title: 'তোমার নাম কি?',
    subtitle: 'এই নামটি তোমার প্রোফাইল, সার্টিফিকেট এবং শেখার অগ্রগতিতে ব্যবহার করা হবে।',
  },
  // "4. Registration - Class" — node 54:2297
  class: {
    progress: 154 / 336,
    title: 'তুমি কোন ক্লাসে লেখাপড়া করছো?',
    subtitle: 'তোমার ক্লাস অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।',
  },
  // "5. Registration - Batch" — node 54:2452
  batch: {
    progress: 223 / 336,
    bubbleSize: 'tall',
    title: 'তোমার এইচএসসি পরীক্ষার ব্যাচ সিলেক্ট করো',
    subtitle: 'তোমার ব্যাচের জন্য প্রাসঙ্গিক পড়াশোনা ও পরীক্ষার প্রস্তুতি সাজিয়ে দেখানো হবে।',
  },
  // "6. Registration - Group" — node 54:2502
  group: {
    progress: 269 / 336,
    title: 'গ্রুপ সিলেক্ট করো',
    subtitle: 'তোমার গ্রুপ অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।',
  },
  // "7. Registration - Set Pasword" — node 54:1870
  password: {
    progress: 1,
    titleWeight: 'semiBold',
    title: 'পাসওয়ার্ড সেট করো',
    subtitle: 'পরবর্তীতে সহজেই লগ ইন করতে পাসওয়ার্ড সেট করে নাও',
  },
};

type ClassOption = { id: string; numeral: string; label: string };

const CLASS_OPTIONS: ClassOption[] = [
  { id: '6', numeral: '৬', label: 'ক্লাস ৬' },
  { id: '7', numeral: '৭', label: 'ক্লাস ৭' },
  { id: '8', numeral: '৮', label: 'ক্লাস ৮' },
  { id: '9', numeral: '৯', label: 'ক্লাস ৯ (নতুন কারিকুলাম)' },
  { id: '10', numeral: '১০', label: 'ক্লাস ১০' },
  { id: 'admission', numeral: 'A', label: 'এডমিশন' },
];

const BATCH_OPTIONS = ['২০২৪', '২০২৫', '২০২৬'];

type GroupOption = {
  id: string;
  label: string;
  icon: ReturnType<typeof require>;
  iconWidth: number;
  iconHeight: number;
  iconLeft: number;
  iconTop: number;
};

const GROUP_OPTIONS: GroupOption[] = [
  { id: 'science', label: 'বিজ্ঞান', icon: scienceIcon, iconWidth: 66.59, iconHeight: 73.874, iconLeft: 13, iconTop: -13 },
  { id: 'business', label: 'ব্যবসায় শিক্ষা', icon: businessIcon, iconWidth: 57.219, iconHeight: 73.982, iconLeft: 17, iconTop: -14 },
  { id: 'humanities', label: 'মানবিক', icon: humanitiesIcon, iconWidth: 71.72, iconHeight: 73.962, iconLeft: 10, iconTop: -14 },
];

const CONFIRM_SLIDE_IN_MS = 350;
const CONFIRM_HOLD_MS = 1000;
const CONFIRM_SLIDE_OUT_MS = 280;
const PASSWORD_LENGTH = 6;

// ---------------------------------------------------------------------
// Step bodies — each is what used to be the unique lower portion of one
// registration screen (everything below the header/mascot). Defined as
// top-level components (not inline closures) so they don't get torn down
// and recreated by RegistrationFlowScreen's own re-renders — only a real
// step change (StepContentTransition's key) should remount one of these.
// ---------------------------------------------------------------------

function NameBody({
  name,
  setName,
  isFocused,
  setIsFocused,
  isEnabled,
  onContinue,
}: {
  name: string;
  setName: (v: string) => void;
  isFocused: boolean;
  setIsFocused: (v: boolean) => void;
  isEnabled: boolean;
  onContinue: () => void;
}) {
  const scale = useScale();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useAnimatedKeyboardHeight();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Deferred focus instead of the `autoFocus` prop — see
    // useAnimatedKeyboardHeight's header comment. Firing the keyboard open
    // this early, before the screen's own first layout pass has settled,
    // is exactly the race that broke this on-device; a short delay gives
    // layout a frame to commit first.
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, []);

  // `keyboardHeight` is measured from the true screen bottom, but this
  // body already sits inside a SafeAreaView with a bottom inset (the home
  // indicator's safe area) baked into ITS bottom edge — so padding by the
  // raw keyboard height double-counts that inset and leaves a gap between
  // the CTA and the keyboard instead of the two sitting flush. Subtract
  // insets.bottom (clamped at 0) so the CTA lands exactly on the keyboard.
  const paddingBottom = keyboardHeight.interpolate({
    inputRange: [0, insets.bottom, 2000],
    outputRange: [0, 0, 2000 - insets.bottom],
    extrapolate: 'clamp',
  });

  return (
    // paddingBottom driven by the real keyboard height (see
    // useAnimatedKeyboardHeight) shrinks this body — not the sticky
    // header/mascot above it — so the CTA lands above the keyboard and
    // the input re-centers in the smaller visible area.
    <Animated.View style={{ flex: 1, paddingBottom }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: scale(20) }}>
          <View style={{ height: scale(24) * 1.6 }}>
            {name.length === 0 && (
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: fonts.regular,
                  fontSize: scale(24),
                  lineHeight: scale(24) * 1.6,
                  color: colors.gray700,
                  pointerEvents: 'none',
                }}
              >
                তোমার নাম লেখো
              </Text>
            )}
            <TextInput
              ref={inputRef}
              value={name}
              onChangeText={setName}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              cursorColor={colors.primary500}
              selectionColor={colors.primary500}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                fontFamily: fonts.semiBold,
                fontSize: scale(24),
                lineHeight: scale(24) * 1.6,
                color: colors.secondaryNeutral950,
                textAlign: 'center',
              }}
            />
          </View>
          <View
            style={{
              marginTop: scale(12),
              height: scale(1.5),
              borderRadius: scale(1),
              backgroundColor: isFocused ? colors.primary500 : colors.secondaryNeutral600,
            }}
          />
        </View>

        <View style={{ backgroundColor: colors.white, padding: scale(20) }}>
          <Pressable
            onPress={onContinue}
            disabled={!isEnabled}
            style={({ pressed }) => ({
              height: scale(48),
              borderRadius: scale(12),
              backgroundColor: isEnabled ? colors.primary500 : colors.gray400,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed && isEnabled ? 0.85 : 1,
            })}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), lineHeight: scale(14) * 1.6, color: colors.white }}>
              এগিয়ে যাও
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

function ClassBody({
  pendingClassId,
  cardsOpacity,
  onSelect,
}: {
  pendingClassId: string | null;
  cardsOpacity: Animated.AnimatedInterpolation<string | number>;
  onSelect: (classId: string) => void;
}) {
  const scale = useScale();

  return (
    <Animated.View
      style={{
        marginTop: scale(64),
        paddingHorizontal: scale(20),
        gap: scale(20),
        opacity: cardsOpacity,
      }}
      pointerEvents={pendingClassId ? 'none' : 'auto'}
    >
      {CLASS_OPTIONS.map((option) => (
        <RegistrationClassOptionCard
          key={option.id}
          numeral={option.numeral}
          label={option.label}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </Animated.View>
  );
}

function BatchBody({ selected, onSelect }: { selected: string; onSelect: (batch: string) => void }) {
  const scale = useScale();

  return (
    <View style={{ marginTop: scale(72), paddingHorizontal: scale(20), gap: scale(20) }}>
      {BATCH_OPTIONS.map((batch) => (
        <RegistrationBatchOptionCard
          key={batch}
          label={batch}
          selected={batch === selected}
          onPress={() => onSelect(batch)}
        />
      ))}
    </View>
  );
}

function GroupBody({ selected, onSelect }: { selected: string; onSelect: (groupId: string) => void }) {
  const scale = useScale();

  return (
    <View style={{ marginTop: scale(72), paddingHorizontal: scale(20), gap: scale(30) }}>
      {GROUP_OPTIONS.map((option) => (
        <RegistrationGroupOptionCard
          key={option.id}
          icon={option.icon}
          iconWidth={option.iconWidth}
          iconHeight={option.iconHeight}
          iconLeft={option.iconLeft}
          iconTop={option.iconTop}
          label={option.label}
          selected={option.id === selected}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </View>
  );
}

function PasswordBody({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isPasswordRevealed,
  setIsPasswordRevealed,
  isConfirmRevealed,
  setIsConfirmRevealed,
  isPasswordComplete,
  isConfirmEnabled,
  isConfirmComplete,
  hasMismatchError,
  isSaveEnabled,
  onSave,
}: {
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isPasswordRevealed: boolean;
  setIsPasswordRevealed: (fn: (v: boolean) => boolean) => void;
  isConfirmRevealed: boolean;
  setIsConfirmRevealed: (fn: (v: boolean) => boolean) => void;
  isPasswordComplete: boolean;
  isConfirmEnabled: boolean;
  isConfirmComplete: boolean;
  hasMismatchError: boolean;
  isSaveEnabled: boolean;
  onSave: () => void;
}) {
  const scale = useScale();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={{ marginTop: scale(64), paddingHorizontal: scale(20), gap: scale(40) }}>
        <View style={{ alignItems: 'center', gap: scale(8) }}>
          <View style={{ alignItems: 'center', gap: scale(8) }}>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: scale(18),
                lineHeight: scale(18) * 1.5,
                color: colors.secondaryNeutral950,
              }}
            >
              পাসওয়ার্ড
            </Text>
            <PasswordBoxInput
              length={PASSWORD_LENGTH}
              value={password}
              onChangeValue={setPassword}
              revealed={isPasswordRevealed}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
              <SvgXml
                xml={isPasswordComplete ? CHECK_SMALL_SUCCESS_SVG_XML : CHECK_SMALL_SVG_XML}
                width={scale(isPasswordComplete ? 16 : 14)}
                height={scale(isPasswordComplete ? 16 : 14)}
              />
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: scale(12),
                  lineHeight: scale(12) * 1.6,
                  color: isPasswordComplete ? colors.success600 : colors.gray600,
                }}
              >
                *৬ সংখ্যার পাসওয়ার্ড
              </Text>
            </View>
            <Pressable
              onPress={() => setIsPasswordRevealed((v) => !v)}
              hitSlop={8}
              style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}
            >
              <SvgXml
                xml={isPasswordRevealed ? EYE_HIDE_SVG_XML : EYE_SHOW_SVG_XML}
                width={scale(16)}
                height={scale(16)}
              />
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: scale(12),
                  lineHeight: scale(12) * 1.6,
                  color: colors.primary500,
                  textDecorationLine: 'underline',
                }}
              >
                {isPasswordRevealed ? 'হাইড পিন' : 'পিন দেখো'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ alignItems: 'center', gap: scale(8) }}>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: scale(18),
              lineHeight: scale(18) * 1.5,
              color: isConfirmEnabled ? colors.secondaryNeutral950 : colors.gray500,
            }}
          >
            পাসওয়ার্ড কনফার্ম করো
          </Text>
          <PasswordBoxInput
            length={PASSWORD_LENGTH}
            value={confirmPassword}
            onChangeValue={setConfirmPassword}
            disabled={!isConfirmEnabled}
            revealed={isConfirmRevealed}
            error={hasMismatchError}
          />
          {isConfirmEnabled && confirmPassword.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              {hasMismatchError ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                  <SvgXml xml={ERROR_X_SVG_XML} width={scale(14)} height={scale(14)} />
                  <Text style={{ fontFamily: fonts.regular, fontSize: scale(12), lineHeight: scale(12) * 1.6, color: colors.error500 }}>
                    পাসওয়ার্ড সঠিক নয়
                  </Text>
                </View>
              ) : isConfirmComplete ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}>
                  <SvgXml xml={CHECK_SMALL_SUCCESS_14_SVG_XML} width={scale(14)} height={scale(14)} />
                  <Text style={{ fontFamily: fonts.regular, fontSize: scale(12), lineHeight: scale(12) * 1.6, color: colors.success600 }}>
                    সঠিক
                  </Text>
                </View>
              ) : (
                <View />
              )}
              <Pressable
                onPress={() => setIsConfirmRevealed((v) => !v)}
                hitSlop={8}
                style={{ flexDirection: 'row', alignItems: 'center', gap: scale(6) }}
              >
                <SvgXml
                  xml={isConfirmRevealed ? EYE_HIDE_SVG_XML : EYE_SHOW_SVG_XML}
                  width={scale(16)}
                  height={scale(16)}
                />
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: scale(12),
                    lineHeight: scale(12) * 1.6,
                    color: colors.primary500,
                    textDecorationLine: 'underline',
                  }}
                >
                  {isConfirmRevealed ? 'হাইড পিন' : 'পিন দেখো'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <View style={{ marginTop: 'auto', paddingHorizontal: scale(20), paddingBottom: scale(20), paddingTop: scale(40) }}>
        <Pressable
          onPress={onSave}
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
          <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), lineHeight: scale(14) * 1.6, color: colors.white }}>
            সেভ করো
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------

type Props = {
  onComplete?: (password: string) => void;
};

export default function RegistrationFlowScreen({ onComplete }: Props) {
  const scale = useScale();
  const [step, setStep] = useState<Step>('name');

  const [name, setName] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);

  const [pendingClassId, setPendingClassId] = useState<string | null>(null);
  const confirmProgress = useRef(new Animated.Value(0)).current;

  const [selectedBatch, setSelectedBatch] = useState(BATCH_OPTIONS[0]);
  const [selectedGroup, setSelectedGroup] = useState(GROUP_OPTIONS[0].id);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const [isConfirmRevealed, setIsConfirmRevealed] = useState(false);

  const meta = STEP_META[step];

  const isNameEnabled = name.trim().length > 0;
  const handleNameContinue = () => {
    if (isNameEnabled) {
      setStep('class');
    }
  };

  const handleClassSelect = (classId: string) => {
    if (pendingClassId) {
      return;
    }
    setPendingClassId(classId);

    Animated.timing(confirmProgress, {
      toValue: 1,
      duration: CONFIRM_SLIDE_IN_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setTimeout(() => {
        Animated.timing(confirmProgress, {
          toValue: 0,
          duration: CONFIRM_SLIDE_OUT_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(({ finished: exitFinished }) => {
          if (exitFinished) {
            setPendingClassId(null);
            setStep('batch');
          }
        });
      }, CONFIRM_HOLD_MS);
    });
  };

  const cardsOpacity = confirmProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] });

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch);
    setStep('group');
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    setStep('password');
  };

  const isPasswordComplete = password.length === PASSWORD_LENGTH;
  const isConfirmEnabled = isPasswordComplete;
  const isConfirmComplete = confirmPassword.length === PASSWORD_LENGTH;
  const hasMismatchError = isConfirmEnabled && isConfirmComplete && password !== confirmPassword;
  const isSaveEnabled = isPasswordComplete && isConfirmComplete && password === confirmPassword;
  const handleSave = () => {
    if (isSaveEnabled) {
      onComplete?.(password);
    }
  };

  const handleBack = () => {
    if (step === 'class') setStep('name');
    else if (step === 'batch') setStep('class');
    else if (step === 'group') setStep('batch');
    else if (step === 'password') setStep('group');
  };

  return (
    <LinearGradient
      colors={[colors.registrationGradientStart, colors.registrationGradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Sticky shell: header, mascot, and the gradient background above
            are mounted exactly once for the whole registration flow —
            only their bound values (progress fraction, title/subtitle)
            change per step, via StepContentTransition below, instead of
            the whole shell unmounting/remounting per step. */}
        <RegistrationHeader progress={meta.progress} onBack={step === 'name' ? undefined : handleBack} />

        <View style={{ marginTop: scale(28) }}>
          <StepContentTransition stepKey={step}>
            <RegistrationMascotCard
              title={meta.title}
              subtitle={meta.subtitle}
              bubbleSize={meta.bubbleSize}
              titleWeight={meta.titleWeight}
            />
          </StepContentTransition>
        </View>

        <StepContentTransition stepKey={step} style={{ flex: 1 }}>
          {step === 'name' && (
            <NameBody
              name={name}
              setName={setName}
              isFocused={isNameFocused}
              setIsFocused={setIsNameFocused}
              isEnabled={isNameEnabled}
              onContinue={handleNameContinue}
            />
          )}
          {step === 'class' && (
            <ClassBody pendingClassId={pendingClassId} cardsOpacity={cardsOpacity} onSelect={handleClassSelect} />
          )}
          {step === 'batch' && <BatchBody selected={selectedBatch} onSelect={handleBatchSelect} />}
          {step === 'group' && <GroupBody selected={selectedGroup} onSelect={handleGroupSelect} />}
          {step === 'password' && (
            <PasswordBody
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isPasswordRevealed={isPasswordRevealed}
              setIsPasswordRevealed={setIsPasswordRevealed}
              isConfirmRevealed={isConfirmRevealed}
              setIsConfirmRevealed={setIsConfirmRevealed}
              isPasswordComplete={isPasswordComplete}
              isConfirmEnabled={isConfirmEnabled}
              isConfirmComplete={isConfirmComplete}
              hasMismatchError={hasMismatchError}
              isSaveEnabled={isSaveEnabled}
              onSave={handleSave}
            />
          )}
        </StepContentTransition>

        {/* Direct SafeAreaView sibling (not nested inside the step body
            above), same as its original home in RegistrationClassScreen —
            its `top: scale(289)` is measured from SafeAreaView's own top
            edge, not from wherever the step body happens to start. */}
        {step === 'class' && pendingClassId && <ClassSelectionConfirmOverlay progress={confirmProgress} />}
      </SafeAreaView>
    </LinearGradient>
  );
}

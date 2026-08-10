import React, { useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClassSelectionConfirmOverlay from '../components/ClassSelectionConfirmOverlay';
import RegistrationClassOptionCard from '../components/RegistrationClassOptionCard';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, useScale } from '../theme/theme';

// Progress fill = 154/336, the exact ratio Figma shows on node 54:2297
// (this screen's track is narrower than the name screen's since it shares
// its row with the back button: 336px vs the full 372px).
const PROGRESS = 154 / 336;

const CONFIRM_SLIDE_IN_MS = 350;
const CONFIRM_HOLD_MS = 1500;
const CONFIRM_SLIDE_OUT_MS = 280;

type ClassOption = {
  id: string;
  numeral: string;
  label: string;
};

const CLASS_OPTIONS: ClassOption[] = [
  { id: '6', numeral: '৬', label: 'ক্লাস ৬' },
  { id: '7', numeral: '৭', label: 'ক্লাস ৭' },
  { id: '8', numeral: '৮', label: 'ক্লাস ৮' },
  { id: '9', numeral: '৯', label: 'ক্লাস ৯ (নতুন কারিকুলাম)' },
  { id: '10', numeral: '১০', label: 'ক্লাস ১০' },
  { id: 'admission', numeral: 'A', label: 'এডমিশন' },
];

type Props = {
  onBack?: () => void;
  onSelectClass?: (classId: string) => void;
};

// Figma: "4. Registration - Class" — node 54:2297, confirmation state
// "4. Registration - Class - Thums UP" — node 54:2371
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-2297
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-2371
export default function RegistrationClassScreen({ onBack, onSelectClass }: Props) {
  const scale = useScale();
  const [pendingClassId, setPendingClassId] = useState<string | null>(null);
  const confirmProgress = useRef(new Animated.Value(0)).current;

  const handleSelect = (classId: string) => {
    // Ignore taps while a selection is already animating through.
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
            onSelectClass?.(classId);
          }
        });
      }, CONFIRM_HOLD_MS);
    });
  };

  // Dims the card list to 40% opacity while the confirmation is showing
  // (Figma's opacity-40 on node 54:2402), synced off the same Animated
  // value that drives the confirmation's slide so both move together.
  const cardsOpacity = confirmProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.4],
  });

  return (
    <LinearGradient
      colors={[colors.registrationGradientStart, colors.registrationGradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <RegistrationHeader progress={PROGRESS} onBack={onBack} />

        <View style={{ marginTop: scale(28) }}>
          <RegistrationMascotCard
            title="তুমি কোন ক্লাসে লেখাপড়া করছো?"
            subtitle="তোমার ক্লাস অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।"
          />
        </View>

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
              onPress={() => handleSelect(option.id)}
            />
          ))}
        </Animated.View>

        {/* Absolutely positioned relative to this SafeAreaView, matching
            the design's own frame-relative coordinates (see
            ClassSelectionConfirmOverlay's `top`/`left` — computed from
            Figma's node 54:2371 minus the 44px status-bar height, since
            SafeAreaView's top edge already sits below it). */}
        {pendingClassId && <ClassSelectionConfirmOverlay progress={confirmProgress} />}
      </SafeAreaView>
    </LinearGradient>
  );
}

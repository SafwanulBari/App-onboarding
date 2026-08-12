import React from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import GuestClassOptionRow from '../components/GuestClassOptionRow';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, useScale } from '../theme/theme';

type ClassOption = { id: string; numeral: string; label: string };

// Same class list/copy as the main registration flow's own class step
// (RegistrationFlowScreen's CLASS_OPTIONS) — this is a separate Figma
// frame (54:20049, also named "4. Registration - Class") reached from a
// different entry point (the "অ্যাকাউন্ট ছাড়াই ব্যবহার করো" / "use without
// account" link on the mobile-number screen), not a duplicate to keep in
// sync by hand elsewhere — it's a distinct list because it's a distinct
// design node with its own progress value and row styling.
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

// Figma: "4. Registration - Class" — node 54:20049, the guest-mode class
// picker reached from LoginMobileNumberScreen's "অ্যাকাউন্ট ছাড়াই ব্যবহার
// করো" (use without account) link, skipping OTP/registration entirely.
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-20049
export default function GuestClassSelectionScreen({ onBack, onSelectClass }: Props) {
  const scale = useScale();

  return (
    <LinearGradient
      colors={[colors.registrationGradientStart, colors.registrationGradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* progress: 108/336 measured off this frame's own pill fill —
            deliberately not the main flow's class-step fraction (154/336),
            since this is a separate, shorter guest funnel with its own
            step count. */}
        <RegistrationHeader progress={108 / 336} onBack={onBack} />

        <View style={{ marginTop: scale(28) }}>
          <RegistrationMascotCard
            title="তুমি কোন ক্লাসে লেখাপড়া করছো?"
            subtitle="তোমার ক্লাস অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।"
          />
        </View>

        <ScrollView
          style={{ marginTop: scale(64) }}
          contentContainerStyle={{ paddingHorizontal: scale(20), gap: scale(16), paddingBottom: scale(24) }}
          showsVerticalScrollIndicator={false}
        >
          {CLASS_OPTIONS.map((option) => (
            <GuestClassOptionRow
              key={option.id}
              numeral={option.numeral}
              label={option.label}
              onPress={() => onSelectClass?.(option.id)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

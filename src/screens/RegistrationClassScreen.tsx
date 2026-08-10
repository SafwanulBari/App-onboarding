import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegistrationClassOptionCard from '../components/RegistrationClassOptionCard';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import { colors, useScale } from '../theme/theme';

// Progress fill = 154/336, the exact ratio Figma shows on node 54:2297
// (this screen's track is narrower than the name screen's since it shares
// its row with the back button: 336px vs the full 372px).
const PROGRESS = 154 / 336;

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

// Figma: "4. Registration - Class" — node 54:2297
// https://www.figma.com/design/BRYiy1cPYtONG0fHRjj5Ez/Vibe-Code?node-id=54-2297
export default function RegistrationClassScreen({ onBack, onSelectClass }: Props) {
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
        <RegistrationHeader progress={PROGRESS} onBack={onBack} />

        <View style={{ marginTop: scale(28) }}>
          <RegistrationMascotCard
            title="তুমি কোন ক্লাসে লেখাপড়া করছো?"
            subtitle="তোমার ক্লাস অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।"
          />
        </View>

        <View style={{ marginTop: scale(64), paddingHorizontal: scale(20), gap: scale(20) }}>
          {CLASS_OPTIONS.map((option) => (
            <RegistrationClassOptionCard
              key={option.id}
              numeral={option.numeral}
              label={option.label}
              onPress={() => onSelectClass?.(option.id)}
            />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

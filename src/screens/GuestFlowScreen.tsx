import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import GuestClassOptionRow from '../components/GuestClassOptionRow';
import RegistrationBatchOptionCard from '../components/RegistrationBatchOptionCard';
import RegistrationGroupOptionCard from '../components/RegistrationGroupOptionCard';
import RegistrationHeader from '../components/RegistrationHeader';
import RegistrationMascotCard from '../components/RegistrationMascotCard';
import StepContentTransition from '../components/StepContentTransition';
import { colors, useScale } from '../theme/theme';

const scienceIcon = require('../../assets/registration/group-science.png');
const businessIcon = require('../../assets/registration/group-business.png');
const humanitiesIcon = require('../../assets/registration/group-humanities.png');

// This file consolidates what used to be 3 separate top-level screens
// (GuestClassSelectionScreen, GuestBatchSelectionScreen,
// GuestGroupSelectionScreen — all deleted). Each rendered its own full
// copy of the top progress bar, mascot card, and gradient background, so
// App.tsx swapping between them made the *entire page* look like it was
// sliding to a new one on every step. Same fix as RegistrationFlowScreen
// (see that file's own header comment for the original writeup): one
// persistent shell — background + header + mascot, mounted once for the
// whole guest funnel — with only the step-specific body swapping
// underneath via StepContentTransition.

type Step = 'class' | 'batch' | 'group';

type StepMeta = {
  progress: number;
  title: string;
  subtitle: string;
  bubbleSize?: 'default' | 'tall';
};

// Progress fractions and mascot copy, verbatim from each guest step's
// original screen file / Figma node (54:20049, 54:20121, 54:20171) —
// unchanged by this refactor, just centralized so the persistent header/
// mascot can look them up by `step` instead of receiving them as props
// from 3 different screen components. Deliberately its own fractions
// (not the main registration flow's STEP_META) — this is a separate,
// shorter funnel with its own step count.
const STEP_META: Record<Step, StepMeta> = {
  // "4. Registration - Class" (guest variant) — node 54:20049
  class: {
    progress: 108 / 336,
    title: 'তুমি কোন ক্লাসে লেখাপড়া করছো?',
    subtitle: 'তোমার ক্লাস অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।',
  },
  // "5. Registration - Batch" (guest variant) — node 54:20121
  batch: {
    progress: 248 / 336,
    bubbleSize: 'tall',
    title: 'তোমার এইচএসসি পরীক্ষার ব্যাচ সিলেক্ট করো',
    subtitle: 'তোমার ব্যাচের জন্য প্রাসঙ্গিক পড়াশোনা ও পরীক্ষার প্রস্তুতি সাজিয়ে দেখানো হবে।',
  },
  // "6. Registration - Group" (guest variant) — node 54:20171
  group: {
    progress: 1,
    title: 'গ্রুপ সিলেক্ট করো',
    subtitle: 'তোমার গ্রুপ অনুযায়ী সঠিক বিষয়, ক্লাস ও শেখার কনটেন্ট দেখানো হবে।',
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

// ---------------------------------------------------------------------
// Step bodies — top-level components (not inline closures) so they don't
// get torn down and recreated by GuestFlowScreen's own re-renders — only
// a real step change (StepContentTransition's key) should remount one.
// ---------------------------------------------------------------------

function ClassBody({ onSelect }: { onSelect: (classId: string) => void }) {
  const scale = useScale();

  return (
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
          onPress={() => onSelect(option.id)}
        />
      ))}
    </ScrollView>
  );
}

function BatchBody({ selected, onSelect }: { selected: string; onSelect: (batch: string) => void }) {
  const scale = useScale();

  return (
    <ScrollView
      style={{ marginTop: scale(72) }}
      contentContainerStyle={{ paddingHorizontal: scale(20), gap: scale(20), paddingBottom: scale(24) }}
      showsVerticalScrollIndicator={false}
    >
      {BATCH_OPTIONS.map((batch) => (
        <RegistrationBatchOptionCard
          key={batch}
          label={batch}
          selected={batch === selected}
          onPress={() => onSelect(batch)}
        />
      ))}
    </ScrollView>
  );
}

function GroupBody({ selected, onSelect }: { selected: string | null; onSelect: (groupId: string) => void }) {
  const scale = useScale();

  return (
    <ScrollView
      style={{ marginTop: scale(72) }}
      contentContainerStyle={{ paddingHorizontal: scale(20), gap: scale(30), paddingBottom: scale(24) }}
      showsVerticalScrollIndicator={false}
    >
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
    </ScrollView>
  );
}

// ---------------------------------------------------------------------

type Props = {
  // Back button pressed on the first step (class) — leaves the guest
  // funnel entirely, back to the login screen.
  onExit?: () => void;
  // All 3 steps picked — the funnel is done. Passes the full selection
  // along in case a caller wants it later (App.tsx currently just routes
  // to Home on this).
  onComplete?: (selection: { classId: string; batch: string; groupId: string }) => void;
};

export default function GuestFlowScreen({ onExit, onComplete }: Props) {
  const scale = useScale();
  const [step, setStep] = useState<Step>('class');

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState(BATCH_OPTIONS[0]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const meta = STEP_META[step];

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    setStep('batch');
  };

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch);
    setStep('group');
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    onComplete?.({ classId: selectedClass ?? '', batch: selectedBatch, groupId });
  };

  const handleBack = () => {
    if (step === 'batch') setStep('class');
    else if (step === 'group') setStep('batch');
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
            are mounted exactly once for the whole guest funnel — only
            their bound values (progress fraction, title/subtitle) change
            per step, via StepContentTransition below, instead of the
            whole shell unmounting/remounting per step. */}
        <RegistrationHeader progress={meta.progress} onBack={step === 'class' ? onExit : handleBack} />

        <View style={{ marginTop: scale(28) }}>
          <StepContentTransition stepKey={step}>
            <RegistrationMascotCard title={meta.title} subtitle={meta.subtitle} bubbleSize={meta.bubbleSize} />
          </StepContentTransition>
        </View>

        <StepContentTransition stepKey={step} style={{ flex: 1 }}>
          {step === 'class' && <ClassBody onSelect={handleClassSelect} />}
          {step === 'batch' && <BatchBody selected={selectedBatch} onSelect={handleBatchSelect} />}
          {step === 'group' && <GroupBody selected={selectedGroup} onSelect={handleGroupSelect} />}
        </StepContentTransition>
      </SafeAreaView>
    </LinearGradient>
  );
}

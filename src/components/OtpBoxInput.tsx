import React, { useRef, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors, fonts, useScale } from '../theme/theme';
import { toWesternDigits } from '../utils/bengaliDigits';

type Props = {
  length: number;
  value: string;
  onChangeValue: (value: string) => void;
};

// A 4-box OTP entry. Implemented as one invisible TextInput capturing all
// keystrokes, overlaid on top of `length` visual boxes that render
// individual digits from `value` — the standard, reliable pattern for a
// multi-box code input in RN (avoids juggling separate refs/auto-advance
// logic across real per-box TextInputs).
//
// Matches Figma nodes 54:18611 (default) and 54:18748 (Typing, 54:18696):
// digits render as plain Western numerals here (unlike the phone number
// field, which uses Bengali numerals) and the "active" box while focused
// is the most recently *filled* one, not the next empty one — e.g. after
// typing two digits, box 2 (holding the just-typed digit) gets the
// accent100/primary500 highlight, not empty box 3. Box 1 (already typed,
// no longer "active") reverts to a plain white fill with a gray400 border.
export default function OtpBoxInput({ length, value, onChangeValue }: Props) {
  const scale = useScale();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleChangeText = (text: string) => {
    onChangeValue(toWesternDigits(text).replace(/\D/g, '').slice(0, length));
  };

  const activeIndex = isFocused ? Math.max(0, value.length - 1) : -1;

  return (
    <View
      style={{ width: scale(48 * length + 20 * (length - 1)), height: scale(54) }}
      onTouchEnd={() => inputRef.current?.focus()}
    >
      <View style={{ flexDirection: 'row', gap: scale(20) }}>
        {Array.from({ length }).map((_, i) => {
          const digit = value[i];
          const isActive = i === activeIndex;
          const isFilled = !!digit;

          let backgroundColor: string = colors.gray200;
          if (isActive) backgroundColor = colors.accent100;
          else if (isFilled) backgroundColor = colors.white;

          return (
            <View
              key={i}
              style={{
                width: scale(48),
                height: scale(54),
                borderRadius: scale(12),
                backgroundColor,
                borderWidth: isActive ? scale(2) : scale(1),
                borderColor: isActive ? colors.primary500 : colors.gray400,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {digit && (
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: scale(18),
                    lineHeight: scale(18) * 1.6,
                    color: colors.gray900,
                  }}
                >
                  {digit}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
      />
    </View>
  );
}

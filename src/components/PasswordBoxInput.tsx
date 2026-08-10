import React, { useRef, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import { Text, TextInput, View } from 'react-native';
import { PASSWORD_MASK_STAR_SVG_XML } from '../assets/svg/passwordMaskStar';
import { colors, fonts, useScale } from '../theme/theme';
import { toWesternDigits } from '../utils/bengaliDigits';

type Props = {
  length: number;
  value: string;
  onChangeValue: (value: string) => void;
  disabled?: boolean;
  // "পিন দেখো" (show PIN) toggle — when true, every filled box shows its
  // plain digit; when false (default), only the box currently being typed
  // reveals its digit and the rest show the masked star. Driven by the
  // parent screen (only the primary password field has this toggle in the
  // design, not confirm-password).
  revealed?: boolean;
  // Confirm-password's "wrong password" state (Figma node 54:2196) — every
  // box gets an error500 border (overriding the active/filled colors)
  // once confirm-password is complete and doesn't match.
  error?: boolean;
};

// A 6-box numeric password entry. Same invisible-TextInput-over-visual-
// boxes pattern as OtpBoxInput, matching Figma nodes 54:1870 (default/
// empty state) and 54:2013 ("Typing" state) for "7. Registration - Set
// Pasword":
// - Empty box: white (or gray50 if `disabled`) bg, gray300 border.
// - Filled, not the active box: white bg, gray400 border, masked with a
//   6-point star glyph (54:2053) rather than a plain dot or digit.
// - Active box (the one just typed, while focused): accent100 bg,
//   primary500 1px border, and — unless `revealed` is already showing
//   everything — its digit is shown in plain text, matching the design's
//   "reveal the digit you just typed" PIN-entry convention (54:2063/2065).
export default function PasswordBoxInput({ length, value, onChangeValue, disabled, revealed, error }: Props) {
  const scale = useScale();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleChangeText = (text: string) => {
    onChangeValue(toWesternDigits(text).replace(/\D/g, '').slice(0, length));
  };

  const activeIndex = isFocused ? Math.max(0, value.length - 1) : -1;
  const gap = 16.8;

  return (
    <View
      style={{ width: scale(48 * length + gap * (length - 1)), height: scale(54) }}
      onTouchEnd={() => {
        if (!disabled) inputRef.current?.focus();
      }}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <View style={{ flexDirection: 'row', gap: scale(gap) }}>
        {Array.from({ length }).map((_, i) => {
          const digit = value[i];
          const isFilled = !!digit;
          const isActive = i === activeIndex;
          const showDigit = isFilled && (revealed || isActive);

          let backgroundColor: string = disabled ? colors.gray50 : colors.white;
          let borderColor: string = colors.gray300;
          if (isActive) {
            backgroundColor = colors.accent100;
            borderColor = colors.primary500;
          } else if (isFilled) {
            borderColor = colors.gray400;
          }
          if (error) {
            backgroundColor = colors.white;
            borderColor = colors.error500;
          }

          return (
            <View
              key={i}
              style={{
                width: scale(48),
                height: scale(54),
                borderRadius: scale(12),
                backgroundColor,
                borderWidth: scale(1),
                borderColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isFilled &&
                (showDigit ? (
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
                ) : (
                  <SvgXml xml={PASSWORD_MASK_STAR_SVG_XML} width={scale(14)} height={scale(13.3193)} />
                ))}
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
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
      />
    </View>
  );
}

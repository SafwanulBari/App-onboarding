// Figma's "typing"/"filled" states for the mobile number field (nodes
// 54:19068, 54:18990) display entered digits as Bengali numerals
// (e.g. "০১৬২১৭০৫৬"), matching the rest of the app's Bangla localization,
// even though the keyboard types Western digits. This transliterates for
// display only — validation/counting elsewhere still works on the raw
// Western-digit string.
const WESTERN_TO_BENGALI: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const BENGALI_TO_WESTERN: Record<string, string> = Object.fromEntries(
  Object.entries(WESTERN_TO_BENGALI).map(([western, bengali]) => [bengali, western])
);

export function toBengaliDigits(input: string): string {
  return input.replace(/[0-9]/g, (digit) => WESTERN_TO_BENGALI[digit] ?? digit);
}

// Reverses toBengaliDigits(). Needed because a controlled <TextInput> whose
// `value` is Bengali-transliterated echoes those Bengali characters back in
// its next onChangeText call (previous text + the newly typed character) —
// without converting them back first, a plain Western-digit filter (`\D`)
// treats every already-displayed Bengali digit as non-digit garbage and
// strips it, leaving only the latest keystroke.
export function toWesternDigits(input: string): string {
  return input.replace(/[০-৯]/g, (digit) => BENGALI_TO_WESTERN[digit] ?? digit);
}

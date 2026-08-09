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

export function toBengaliDigits(input: string): string {
  return input.replace(/[0-9]/g, (digit) => WESTERN_TO_BENGALI[digit] ?? digit);
}

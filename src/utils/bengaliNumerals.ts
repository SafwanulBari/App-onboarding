// Converts any number/numeric string to Bengali numeral digits — used
// everywhere the app shows a count in-copy (streak days, calendar dates)
// since the design always sets these in Bengali script, not Arabic
// numerals.
const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';

export function toBengaliNumerals(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => BENGALI_DIGITS[Number(d)]);
}

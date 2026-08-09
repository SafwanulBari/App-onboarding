// Matches Figma's masking pattern for the OTP screen's confirmation text
// (node 54:18610): "019******42" — first 3 digits, 6 stars, last 2 digits.
// Kept in Western digits (unlike the input fields, which display Bengali
// numerals) since that's how the design itself renders it.
export function maskPhoneNumber(digits: string): string {
  if (digits.length <= 5) {
    return digits;
  }
  const visibleStart = digits.slice(0, 3);
  const visibleEnd = digits.slice(-2);
  const maskedLength = digits.length - visibleStart.length - visibleEnd.length;
  return `${visibleStart}${'*'.repeat(maskedLength)}${visibleEnd}`;
}

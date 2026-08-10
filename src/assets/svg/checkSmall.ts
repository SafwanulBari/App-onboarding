// Source: Figma node 54:1916 "Check" — small checkmark next to the
// "*৬ সংখ্যার পাসওয়ার্ড" helper text on "7. Registration - Set Pasword"
// (node 54:1870).
export const CHECK_SMALL_SVG_XML = `<svg preserveAspectRatio="none" overflow="visible" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Check" clip-path="url(#clip0_0_27)">
<path id="Vector_2" d="M2.1875 7.875L5.25 10.9375L12.25 3.9375" stroke="#626262" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_0_27">
<rect width="14" height="14" fill="white"/>
</clipPath>
</defs>
</svg>`;

// Source: Figma node 54:2255 "Check" — the same helper-text checkmark,
// but turns green (#16A34A) and grows slightly (16px) once the password
// field reaches its full 6 digits, per "7. Registration - Set Pasword -
// Wrong Pasword" (node 54:2196).
export const CHECK_SMALL_SUCCESS_SVG_XML = `<svg preserveAspectRatio="none" overflow="visible" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Check" clip-path="url(#clip0_0_21)">
<path id="Vector_2" d="M2.5 9L6 12.5L14 4.5" stroke="#16A34A" stroke-width="1.14286" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_0_21">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`;

// Source: Figma node 54:2188 "Check" — the same 14px checkmark as
// CHECK_SMALL_SVG_XML but green, next to "সঠিক" (correct) once
// confirm-password matches password, per "7. Registration - Set
// Pasword - Typing - Filled" (node 54:2095). A separate asset from
// CHECK_SMALL_SUCCESS_SVG_XML above since that one is 16px (used on the
// password field) while this one stays 14px (used on confirm-password).
export const CHECK_SMALL_SUCCESS_14_SVG_XML = `<svg preserveAspectRatio="none" overflow="visible" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Check" clip-path="url(#clip0_0_12)">
<path id="Vector_2" d="M2.1875 7.875L5.25 10.9375L12.25 3.9375" stroke="#16A34A" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_0_12">
<rect width="14" height="14" fill="white"/>
</clipPath>
</defs>
</svg>`;

// Default profile avatar shown top-right of the Home hero header (Figma
// node 54:76/54:77) — a soft white-to-gray radial-gradient circle behind a
// flat blue person glyph. Combined into one SvgXml (the design ships them
// as two stacked layers) since neither needs independent control.
export const HOME_AVATAR_DEFAULT_SVG_XML = `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="28" cy="28" r="28" fill="url(#homeAvatarGradient)"/>
<g transform="translate(12.96 10.83)">
<path d="M6.56 8.478C6.56 3.803 10.364 0 15.039 0C19.714 0 23.517 3.803 23.517 8.478C23.517 13.152 19.714 16.955 15.039 16.955C10.364 16.955 6.56 13.152 6.56 8.478ZM21.782 20.573H8.291C3.719 20.573 0 24.293 0 28.865V33.27C0 33.863 0.481 34.344 1.073 34.344H29.006C29.598 34.344 30.079 33.863 30.079 33.27V28.87C30.079 24.296 26.357 20.573 21.782 20.573Z" fill="#303EBF"/>
</g>
<defs>
<radialGradient id="homeAvatarGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-18.39 18.386 -18.39 -18.386 28.25 29.685)">
<stop stop-color="white"/>
<stop offset="1" stop-color="#C6C6C6"/>
</radialGradient>
</defs>
</svg>`;

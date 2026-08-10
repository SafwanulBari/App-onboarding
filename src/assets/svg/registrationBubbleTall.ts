// Source: Figma node 54:2476 "Union" (speech-bubble shape behind the mascot
// card on "5. Registration - Batch", node 54:2452) — same pure vector white
// bubble with a drop shadow and a tail pointing left toward the mascot as
// registrationBubble.ts, just taller to fit that screen's two-line bold
// title ("তোমার এইচএসসি পরীক্ষার ব্যাচ সিলেক্ট করো"). Fetched as its own
// asset rather than stretching the shorter bubble over a taller box, since
// this SVG's preserveAspectRatio="none" would distort its rounded corners
// and tail shape at a ~20% height increase.
export const REGISTRATION_BUBBLE_TALL_WIDTH = 315.508;
export const REGISTRATION_BUBBLE_TALL_HEIGHT = 138;

export const REGISTRATION_BUBBLE_TALL_SVG_XML = `<svg preserveAspectRatio="none" overflow="visible" width="315.508" height="138" viewBox="0 0 315.508 138" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Union" filter="url(#filter0_d_0_4)">
<path d="M297.508 1C306.344 1.00022 313.508 8.16358 313.508 17V119C313.508 127.836 306.344 135 297.508 135H29.5078C20.6713 135 13.5078 127.837 13.5078 119V36.876C13.5078 36.0524 13.1693 35.2651 12.5715 34.6985L2.93761 25.5678C1.28682 24.0032 1.90948 21.2424 4.07203 20.5379L13.0668 17.6076C13.3298 17.5219 13.5078 17.2766 13.5078 17C13.5078 8.16345 20.6713 1 29.5078 1H297.508Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_0_4" x="1.59294e-08" y="0" width="315.508" height="138" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_4"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_4" result="shape"/>
</filter>
</defs>
</svg>`;

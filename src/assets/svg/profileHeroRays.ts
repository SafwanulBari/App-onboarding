// The subtle sunburst/light-ray texture behind the Profile page's hero
// header (Figma node 78:3360 "Union 2") — a radial burst at ~8% opacity,
// same decorative-overlay technique as the Confirmation page's burst (see
// confirmationBurst.ts). Figma's own SVG export pre-clips this to exactly
// the 412x306 window visible within the hero (the ray pattern's true
// canvas is much larger and mostly sits above/around the hero, per the
// design's own -94.1% top offset), so this can be dropped in at the
// hero's top-left with no further positioning math. Background <rect>s
// leaked from the export (an ancestor-tree artifact, not part of this
// node's real fill — see the project's recurring notes on this) are
// stripped; the two radial-gradient stops intentionally have no
// stop-color, which is valid SVG and defaults to black at low opacity.
export const PROFILE_HERO_RAYS_SVG_XML = `<svg width="412" height="306" viewBox="0 0 412 306" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.08" d="M171.354 306L205.95 -45.7924L205.792 -45.4626L118.106 296.285L53.0007 272.598L205.534 -46.1465L205.511 -46.1576L10.5952 248.955L-43.2473 205.369L205.121 -46.2769H205.094L-79.0028 164.747L-114.686 105.381L203.31 -45.7924L-133.78 54.7511L-147 -13.235L202.779 -46.4968L-147 -79.7659L-133.78 -147.751L203.31 -47.2039L-114.686 -198.381L-79.0019 -257.747L205.096 -46.7241H205.123L-43.2473 -298.37L10.5952 -341.956L205.511 -46.8434L205.534 -46.8546L53.0007 -365.598L118.106 -389.285L205.793 -47.5309L205.95 -47.2039L171.354 -399H240.636L206.487 -48.6592L293.884 -389.289L358.99 -365.598L206.583 -47.1182L206.704 -46.9952L206.918 -46.8937L207.022 -46.9039L206.945 -46.8816L207.024 -46.8434L401.94 -341.956L455.783 -298.37L207.412 -46.7241H207.438L491.534 -257.747L527.218 -198.381L209.222 -47.203L546.316 -147.751L559.536 -79.765L209.757 -46.5033L559.536 -13.2416L546.316 54.7446L209.222 -45.7924L527.219 105.385L491.534 164.747L207.435 -46.2834H207.409L455.782 205.37L401.939 248.956L207.024 -46.1576L206.945 -46.1194L207.022 -46.097L206.918 -46.1073L206.704 -46.0058L206.583 -45.8828L358.99 272.598L293.885 296.285L206.487 -44.3445L240.637 305.996L171.354 306ZM206.501 -46.0514L206.559 -46.1446L206.453 -46.1548L206.501 -46.0514ZM206.359 -46.3486L206.78 -46.4744L206.797 -46.5005L206.78 -46.5266L206.359 -46.6523L206.286 -46.5005L206.359 -46.3486ZM206.452 -46.8499L206.558 -46.8601L206.5 -46.9533L206.452 -46.8499Z" fill="url(#profileHeroRaysGradient)"/>
<defs>
<radialGradient id="profileHeroRaysGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(206.268 -46.5) rotate(90) scale(352.5 353.268)">
<stop stop-opacity="0.4"/>
<stop offset="1" stop-opacity="0.1"/>
</radialGradient>
</defs>
</svg>`;

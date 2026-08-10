import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';

// How long the whole effect lives before it's fully gone from screen.
export const CONFETTI_TOTAL_MS = 3200;

const PIECE_COUNT = 44;
// Pieces start staggered across this slice of the total time so the burst
// reads as a continuous eruption rather than every piece popping at once.
const MAX_START_DELAY_MS = 380;

// Sampled from the design's own confetti artwork (Figma node 54:1372) — each
// ribbon there is a light->dark gradient in one of five hues. Rendering ~44
// real gradients would mean ~44 extra native views for something this
// short-lived, so each piece takes one flat shade from its family instead
// and gets its depth from the rotateY "twist" below, which reads far
// stronger at this size than a gradient would.
const CONFETTI_COLORS = [
  '#00E5F7', '#0093E7', '#0066DE',
  '#FFF6A9', '#FFD617', '#FF9B04',
  '#6FE55E', '#2AD02A', '#0F9A0F',
  '#FF7A7A', '#F65353', '#EB2727',
  '#E873EB', '#C849C8', '#A81EA8',
];

type Piece = {
  key: number;
  progress: Animated.Value;
  originX: number;
  originY: number;
  burstDX: number;
  burstDY: number;
  fallDX: number;
  fallDY: number;
  size: number;
  height: number;
  color: string;
  round: boolean;
  delay: number;
  duration: number;
  spin: number;
  twist: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function buildPieces(width: number, height: number): Piece[] {
  // Where the "cannon" fires from — roughly the mascot/headline area near
  // the top of the page, matching "confetti blasts at the top, then falls".
  const originYBase = height * 0.16;

  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const round = Math.random() < 0.22;
    const size = round ? rand(5, 8) : rand(6, 10);
    // Burst direction: a wide upward/outward fan (200°-340°, screen space
    // where 0°=right, 90°=down) so pieces fly up and out to both sides
    // before gravity takes over, rather than just dropping straight down.
    const angleRad = rand(200, 340) * (Math.PI / 180);
    const burstDistance = rand(50, 170);

    return {
      key: i,
      progress: new Animated.Value(0),
      originX: width / 2 + rand(-30, 30),
      originY: originYBase + rand(-20, 20),
      burstDX: Math.cos(angleRad) * burstDistance,
      burstDY: Math.sin(angleRad) * burstDistance,
      // Gentle continued drift once gravity takes over, on top of the fall.
      fallDX: rand(-50, 50),
      fallDY: height * rand(0.85, 1.2),
      size,
      height: round ? size : size * rand(1.6, 2.6),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      round,
      delay: Math.random() * MAX_START_DELAY_MS,
      // Noticeably slower than a quick pop — a premium, floaty fall rather
      // than pieces snapping across the screen.
      duration: rand(2200, 2800),
      // A gentler spin than before — full rotations read as busy/fast at
      // this size, a fraction of one reads as smooth tumbling instead.
      spin: rand(-320, 320),
      twist: rand(360, 640),
    };
  });
}

type Props = {
  /** Called once the effect has fully finished and can be unmounted. */
  onDone?: () => void;
};

// A one-shot celebratory confetti burst, played when the Confirmation Page
// mounts at the end of registration. The design (Figma node 54:1043) shows
// confetti as a single static frozen frame — 119 gradient paths — which is a
// look reference, not something that can be animated, so this reproduces the
// same palette and ribbon character as real falling pieces instead.
//
// Motion has two phases carried by one Animated.Value per piece (rather than
// two chained animations, which would need combining two separately-driven
// values for the same translateX/Y): an early, unevenly-spaced keyframe
// segment (progress 0 -> 0.2) covers the "cannon" burst outward from a point
// near the mascot, and the much longer remaining segment (0.2 -> 1) is the
// gravity fall past the bottom of the screen. Interpolating between keyframes
// is linear per-segment, so the burst — a large position change packed into
// a small slice of progress — naturally reads as fast, and the fall — a
// larger position change spread over most of progress — naturally reads as
// slow, without needing per-phase easing curves.
//
// Everything animated here (transform + opacity) is native-driver safe, so
// the whole burst runs off the JS thread on device.
export default function ConfettiOverlay({ onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const pieces = useMemo(() => buildPieces(width, height), [width, height]);

  useEffect(() => {
    const animations = pieces.map((piece) =>
      Animated.timing(piece.progress, {
        toValue: 1,
        delay: piece.delay,
        duration: piece.duration,
        // A single soft deceleration over the whole motion — matches both
        // the burst settling and the fall easing off before it fades out.
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );
    animations.forEach((a) => a.start());

    const doneTimer = setTimeout(() => onDone?.(), CONFETTI_TOTAL_MS);
    return () => {
      clearTimeout(doneTimer);
      animations.forEach((a) => a.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieces]);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">
      {pieces.map((piece) => {
        const translateX = piece.progress.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0, piece.burstDX, piece.burstDX + piece.fallDX],
        });
        const translateY = piece.progress.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [0, piece.burstDY, piece.burstDY + piece.fallDY],
        });
        const rotate = piece.progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${piece.spin}deg`],
        });
        const rotateY = piece.progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${piece.twist}deg`],
        });
        // Quick fade in as the burst fires, hold through the fall, then
        // clear out gently over the last stretch so nothing pops out of
        // existence mid-screen.
        const opacity = piece.progress.interpolate({
          inputRange: [0, 0.05, 0.82, 1],
          outputRange: [0, 1, 1, 0],
        });

        return (
          <Animated.View
            key={piece.key}
            style={{
              position: 'absolute',
              left: piece.originX,
              top: piece.originY,
              width: piece.size,
              height: piece.height,
              borderRadius: piece.round ? piece.size / 2 : 1.5,
              backgroundColor: piece.color,
              opacity,
              transform: [{ translateX }, { translateY }, { rotate }, { rotateY }],
            }}
          />
        );
      })}
    </View>
  );
}

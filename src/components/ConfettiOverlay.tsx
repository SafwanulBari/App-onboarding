import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';

// How long the whole effect lives before it's fully gone from screen.
export const CONFETTI_TOTAL_MS = 1500;

const PIECE_COUNT = 44;
// Pieces start staggered across this slice of the total time so they read as
// a burst spilling over the top edge rather than one uniform falling line.
const MAX_START_DELAY_MS = 260;

// Sampled from the design's own confetti artwork (Figma node 54:1372) — each
// ribbon there is a light->dark gradient in one of five hues. Rendering ~44
// real gradients would mean ~44 extra native views for something on screen
// for 1.5s, so each piece takes one flat shade from its family instead and
// gets its depth from the rotateY "twist" below, which reads far stronger at
// this size than a gradient would.
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
  startX: number;
  driftX: number;
  swayX: number;
  size: number;
  height: number;
  color: string;
  round: boolean;
  delay: number;
  duration: number;
  spin: number;
  twist: number;
  fallTo: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function buildPieces(width: number, height: number): Piece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const round = Math.random() < 0.22;
    const size = round ? rand(5, 8) : rand(6, 10);
    return {
      key: i,
      progress: new Animated.Value(0),
      startX: rand(-0.04, 1.04) * width,
      // Sideways travel over the fall, plus a shallower mid-flight sway so
      // pieces arc instead of tracking straight lines.
      driftX: rand(-70, 70),
      swayX: rand(-26, 26),
      size,
      height: round ? size : size * rand(1.6, 2.6),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      round,
      delay: Math.random() * MAX_START_DELAY_MS,
      duration: rand(1050, 1400),
      spin: rand(-900, 900),
      // The flat rect flipping edge-on and back is what sells "foil ribbon".
      twist: rand(540, 1260),
      fallTo: height + rand(40, 140),
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
        // Gentle acceleration — gravity-like, but damped so it reads as
        // fluttering paper rather than dropped stones.
        easing: Easing.bezier(0.32, 0, 0.5, 1),
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
        const translateY = piece.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-piece.height - 20, piece.fallTo],
        });
        const translateX = piece.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, piece.swayX, piece.driftX],
        });
        const rotate = piece.progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${piece.spin}deg`],
        });
        const rotateY = piece.progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${piece.twist}deg`],
        });
        // Hold full opacity through the fall, then clear out over the last
        // stretch so nothing pops out of existence mid-screen.
        const opacity = piece.progress.interpolate({
          inputRange: [0, 0.06, 0.72, 1],
          outputRange: [0, 1, 1, 0],
        });

        return (
          <Animated.View
            key={piece.key}
            style={{
              position: 'absolute',
              left: piece.startX,
              top: 0,
              width: piece.size,
              height: piece.height,
              borderRadius: piece.round ? piece.size / 2 : 1.5,
              backgroundColor: piece.color,
              opacity,
              transform: [{ translateY }, { translateX }, { rotate }, { rotateY }],
            }}
          />
        );
      })}
    </View>
  );
}

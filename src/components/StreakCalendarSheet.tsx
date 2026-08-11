import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { CARET_DOWN_SVG_XML, CARET_LEFT_SVG_XML, CARET_RIGHT_SVG_XML } from '../assets/svg/profileCarets';
import { PROFILE_FLAME_SVG_XML } from '../assets/svg/profileFlame';
import { colors, fonts, useScale } from '../theme/theme';
import { toBengaliNumerals } from '../utils/bengaliNumerals';

const WEEK_DAYS = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ.', 'শক্র.'];
const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

// Days highlighted with the streak pill (Figma node 78:3783 shows this
// exact pattern — 2-7, 9-14, 16-17 lit). There's no backend to source a
// real streak history from, so this is illustrative demo content applied
// to whichever month is on screen, same as the small streak card's own
// static "4 of 7 days" sample on the profile page itself.
const DEMO_HIGHLIGHTED_DAYS = new Set([2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17]);

type DayCell = { day: number | null };

// Real weekday-aligned month grid — Figma's own mock grid places day 1 in
// an arbitrary column that doesn't correspond to any real April, so
// rather than copy that (which would misalign the moment someone taps
// prev/next into a month where it's simply wrong), this computes the
// actual calendar for whatever month/year is showing. The week starts
// Saturday (Bangladesh convention, matching WEEK_DAYS above), so JS's
// Sunday-first getDay() is remapped: (getDay() + 1) % 7.
function buildMonthGrid(year: number, month: number): DayCell[][] {
  const startCol = (new Date(year, month, 1).getDay() + 1) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: DayCell[] = [];
  for (let i = 0; i < startCol; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });

  const rows: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

// Contiguous runs of highlighted days within one week-row — the design
// draws one gradient pill per run (a 2-day run gets a short capsule, a
// full lit week gets one pill spanning all 7 columns) rather than one
// pill per day.
function findHighlightRuns(row: DayCell[]): Array<{ startCol: number; endCol: number }> {
  const runs: Array<{ startCol: number; endCol: number }> = [];
  let runStart: number | null = null;
  row.forEach((cell, col) => {
    const isActive = cell.day !== null && DEMO_HIGHLIGHTED_DAYS.has(cell.day);
    if (isActive && runStart === null) {
      runStart = col;
    } else if (!isActive && runStart !== null) {
      runs.push({ startCol: runStart, endCol: col - 1 });
      runStart = null;
    }
  });
  if (runStart !== null) runs.push({ startCol: runStart, endCol: row.length - 1 });
  return runs;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  // "১৬ দিন" in the header — a separate figure from the small streak
  // card's own count (see ProfileScreen), matching the design's own two
  // independent numbers.
  monthStreakDays?: number;
};

// "Streak calendar" bottom sheet (Figma node 78:3569, the modal states of
// the Profile page) — opens when the streak card is tapped. Built with
// RN's own Modal + PanResponder (no bottom-sheet/gesture library in this
// project yet) rather than pulling in a new dependency for one sheet.
export default function StreakCalendarSheet({ visible, onClose, monthStreakDays = 16 }: Props) {
  const scale = useScale();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.setValue(windowHeight);
      backdropOpacity.setValue(0);
      // Reset to the current month each time the sheet is (re)opened.
      setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();
      });
    } else if (isMounted) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: windowHeight, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setIsMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120 || gesture.vy > 0.6) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
    })
  ).current;

  if (!isMounted) return null;

  const grid = buildMonthGrid(cursor.getFullYear(), cursor.getMonth());
  const isCurrentRealMonth = cursor.getFullYear() === today.getFullYear() && cursor.getMonth() === today.getMonth();
  const cellWidth = 372 / 7;

  const goToPrevMonth = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const goToNextMonth = () => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* Explicit width/height (not just flex: 1) — belt-and-braces for
          react-native-web's Modal, which doesn't always give its child a
          resolved size purely from flex, leaving the backdrop
          zero-effective-size for hit-testing even though native RN's
          Modal (a real full-screen window) never has this problem. */}
      <View style={{ width: windowWidth, height: windowHeight }}>
        <Pressable
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          onPress={onClose}
        >
          <Animated.View
            style={{ width: windowWidth, height: windowHeight, backgroundColor: 'rgba(0,0,0,0.5)', opacity: backdropOpacity }}
          />
        </Pressable>

        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: '85%',
            backgroundColor: colors.white,
            borderTopLeftRadius: scale(24),
            borderTopRightRadius: scale(24),
            paddingBottom: insets.bottom + scale(12),
            transform: [{ translateY }],
          }}
        >
          {/* Drag zone: handle bar + the streak header row. Scoped to just
              this area (not the whole sheet) so the month-selector and
              calendar cells below stay tappable without fighting the pan
              responder. */}
          <View {...panResponder.panHandlers}>
            <View style={{ alignItems: 'center', paddingTop: scale(10) }}>
              <View style={{ width: scale(36), height: scale(4), borderRadius: scale(2), backgroundColor: colors.gray300 }} />
            </View>

            <View
              style={{
                marginTop: scale(20),
                paddingHorizontal: scale(20),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(8) }}>
                <SvgXml xml={PROFILE_FLAME_SVG_XML} width={scale(28.67)} height={scale(34)} />
                <Text style={{ fontFamily: fonts.medium, fontSize: scale(18), color: colors.gray700 }}>তোমার স্ট্রিক</Text>
              </View>
              <Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: scale(40), lineHeight: scale(40) * 1.5, color: colors.secondary500 }}>
                  {toBengaliNumerals(monthStreakDays)}
                </Text>
                <Text style={{ fontFamily: fonts.medium, fontSize: scale(14), color: colors.secondary500 }}> দিন</Text>
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: scale(20),
              marginHorizontal: scale(20),
              backgroundColor: colors.gray200,
              padding: scale(2),
              borderRadius: scale(111),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                backgroundColor: colors.white,
                borderRadius: scale(111),
                paddingHorizontal: scale(12),
                paddingVertical: scale(6),
                flexDirection: 'row',
                alignItems: 'center',
                gap: scale(8),
              }}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: scale(16), color: colors.gray900 }}>
                {BENGALI_MONTHS[cursor.getMonth()]}, {toBengaliNumerals(cursor.getFullYear())}
              </Text>
              <SvgXml xml={CARET_DOWN_SVG_XML} width={scale(18)} height={scale(18)} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(12) }}>
              <Pressable
                onPress={goToPrevMonth}
                hitSlop={6}
                style={{
                  width: scale(30),
                  height: scale(30),
                  borderRadius: scale(111),
                  backgroundColor: colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SvgXml xml={CARET_LEFT_SVG_XML} width={scale(18)} height={scale(18)} />
              </Pressable>
              <Pressable
                onPress={goToNextMonth}
                hitSlop={6}
                style={{
                  width: scale(30),
                  height: scale(30),
                  borderRadius: scale(111),
                  backgroundColor: colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SvgXml xml={CARET_RIGHT_SVG_XML} width={scale(18)} height={scale(18)} />
              </Pressable>
            </View>
          </View>

          <ScrollView style={{ marginTop: scale(20) }} contentContainerStyle={{ paddingHorizontal: scale(20), paddingBottom: scale(20) }}>
            <View style={{ flexDirection: 'row' }}>
              {WEEK_DAYS.map((day) => (
                <Text
                  key={day}
                  style={{
                    width: scale(cellWidth),
                    textAlign: 'center',
                    fontFamily: fonts.medium,
                    fontSize: scale(14),
                    lineHeight: scale(14) * 1.6,
                    color: colors.gray600,
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>

            {grid.map((row, rowIndex) => {
              const runs = findHighlightRuns(row);
              return (
                <View key={rowIndex} style={{ marginTop: scale(8), height: scale(30), position: 'relative' }}>
                  {runs.map((run, runIndex) => (
                    <LinearGradient
                      key={runIndex}
                      colors={['#FDA22F', '#E52565']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={{
                        position: 'absolute',
                        left: scale(run.startCol * cellWidth),
                        width: scale((run.endCol - run.startCol + 1) * cellWidth),
                        height: scale(30),
                        borderRadius: scale(111),
                      }}
                    />
                  ))}
                  <View style={{ flexDirection: 'row' }}>
                    {row.map((cell, col) => {
                      if (cell.day === null) {
                        return <View key={col} style={{ width: scale(cellWidth), height: scale(30) }} />;
                      }
                      const isToday = isCurrentRealMonth && cell.day === today.getDate();
                      const isActive = DEMO_HIGHLIGHTED_DAYS.has(cell.day);
                      const isFridayCol = col === 6;

                      if (isToday) {
                        return (
                          <View key={col} style={{ width: scale(cellWidth), height: scale(30), alignItems: 'center', justifyContent: 'center' }}>
                            <View
                              style={{
                                width: scale(28),
                                height: scale(28),
                                borderRadius: scale(14),
                                backgroundColor: colors.white,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <SvgXml xml={PROFILE_FLAME_SVG_XML} width={scale(15.7)} height={scale(18.67)} />
                            </View>
                          </View>
                        );
                      }

                      return (
                        <Text
                          key={col}
                          style={{
                            width: scale(cellWidth),
                            height: scale(30),
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontFamily: fonts.medium,
                            fontSize: scale(18),
                            lineHeight: scale(30),
                            color: isActive ? colors.white : isFridayCol ? colors.gray600 : colors.secondaryNeutral950,
                          }}
                        >
                          {toBengaliNumerals(cell.day)}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

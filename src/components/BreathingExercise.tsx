import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useI18n } from '../i18n/I18nContext';

interface BreathingExerciseProps {
  visible: boolean;
  onClose: () => void;
}

const CYCLES = 5;
const INHALE = 4;
const HOLD = 2;
const EXHALE = 4;

export function BreathingExercise({ visible, onClose }: BreathingExerciseProps) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(INHALE);
  const [cycle, setCycle] = useState(1);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    if (!visible) return;

    const phaseLabels = { inhale: INHALE, hold: HOLD, exhale: EXHALE };
    let currentPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let currentCount = INHALE;
    let currentCycle = 1;

    setPhase('inhale');
    setCountdown(INHALE);
    setCycle(1);
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: INHALE * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: HOLD * 1000 }),
        withTiming(0.6, { duration: EXHALE * 1000, easing: Easing.inOut(Easing.ease) })
      ),
      CYCLES,
      false
    );

    const timer = setInterval(() => {
      currentCount--;
      if (currentCount <= 0) {
        if (currentPhase === 'inhale') {
          currentPhase = 'hold';
          currentCount = HOLD;
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          currentCount = EXHALE;
        } else {
          currentPhase = 'inhale';
          currentCount = INHALE;
          currentCycle++;
          if (currentCycle > CYCLES) {
            clearInterval(timer);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onClose();
            return;
          }
        }
        setPhase(currentPhase);
        setCycle(currentCycle);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCountdown(currentCount);
    }, 1000);

    return () => clearInterval(timer);
  }, [visible]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const phaseText = phase === 'inhale' ? t.inhale : phase === 'hold' ? t.hold : t.exhale;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <LinearGradient colors={['#050A14EE', '#0A1A30EE']} style={styles.overlay}>
        <Text style={[typography.title, styles.title]}>{t.breathingTitle}</Text>
        <Text style={[typography.caption, styles.subtitle]}>
          {t.cycle} {cycle} {t.of} {CYCLES}
        </Text>

        <Animated.View style={[styles.circleOuter, circleStyle]}>
          <LinearGradient
            colors={[colors.gradientStart + '60', colors.gradientEnd + '40']}
            style={styles.circle}
          >
            <Text style={[typography.hero, styles.count]}>{countdown}</Text>
            <Text style={[typography.subheading, styles.phase]}>{phaseText}</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={[typography.body, styles.hint]}>{t.breathingHint}</Text>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={[typography.subheading, { color: colors.textSecondary }]}>{t.skip}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { color: colors.text, marginBottom: 8 },
  subtitle: { color: colors.textSecondary, marginBottom: 48 },
  circleOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginBottom: 48,
  },
  circle: {
    flex: 1,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '50',
  },
  count: { color: colors.text, fontSize: 64 },
  phase: { color: colors.primary, marginTop: 4 },
  hint: { color: colors.textMuted, textAlign: 'center', marginBottom: 32 },
  closeBtn: { padding: 16 },
});

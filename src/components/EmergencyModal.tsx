import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';

export function EmergencyModal() {
  const { showEmergency, dismissEmergency, simulation, profile } = useApp();
  const { t, language } = useI18n();
  const [countdown, setCountdown] = useState(30);
  const shake = useSharedValue(0);

  useEffect(() => {
    if (!showEmergency) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shake.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 50 }),
        withTiming(5, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      -1,
      true
    );
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 1000);
    return () => {
      clearInterval(timer);
      setCountdown(30);
    };
  }, [showEmergency]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  if (!showEmergency) return null;

  const reason = simulation.risks.microsleep > 70
    ? t.microsleepRisk
    : simulation.neuroScore < 30
    ? t.criticalPulseScore
    : t.criticalPhysiological;

  return (
    <Modal visible animationType="fade">
      <LinearGradient colors={['#1A0000', '#3B0000', '#1A0000']} style={styles.container}>
        <Animated.View style={[styles.content, shakeStyle]}>
          <Ionicons name="warning" size={64} color={colors.danger} />
          <Text style={[typography.title, styles.title]}>{t.criticalState}</Text>
          <Text style={[typography.body, styles.reason]}>{reason}</Text>

          <View style={styles.metricBox}>
            <Text style={[typography.caption, styles.metricLabel]}>{t.currentHeartRate}</Text>
            <Text style={[typography.hero, { color: colors.danger }]}>
              {simulation.vitals.heartRate}
            </Text>
            <Text style={styles.bpm}>{t.bpm}</Text>
          </View>

          <View style={styles.countdownBox}>
            <Text style={[typography.caption, styles.metricLabel]}>{t.autoNotify}</Text>
            <Text style={[typography.title, { color: colors.danger }]}>{countdown}{language === 'ru' ? 'с' : 's'}</Text>
          </View>

          <TouchableOpacity
            style={styles.emergencyBtn}
            onPress={() => Linking.openURL(`tel:${profile.emergencyContact.phone.replace(/[^\d+]/g, '')}`)}
          >
            <Ionicons name="call" size={24} color="#fff" />
            <Text style={styles.btnText}>{t.callContact}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.emergencyBtn, styles.sosBtn]}
            onPress={() => Linking.openURL('tel:112')}
          >
            <Ionicons name="medical" size={24} color="#fff" />
            <Text style={styles.btnText}>{t.call112}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dismissBtn} onPress={dismissEmergency}>
            <Text style={[typography.body, { color: colors.textMuted }]}>
              {t.imOk}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { color: colors.danger, textAlign: 'center', marginTop: 24, marginBottom: 12 },
  reason: { color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  metricBox: { alignItems: 'center', marginBottom: 24 },
  metricLabel: { color: colors.textMuted, marginBottom: 4 },
  bpm: { color: colors.textSecondary, fontSize: 14 },
  countdownBox: { alignItems: 'center', marginBottom: 40 },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.danger,
    width: '100%',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  sosBtn: { backgroundColor: '#991B1B' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  dismissBtn: { marginTop: 24, padding: 12 },
});

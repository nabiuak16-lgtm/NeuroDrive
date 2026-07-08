import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { MetricCard } from '../components/MetricCard';
import { NeuroScoreRing } from '../components/NeuroScoreRing';
import { RiskBar } from '../components/RiskBar';
import { AlertBanner } from '../components/AlertBanner';
import { formatDuration } from '../utils/helpers';

export function DriveScreen() {
  const {
    simulation,
    driveSession,
    startDrive,
    stopDrive,
    liveObservations,
    assistantTip,
    openBreathing,
  } = useApp();
  const { t, language } = useI18n();

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startDrive();
  };

  const handleStop = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    stopDrive();
  };

  if (!driveSession.active) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0A1A30', colors.background]} style={styles.idleHeader}>
          <Animated.Text entering={FadeIn.duration(600)} style={[typography.title, styles.idleTitle]}>
            {t.driveMode}
          </Animated.Text>
          <Animated.Text entering={FadeIn.delay(200).duration(600)} style={[typography.body, styles.idleSubtitle]}>
            {t.driveModeSubtitle}
          </Animated.Text>
        </LinearGradient>

        <View style={styles.idleContent}>
          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.previewRing}>
            <NeuroScoreRing score={simulation.neuroScore} size={180} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <AlertBanner level={simulation.alertLevel} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.startBtnWrap}>
            <TouchableOpacity onPress={handleStart} activeOpacity={0.85}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.startBtn}
              >
                <Ionicons name="car-sport" size={28} color="#fff" />
                <Text style={styles.startBtnText}>{t.startDrive}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0A2030', colors.background]} style={styles.driveHeader}>
        <View style={styles.driveHeaderRow}>
          <View>
            <Text style={[typography.caption, { color: colors.safe }]}>{t.activeDrive}</Text>
            <Text style={[typography.heading, { color: colors.text, marginTop: 4 }]}>
              {formatDuration(driveSession.duration)}
            </Text>
          </View>
          <TouchableOpacity onPress={handleStop} style={styles.stopBtn}>
            <Ionicons name="stop-circle" size={20} color={colors.danger} />
            <Text style={[typography.caption, { color: colors.danger }]}>{t.stop}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.driveContent}>
        <View style={styles.driveScore}>
          <NeuroScoreRing score={simulation.neuroScore} size={160} />
        </View>

        <AlertBanner level={simulation.alertLevel} />

        <View style={styles.metricsRow}>
          <MetricCard compact icon="heart" label={t.heartRate} value={simulation.vitals.heartRate} color={colors.danger} />
          <MetricCard compact icon="pulse" label={t.hrv} value={simulation.vitals.hrv} color={colors.cyan} />
          <MetricCard compact icon="flash" label={t.stress} value={simulation.vitals.stress} color={colors.warning} />
          <MetricCard compact icon="moon" label={t.fatigue} value={simulation.vitals.fatigue} color={colors.orange} />
        </View>

        <View style={styles.metricsRow}>
          <MetricCard compact icon="eye" label={t.focus} value={simulation.vitals.focus} color={colors.safe} />
          <MetricCard compact icon="timer" label={t.reaction} value={`${simulation.vitals.reactionTime}${language === 'ru' ? 'с' : 's'}`} color={colors.primary} />
        </View>

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.aiRiskPrediction}</Text>
        <GlassCard>
          <RiskBar label={t.riskFatigue} value={simulation.risks.fatigue} />
          <RiskBar label={t.riskStress} value={simulation.risks.stress} />
          <RiskBar label={t.riskMicrosleep} value={simulation.risks.microsleep} />
          <RiskBar label={t.riskFocusLoss} value={simulation.risks.focusLoss} />
          <RiskBar label={t.riskDehydration} value={simulation.risks.dehydration} />
          <RiskBar label={t.riskAbnormalHR} value={simulation.risks.abnormalHR} />
        </GlassCard>

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.liveAiAnalysis}</Text>
        <GlassCard accent>
          {liveObservations.map((obs, i) => (
            <Animated.View key={`${obs}-${i}`} entering={FadeIn.duration(400)} style={styles.obsRow}>
              <Ionicons name="radio-button-on" size={8} color={colors.primary} />
              <Text style={[typography.body, styles.obsText]}>{obs}</Text>
            </Animated.View>
          ))}
        </GlassCard>

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.driveAssistant}</Text>
        <GlassCard accent>
          <View style={styles.assistantRow}>
            <Ionicons name="bulb" size={22} color={colors.warning} />
            <Text style={[typography.body, { color: colors.text, flex: 1 }]}>{assistantTip}</Text>
          </View>
          {simulation.vitals.stress > 50 && (
            <TouchableOpacity onPress={openBreathing} style={styles.breathBtn}>
              <LinearGradient colors={[colors.gradientStart + '40', colors.gradientEnd + '20']} style={styles.breathBtnInner}>
                <Ionicons name="fitness" size={20} color={colors.primary} />
                <Text style={[typography.subheading, { color: colors.primary }]}>{t.breathingExercise}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </GlassCard>

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  idleHeader: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  idleTitle: { color: colors.text },
  idleSubtitle: { color: colors.textSecondary, marginTop: 8 },
  idleContent: { flex: 1, paddingHorizontal: 20, gap: 24, alignItems: 'center' },
  previewRing: { marginTop: 20 },
  startBtnWrap: { width: '100%', marginTop: 20 },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 22,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  driveHeader: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  driveHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stopBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, backgroundColor: colors.dangerBg, borderRadius: 12 },
  driveContent: { paddingHorizontal: 20, gap: 16 },
  driveScore: { alignItems: 'center' },
  metricsRow: { flexDirection: 'row', gap: 8 },
  sectionTitle: { color: colors.text, marginTop: 8 },
  obsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  obsText: { color: colors.textSecondary, flex: 1 },
  assistantRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  breathBtn: { marginTop: 14 },
  breathBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
});

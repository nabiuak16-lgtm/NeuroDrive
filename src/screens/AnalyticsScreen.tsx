import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors, getScoreColor } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { MiniChart } from '../components/MiniChart';
import { getAllAnalyticsInsights } from '../utils/aiMessages';

export function AnalyticsScreen() {
  const { simulation } = useApp();
  const { t, language } = useI18n();
  const insights = getAllAnalyticsInsights(language);

  const charts = useMemo(
    () => [
      { key: 'heartRate' as const, label: t.chartHeartRate, color: colors.danger, unit: t.bpm },
      { key: 'hrv' as const, label: t.chartHrv, color: colors.cyan, unit: t.ms },
      { key: 'stress' as const, label: t.chartStress, color: colors.warning, unit: '%' },
      { key: 'fatigue' as const, label: t.chartFatigue, color: colors.orange, unit: '%' },
      { key: 'neuroScore' as const, label: t.chartPulseScore, color: colors.primary, unit: '' },
      { key: 'drivingDuration' as const, label: t.chartDriving, color: colors.blue, unit: t.minutes },
      { key: 'reactionTime' as const, label: t.chartReaction, color: colors.safe, unit: t.ms },
    ],
    [t]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0A1A30', colors.background]} style={styles.header}>
        <Text style={[typography.title, { color: colors.text }]}>{t.analyticsTitle}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
          {t.analyticsSubtitle}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.scoresRow}>
          <ScoreCard label={t.today} score={simulation.scores.daily} />
          <ScoreCard label={t.week} score={simulation.scores.weekly} />
          <ScoreCard label={t.month} score={simulation.scores.monthly} />
        </Animated.View>

        {charts.map((chart, index) => (
          <Animated.View key={chart.key} entering={FadeInDown.delay(100 * index).duration(500)}>
            <GlassCard style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={[typography.subheading, { color: colors.text }]}>{chart.label}</Text>
                <Text style={[typography.caption, { color: chart.color }]}>
                  {simulation.chartData[chart.key][simulation.chartData[chart.key].length - 1]}
                  {chart.unit ? ` ${chart.unit}` : ''}
                </Text>
              </View>
              <MiniChart data={simulation.chartData[chart.key]} color={chart.color} />
            </GlassCard>
          </Animated.View>
        ))}

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.aiInsights}</Text>
        {insights.map((insight, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(50 * i).duration(400)}>
            <GlassCard accent style={styles.insightCard}>
              <View style={styles.insightRow}>
                <Ionicons name="analytics" size={20} color={colors.primary} />
                <Text style={[typography.body, styles.insightText]}>{insight}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const color = getScoreColor(score);
  return (
    <View style={[styles.scoreCard, { borderColor: color + '40' }]}>
      <Text style={[typography.small, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[typography.heading, { color }]}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  content: { paddingHorizontal: 20, gap: 14 },
  scoresRow: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  scoreCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
  },
  chartCard: { marginBottom: 0 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: colors.text, marginTop: 10, marginBottom: 4 },
  insightCard: { marginBottom: 0 },
  insightRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  insightText: { color: colors.textSecondary, flex: 1, lineHeight: 22 },
});

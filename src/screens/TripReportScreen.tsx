import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors, getAlertColor } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { formatDate, formatDuration, getRiskLevelText, getWeatherEmoji } from '../utils/helpers';
import { RootStackParamList } from '../navigation/types';

export function TripReportScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'TripReport'>>();
  const { simulation } = useApp();
  const { t, language } = useI18n();
  const trip = simulation.trips.find((item) => item.id === route.params.tripId);

  if (!trip) {
    return (
      <View style={styles.empty}>
        <Text style={{ color: colors.text }}>{t.tripNotFound}</Text>
      </View>
    );
  }

  const riskColor = getAlertColor(trip.riskLevel);
  const speedUnit = language === 'ru' ? 'км/ч' : 'km/h';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0A1A30', colors.background]} style={styles.mapPlaceholder}>
        <Ionicons name="map" size={48} color={colors.primary + '60'} />
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: 8 }]}>
          {t.routeMapDemo}
        </Text>
        <View style={styles.routeLine}>
          <View style={styles.routeDot} />
          <View style={styles.routePath} />
          <View style={[styles.routeDot, { backgroundColor: colors.safe }]} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[typography.title, { color: colors.text }]}>{t.tripReport}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginBottom: 16 }]}>
          {formatDate(new Date(trip.date))} • {getWeatherEmoji(trip.weather)} {trip.weather}
        </Text>

        <View style={[styles.riskBanner, { backgroundColor: riskColor + '15', borderColor: riskColor + '40' }]}>
          <Text style={[typography.subheading, { color: riskColor }]}>
            {t.riskLevel}: {getRiskLevelText(trip.riskLevel, language)}
          </Text>
        </View>

        <GlassCard>
          <ReportRow label={t.distance} value={`${trip.distance} ${t.km}`} />
          <ReportRow label={t.duration} value={formatDuration(trip.duration)} />
          <ReportRow label={t.avgSpeed} value={`${trip.avgSpeed} ${speedUnit}`} />
          <ReportRow label={t.avgHeartRate} value={`${trip.avgHeartRate} ${t.bpm}`} />
          <ReportRow label={t.maxHeartRate} value={`${trip.maxHeartRate} ${t.bpm}`} />
          <ReportRow label={t.stress} value={`${trip.stressScore}%`} />
          <ReportRow label={t.fatigue} value={`${trip.fatigueScore}%`} />
          <ReportRow label={t.focus} value={`${trip.focusScore}%`} />
          <ReportRow label={t.pulseScore} value={`${trip.neuroScore}`} />
          <ReportRow label={t.chartReaction} value={`${trip.reactionTime}${language === 'ru' ? 'с' : 's'}`} />
          <ReportRow label={t.safetyEvents} value={`${trip.safetyEvents}`} last />
        </GlassCard>

        <GlassCard accent style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="sparkles" size={20} color={colors.primary} />
            <Text style={[typography.subheading, { color: colors.primary }]}>{t.aiSummary}</Text>
          </View>
          <Text style={[typography.body, { color: colors.textSecondary, lineHeight: 22 }]}>
            {trip.aiSummary}
          </Text>
        </GlassCard>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

function ReportRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.body, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  mapPlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 0 },
  routeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  routePath: { width: 120, height: 3, backgroundColor: colors.primary + '40', borderRadius: 2 },
  content: { padding: 20 },
  riskBanner: { padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  summaryCard: { marginTop: 16 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
});

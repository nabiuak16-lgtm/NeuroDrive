import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors, getAlertColor } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { formatDate, formatDuration, getRiskLevelText, getWeatherEmoji } from '../utils/helpers';
import { Language } from '../i18n/types';
import { translations } from '../i18n/translations';
import { RootStackParamList } from '../navigation/types';

export function HistoryScreen() {
  const { simulation } = useApp();
  const { t, language } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0A1A30', colors.background]} style={styles.header}>
        <Text style={[typography.title, { color: colors.text }]}>{t.tripHistory}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
          {simulation.trips.length} {t.trips}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {simulation.trips.map((trip, index) => (
          <Animated.View key={trip.id} entering={FadeInDown.delay(80 * index).duration(500)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('TripReport', { tripId: trip.id })}
            >
              <TripCard trip={trip} language={language} t={t} />
            </TouchableOpacity>
          </Animated.View>
        ))}
        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

function TripCard({ trip, language, t }: { trip: import('../types').Trip; language: Language; t: (typeof translations)[Language] }) {
  const riskColor = getAlertColor(trip.riskLevel);
  return (
    <GlassCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[typography.subheading, { color: colors.text }]}>
            {formatDate(new Date(trip.date))}
          </Text>
          <Text style={[typography.small, { color: colors.textMuted }]}>
            {getWeatherEmoji(trip.weather)} {trip.weather}
          </Text>
        </View>
        <View style={[styles.riskBadge, { backgroundColor: riskColor + '20' }]}>
          <Text style={[typography.small, { color: riskColor }]}>
            {getRiskLevelText(trip.riskLevel, language)}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat icon="navigate" label={t.distance} value={`${trip.distance} ${t.km}`} />
        <Stat icon="time" label={t.duration} value={formatDuration(trip.duration)} />
        <Stat icon="speedometer" label={t.pulseScore} value={`${trip.neuroScore}`} />
      </View>

      <View style={styles.statsRow}>
        <Stat icon="heart" label={t.avgHeartRate} value={`${trip.avgHeartRate}`} />
        <Stat icon="trending-up" label={t.maxHeartRate} value={`${trip.maxHeartRate}`} />
        <Stat icon="flash" label={t.stress} value={`${trip.stressScore}%`} />
      </View>

      <View style={styles.cardFooter}>
        <Text style={[typography.small, { color: colors.textMuted }]}>
          {t.fatigue} {trip.fatigueScore}% • {t.focus} {trip.focusScore}%
        </Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
    </GlassCard>
  );
}

function Stat({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={14} color={colors.primary} />
      <Text style={[typography.small, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[typography.caption, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  content: { paddingHorizontal: 20, gap: 14 },
  card: { marginBottom: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
});

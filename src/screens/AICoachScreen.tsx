import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { getAllCoachTips } from '../utils/aiMessages';

export function AICoachScreen() {
  const { simulation } = useApp();
  const { t, language } = useI18n();
  const tips = getAllCoachTips(language);
  const breakMinutes = simulation.vitals.fatigue > 40 ? '60' : '90';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <GlassCard accent style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.iconWrap}>
              <Ionicons name="school" size={28} color={colors.primary} />
            </View>
            <View style={styles.heroText}>
              <Text style={[typography.subheading, { color: colors.primary }]}>{t.aiCoach}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>{t.coachHero}</Text>
            </View>
          </View>
          <View style={styles.scoreRow}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>{t.currentPulseScore}</Text>
            <Text style={[typography.heading, { color: colors.text }]}>{simulation.neuroScore}</Text>
          </View>
        </GlassCard>

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.recommendations}</Text>
        {tips.map((tip, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(100 * i).duration(500)}>
            <GlassCard style={styles.tipCard}>
              <View style={styles.tipRow}>
                <View style={styles.tipNumber}>
                  <Text style={[typography.small, { color: colors.primary }]}>{i + 1}</Text>
                </View>
                <Text style={[typography.body, styles.tipText]}>{tip}</Text>
              </View>
            </GlassCard>
          </Animated.View>
        ))}

        <GlassCard accent style={styles.focusCard}>
          <Ionicons name="bulb" size={24} color={colors.warning} />
          <Text style={[typography.body, { color: colors.textSecondary, flex: 1, marginLeft: 12, lineHeight: 22 }]}>
            {t.coachBreakTip.replace('{minutes}', breakMinutes)}
          </Text>
        </GlassCard>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  heroCard: { marginBottom: 20 },
  heroRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1, gap: 4 },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  sectionTitle: { color: colors.text, marginBottom: 12 },
  tipCard: { marginBottom: 10 },
  tipRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: { color: colors.textSecondary, flex: 1, lineHeight: 22 },
  focusCard: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 },
});

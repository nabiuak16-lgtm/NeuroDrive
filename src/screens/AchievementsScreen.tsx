import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';

export function AchievementsScreen() {
  const { achievements } = useApp();
  const { t } = useI18n();
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.headerStats}>
          <Text style={[typography.heading, { color: colors.text }]}>
            {unlocked} / {achievements.length}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>{t.unlocked}</Text>
        </View>

        {achievements.map((achievement, i) => (
          <Animated.View key={achievement.id} entering={FadeInDown.delay(80 * i).duration(500)}>
            <GlassCard style={[styles.card, !achievement.unlocked && styles.locked]}>
              <View style={styles.achievementRow}>
                <Text style={styles.icon}>{achievement.icon}</Text>
                <View style={styles.info}>
                  <Text style={[typography.body, { color: achievement.unlocked ? colors.text : colors.textMuted }]}>
                    {achievement.title}
                  </Text>
                  {achievement.progress !== undefined && !achievement.unlocked && (
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${achievement.progress}%` }]} />
                    </View>
                  )}
                  {achievement.unlocked && (
                    <Text style={[typography.small, { color: colors.safe }]}>{t.unlockedBadge}</Text>
                  )}
                  {achievement.progress !== undefined && !achievement.unlocked && (
                    <Text style={[typography.small, { color: colors.textMuted }]}>{achievement.progress}%</Text>
                  )}
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  headerStats: { alignItems: 'center', marginBottom: 24 },
  card: { marginBottom: 10 },
  locked: { opacity: 0.7 },
  achievementRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  icon: { fontSize: 36 },
  info: { flex: 1, gap: 6 },
  progressBar: { height: 4, backgroundColor: colors.surface, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
});

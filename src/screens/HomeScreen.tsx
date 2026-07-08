import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { LanguageToggle } from '../components/LanguageToggle';

export function HomeScreen() {
  const { t } = useI18n();

  const steps = [
    {
      number: '1',
      title: t.step1Title,
      items: t.step1Items.split('\n'),
      icon: 'hardware-chip' as const,
    },
    {
      number: '2',
      title: t.step2Title,
      items: t.step2Items.split('\n'),
      icon: 'heart' as const,
    },
    {
      number: '3',
      title: t.step3Title,
      text: t.step3Text,
      icon: 'sparkles' as const,
    },
    {
      number: '4',
      title: t.step4Title,
      text: t.step4Text,
      icon: 'notifications' as const,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0A1A30', colors.background]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Animated.Text entering={FadeInDown.duration(600)} style={[typography.title, styles.title]}>
              {t.homeWelcome}
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(100).duration(600)} style={[typography.subheading, styles.subtitle]}>
              {t.homeSubtitle}
            </Animated.Text>
          </View>
          <Animated.View entering={FadeInDown.delay(150).duration(600)}>
            <LanguageToggle />
          </Animated.View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <GlassCard accent>
            <Text style={[typography.body, styles.description]}>{t.homeDescription}</Text>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[typography.caption, styles.dividerText]}>⸻</Text>
            <View style={styles.dividerLine} />
          </View>
          <Text style={[typography.heading, styles.sectionTitle]}>{t.howItWorks}</Text>
        </Animated.View>

        {steps.map((step, index) => (
          <Animated.View key={step.number} entering={FadeInDown.delay(350 + index * 80).duration(500)}>
            <GlassCard style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={[styles.stepIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={step.icon} size={22} color={colors.primary} />
                </View>
                <Text style={[typography.subheading, styles.stepTitle]}>{step.title}</Text>
              </View>
              {step.items ? (
                <View style={styles.bulletList}>
                  {step.items.map((item) => (
                    <View key={item} style={styles.bulletRow}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={[typography.body, styles.bulletText]}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={[typography.body, styles.stepText]}>{step.text}</Text>
              )}
            </GlassCard>
          </Animated.View>
        ))}

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  headerText: { flex: 1 },
  title: { color: colors.text, lineHeight: 34 },
  subtitle: { color: colors.primary, marginTop: 10, lineHeight: 24 },
  content: { paddingHorizontal: 20, gap: 16 },
  description: { color: colors.textSecondary, lineHeight: 24 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted },
  sectionTitle: { color: colors.text, marginBottom: 4 },
  stepCard: { marginBottom: 0 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: { color: colors.text, flex: 1 },
  bulletList: { gap: 8, paddingLeft: 4 },
  bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bullet: { color: colors.primary, fontSize: 16, lineHeight: 22 },
  bulletText: { color: colors.textSecondary, flex: 1, lineHeight: 22 },
  stepText: { color: colors.textSecondary, lineHeight: 24, paddingLeft: 4 },
});

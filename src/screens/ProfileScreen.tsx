import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { RootStackParamList } from '../navigation/types';

export function ProfileScreen() {
  const { profile, achievements } = useApp();
  const { t } = useI18n();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const menuItems = [
    { icon: 'hardware-chip' as const, label: t.menuDevices, screen: 'DeviceCenter' as const },
    { icon: 'settings' as const, label: t.menuSettings, screen: 'Settings' as const },
    { icon: 'school' as const, label: t.menuCoach, screen: 'AICoach' as const },
    { icon: 'trophy' as const, label: t.menuAchievements, screen: 'Achievements' as const, badge: `${unlockedCount}/${achievements.length}` },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0A1A30', colors.background]} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.avatarGradient}>
              <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
            </LinearGradient>
          </View>
          <LanguageToggle compact />
        </View>
        <Text style={[typography.title, { color: colors.text }]}>{profile.name}</Text>
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 4 }]}>
          {profile.driverType} • {profile.experience}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <GlassCard>
            <ProfileRow label={t.age} value={`${profile.age} ${t.years}`} />
            <ProfileRow label={t.bloodType} value={profile.bloodType} />
            <ProfileRow label={t.driverType} value={profile.driverType} />
            <ProfileRow label={t.experience} value={profile.experience} />
            <ProfileRow label={t.breakInterval} value={`${profile.breakInterval} ${t.minutes}`} last />
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={[typography.subheading, styles.sectionTitle]}>{t.emergencyContact}</Text>
          <GlassCard accent>
            <View style={styles.emergencyRow}>
              <Ionicons name="call" size={22} color={colors.danger} />
              <View style={styles.emergencyInfo}>
                <Text style={[typography.body, { color: colors.text }]}>{profile.emergencyContact.name}</Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {profile.emergencyContact.phone}
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.demoRow}>
            <View style={styles.demoInfo}>
              <Ionicons name="flask" size={20} color={colors.primary} />
              <Text style={[typography.body, { color: colors.text }]}>{t.demoMode}</Text>
            </View>
            <View style={[styles.demoBadge, { backgroundColor: colors.safeBg }]}>
              <Text style={[typography.small, { color: colors.safe }]}>{t.demoActive}</Text>
            </View>
          </View>
        </Animated.View>

        {menuItems.map((item, i) => (
          <Animated.View key={item.screen} entering={FadeInDown.delay(300 + i * 80).duration(400)}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.screen)}
            >
              <GlassCard style={styles.menuCard}>
                <View style={styles.menuRow}>
                  <Ionicons name={item.icon} size={22} color={colors.primary} />
                  <Text style={[typography.body, { color: colors.text, flex: 1 }]}>{item.label}</Text>
                  {item.badge && (
                    <Text style={[typography.small, { color: colors.textMuted, marginRight: 8 }]}>
                      {item.badge}
                    </Text>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

function ProfileRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.profileRow, !last && styles.profileRowBorder]}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.body, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  avatar: {},
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 20, gap: 14 },
  sectionTitle: { color: colors.text, marginBottom: 8 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  profileRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  emergencyRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emergencyInfo: { flex: 1 },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  demoBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  menuCard: { marginBottom: 0 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});

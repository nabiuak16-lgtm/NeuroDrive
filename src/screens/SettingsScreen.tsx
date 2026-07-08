import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';
import { LanguageToggle } from '../components/LanguageToggle';

export function SettingsScreen() {
  const { settings, updateSettings } = useApp();
  const { t, language } = useI18n();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.langRow}>
          <Text style={[typography.body, { color: colors.text }]}>{t.language}</Text>
          <LanguageToggle compact />
        </View>

        <GlassCard>
          <SettingToggle
            label={t.notifications}
            value={settings.notifications}
            onChange={(v) => updateSettings({ notifications: v })}
          />
          <SettingToggle
            label={t.darkTheme}
            value={settings.darkTheme}
            onChange={(v) => updateSettings({ darkTheme: v })}
          />
          <SettingToggle
            label={t.privacy}
            value={settings.privacy}
            onChange={(v) => updateSettings({ privacy: v })}
          />
          <SettingToggle
            label={t.demoMode}
            value={settings.demoMode}
            onChange={(v) => updateSettings({ demoMode: v })}
            last
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <SettingRow label={t.language} value={language === 'ru' ? t.russian : t.english} />
          <SettingRow label={t.aiSensitivity} value={`${settings.aiSensitivity}%`} />
          <SettingRow label={t.dataExport} value={t.available} last />
        </GlassCard>

        <Text style={[typography.caption, styles.version]}>{t.version}</Text>
        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

function SettingToggle({
  label,
  value,
  onChange,
  last,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={[typography.body, { color: colors.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surface, true: colors.primary + '60' }}
        thumbColor={value ? colors.primary : colors.textMuted}
      />
    </View>
  );
}

function SettingRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={[typography.body, { color: colors.text }]}>{label}</Text>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  langRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { marginTop: 0 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  version: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
});

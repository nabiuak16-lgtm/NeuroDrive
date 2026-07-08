import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from '../components/GlassCard';

export function DeviceCenterScreen() {
  const { simulation } = useApp();
  const { t } = useI18n();
  const { smartWheel, smartWatch, phone } = simulation.devices;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={[typography.caption, styles.ecosystem]}>{t.ecosystem}</Text>

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.wheelSection}</Text>
        <GlassCard accent>
          <DeviceStatusRow label={t.status} value={smartWheel.connected ? t.connected : t.disconnected} ok={smartWheel.connected} />
          <DeviceStatusRow label={t.battery} value={`${smartWheel.battery}%`} />
          <DeviceStatusRow label={t.firmware} value={smartWheel.firmware} />
          <DeviceStatusRow label={t.sensorHealth} value={`${smartWheel.sensorHealth}%`} ok={smartWheel.sensorHealth > 80} />
          <DeviceStatusRow label={t.temperature} value={`${smartWheel.temperature}°C`} last />
        </GlassCard>

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.watchSection}</Text>
        <GlassCard accent>
          <DeviceStatusRow label={t.device} value={smartWatch.name} />
          <DeviceStatusRow label={t.status} value={smartWatch.connected ? t.connected : t.disconnected} ok={smartWatch.connected} />
          <DeviceStatusRow label={t.battery} value={`${smartWatch.battery}%`} />
          <DeviceStatusRow label={t.lastSync} value={t.justNow} />
          <DeviceStatusRow label={t.signalStrength} value={`${smartWatch.signal}%`} ok={smartWatch.signal > 60} last />
        </GlassCard>

        <Text style={[typography.subheading, styles.sectionTitle]}>{t.phoneSection}</Text>
        <GlassCard accent>
          <SensorRow label={t.gps} active={phone.gps} t={t} />
          <SensorRow label={t.accelerometer} active={phone.accelerometer} t={t} />
          <SensorRow label={t.gyroscope} active={phone.gyroscope} t={t} />
          <SensorRow label={t.motionDetection} active={phone.motion} t={t} />
          <SensorRow label={t.activeStatus} active={phone.active} t={t} last />
        </GlassCard>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

function DeviceStatusRow({ label, value, ok, last }: { label: string; value: string; ok?: boolean; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.valueRow}>
        {ok !== undefined && (
          <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={16} color={ok ? colors.safe : colors.danger} />
        )}
        <Text style={[typography.body, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

function SensorRow({ label, active, t, last }: { label: string; active: boolean; t: { active: string; inactive: string }; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={[typography.caption, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.sensorBadge, { backgroundColor: active ? colors.safeBg : colors.dangerBg }]}>
        <Text style={[typography.small, { color: active ? colors.safe : colors.danger }]}>
          {active ? t.active : t.inactive}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  ecosystem: { color: colors.primary, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 },
  sectionTitle: { color: colors.text, marginBottom: 10, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sensorBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
});

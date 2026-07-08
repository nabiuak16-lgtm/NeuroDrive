import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { GlassCard } from './GlassCard';

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  compact?: boolean;
}

export function MetricCard({ icon, label, value, unit, color = colors.primary, compact }: MetricCardProps) {
  if (compact) {
    return (
      <View style={styles.compact}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={[typography.small, styles.compactLabel]}>{label}</Text>
        <Text style={[typography.subheading, { color }]}>
          {value}{unit ? <Text style={styles.unit}> {unit}</Text> : null}
        </Text>
      </View>
    );
  }

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[typography.caption, styles.label]}>{label}</Text>
          <Text style={[typography.heading, { color: colors.text }]}>
            {value}
            {unit ? <Text style={[typography.caption, styles.unit]}> {unit}</Text> : null}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: '45%' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  label: { color: colors.textSecondary, marginBottom: 2 },
  unit: { color: colors.textMuted },
  compact: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
    minWidth: 90,
  },
  compactLabel: { color: colors.textMuted, marginTop: 4, marginBottom: 2, textAlign: 'center' },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface RiskBarProps {
  label: string;
  value: number;
}

function getBarColor(value: number): string {
  if (value < 35) return colors.safe;
  if (value < 60) return colors.warning;
  if (value < 80) return colors.orange;
  return colors.danger;
}

export function RiskBar({ label, value }: RiskBarProps) {
  const color = getBarColor(value);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.caption, styles.label]}>{label}</Text>
        <Text style={[typography.subheading, { color }]}>{value}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: colors.textSecondary },
  track: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
});

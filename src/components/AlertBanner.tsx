import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertLevel, colors, getAlertColor } from '../theme/colors';
import { typography } from '../theme/typography';
import { getAlertMessage } from '../utils/aiMessages';
import { useI18n } from '../i18n/I18nContext';

interface AlertBannerProps {
  level: AlertLevel;
}

const ICONS: Record<AlertLevel, keyof typeof Ionicons.glyphMap> = {
  green: 'shield-checkmark',
  yellow: 'warning',
  orange: 'alert-circle',
  red: 'skull',
  critical: 'nuclear',
};

export function AlertBanner({ level }: AlertBannerProps) {
  const { language } = useI18n();
  const color = getAlertColor(level);
  const bgColor = color + '18';

  return (
    <View style={[styles.banner, { backgroundColor: bgColor, borderColor: color + '40' }]}>
      <Ionicons name={ICONS[level]} size={22} color={color} />
      <Text style={[typography.body, styles.text, { color }]}>{getAlertMessage(level, language)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  text: { flex: 1 },
});

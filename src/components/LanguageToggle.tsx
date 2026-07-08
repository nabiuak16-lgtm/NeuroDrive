import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface LanguageToggleProps {
  compact?: boolean;
}

export function LanguageToggle({ compact }: LanguageToggleProps) {
  const { language, toggleLanguage } = useI18n();

  return (
    <TouchableOpacity
      style={[styles.button, compact && styles.compact]}
      onPress={toggleLanguage}
      activeOpacity={0.8}
    >
      <Ionicons name="language" size={compact ? 16 : 18} color={colors.primary} />
      <View style={styles.labels}>
        <Text style={[typography.small, styles.lang, language === 'ru' && styles.active]}>
          RU
        </Text>
        <Text style={styles.sep}>|</Text>
        <Text style={[typography.small, styles.lang, language === 'en' && styles.active]}>
          EN
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  labels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lang: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  active: {
    color: colors.primary,
  },
  sep: {
    color: colors.textMuted,
    fontSize: 10,
  },
});

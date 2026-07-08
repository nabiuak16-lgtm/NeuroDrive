import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accent?: boolean;
}

export function GlassCard({ children, style, accent }: GlassCardProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {accent && (
        <LinearGradient
          colors={['rgba(0,212,255,0.15)', 'rgba(26,107,255,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <BlurView intensity={25} tint="dark" style={styles.blur}>
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    backgroundColor: colors.glass,
  },
});

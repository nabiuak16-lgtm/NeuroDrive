import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { useI18n } from '../i18n/I18nContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const { width } = Dimensions.get('window');

export function SplashScreen() {
  const { t } = useI18n();
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);
  const ringOpacity = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.back(1.5)) });
    ringOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    ringScale.value = withDelay(400, withTiming(1, { duration: 800 }));
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value * 0.5,
    transform: [{ scale: ringScale.value * pulse.value }],
  }));

  return (
    <LinearGradient colors={['#050A14', '#0A1A30', '#050A14']} style={styles.container}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <Animated.View style={[styles.ring, styles.ring2, ringStyle]} />
      <Animated.View style={logoStyle}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.logoIcon}
          >
            <Text style={styles.logoSymbol}>N</Text>
          </LinearGradient>
        </View>
        <Animated.Text entering={FadeIn.delay(600).duration(800)} style={[typography.title, styles.title]}>
          {t.appName}
        </Animated.Text>
        <Animated.Text entering={FadeIn.delay(900).duration(800)} style={[typography.caption, styles.subtitle]}>
          {t.splashTagline}
        </Animated.Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(1400).duration(600)} style={styles.loader}>
        <View style={styles.loaderBar}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loaderFill}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  ring2: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderColor: colors.primary + '15',
  },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logoIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoSymbol: {
    fontSize: 44,
    fontWeight: '800',
    color: '#fff',
  },
  title: {
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  loader: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.5,
  },
  loaderBar: {
    height: 3,
    backgroundColor: colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderFill: {
    width: '70%',
    height: '100%',
    borderRadius: 2,
  },
});

export const colors = {
  background: '#050A14',
  backgroundSecondary: '#0A1220',
  surface: 'rgba(255,255,255,0.06)',
  surfaceLight: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.12)',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted: 'rgba(255,255,255,0.40)',
  primary: '#00D4FF',
  primaryDark: '#0099CC',
  cyan: '#00E5FF',
  blue: '#1A6BFF',
  gradientStart: '#00D4FF',
  gradientEnd: '#1A6BFF',
  safe: '#34D399',
  safeBg: 'rgba(52,211,153,0.15)',
  warning: '#FBBF24',
  warningBg: 'rgba(251,191,36,0.15)',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.15)',
  orange: '#F97316',
  orangeBg: 'rgba(249,115,22,0.15)',
  glass: 'rgba(15,25,45,0.75)',
  tabBar: 'rgba(8,14,28,0.95)',
};

export type AlertLevel = 'green' | 'yellow' | 'orange' | 'red' | 'critical';

export function getScoreColor(score: number): string {
  if (score >= 80) return colors.safe;
  if (score >= 50) return colors.warning;
  return colors.danger;
}

export function getAlertColor(level: AlertLevel): string {
  const map: Record<AlertLevel, string> = {
    green: colors.safe,
    yellow: colors.warning,
    orange: colors.orange,
    red: colors.danger,
    critical: '#DC2626',
  };
  return map[level];
}

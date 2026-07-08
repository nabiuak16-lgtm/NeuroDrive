export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 1): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}ч ${m}м`;
  if (m > 0) return `${m}м ${s}с`;
  return `${s}с`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function computeNeuroScore(vitals: {
  heartRate: number;
  hrv: number;
  stress: number;
  fatigue: number;
  focus: number;
}): number {
  const hrScore = vitals.heartRate >= 60 && vitals.heartRate <= 85 ? 100 : vitals.heartRate < 60 ? 70 : 50;
  const hrvScore = clamp(vitals.hrv * 1.2, 0, 100);
  const stressScore = 100 - vitals.stress;
  const fatigueScore = 100 - vitals.fatigue;
  const focusScore = vitals.focus;
  return Math.round((hrScore + hrvScore + stressScore + fatigueScore + focusScore) / 5);
}

import { Language } from '../i18n/types';

export function getDriverReadiness(neuroScore: number, lang: Language = 'ru'): string {
  if (neuroScore >= 80) return lang === 'ru' ? 'Высокая' : 'High';
  if (neuroScore >= 50) return lang === 'ru' ? 'Средняя' : 'Medium';
  return lang === 'ru' ? 'Низкая' : 'Low';
}

export function getRiskLevelText(level: string, lang: Language = 'ru'): string {
  const map: Record<Language, Record<string, string>> = {
    ru: {
      green: 'Низкий',
      yellow: 'Умеренный',
      orange: 'Повышенный',
      red: 'Высокий',
      critical: 'Критический',
    },
    en: {
      green: 'Low',
      yellow: 'Moderate',
      orange: 'Elevated',
      red: 'High',
      critical: 'Critical',
    },
  };
  return map[lang][level] || level;
}

export function getWeatherEmoji(weather: string): string {
  if (weather.includes('дождь')) return '🌧️';
  if (weather.includes('снег')) return '❄️';
  if (weather.includes('облач')) return '☁️';
  if (weather.includes('туман')) return '🌫️';
  return '☀️';
}

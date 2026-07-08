import { AlertLevel } from '../theme/colors';

export interface Vitals {
  heartRate: number;
  hrv: number;
  stress: number;
  fatigue: number;
  focus: number;
  hydration: number;
  bodyTemp: number;
  reactionTime: number;
}

export interface RiskPrediction {
  fatigue: number;
  stress: number;
  microsleep: number;
  dehydration: number;
  focusLoss: number;
  abnormalHR: number;
}

export interface DeviceStatus {
  smartWheel: { connected: boolean; battery: number; firmware: string; sensorHealth: number; temperature: number };
  smartWatch: { connected: boolean; name: string; battery: number; lastSync: string; signal: number };
  phone: { gps: boolean; accelerometer: boolean; gyroscope: boolean; motion: boolean; active: boolean };
}

export interface Trip {
  id: string;
  date: string;
  distance: number;
  duration: number;
  avgHeartRate: number;
  maxHeartRate: number;
  stressScore: number;
  fatigueScore: number;
  focusScore: number;
  neuroScore: number;
  riskLevel: AlertLevel;
  weather: string;
  avgSpeed: number;
  reactionTime: number;
  safetyEvents: number;
  aiSummary: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

export interface UserProfile {
  name: string;
  age: number;
  bloodType: string;
  driverType: string;
  experience: string;
  breakInterval: number;
  emergencyContact: { name: string; phone: string };
}

export interface Settings {
  notifications: boolean;
  darkTheme: boolean;
  privacy: boolean;
  language: 'ru' | 'en';
  aiSensitivity: number;
  demoMode: boolean;
}

export interface DriveSession {
  active: boolean;
  startTime: number | null;
  duration: number;
}

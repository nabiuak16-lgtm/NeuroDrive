import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Achievement, DriveSession, Settings, UserProfile } from '../types';
import { AlertLevel } from '../theme/colors';
import { createInitialState, tickSimulation, SimulationState } from '../utils/simulation';
import { getAISummary, getLiveObservation, getAssistantTip } from '../utils/aiMessages';
import { useI18n } from '../i18n/I18nContext';

interface AppContextType {
  simulation: SimulationState;
  profile: UserProfile;
  settings: Settings;
  driveSession: DriveSession;
  achievements: Achievement[];
  showSplash: boolean;
  showEmergency: boolean;
  showBreathing: boolean;
  liveObservations: string[];
  assistantTip: string;
  startDrive: () => void;
  stopDrive: () => void;
  dismissSplash: () => void;
  dismissEmergency: () => void;
  openBreathing: () => void;
  closeBreathing: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
}

const defaultProfile: UserProfile = {
  name: 'Алексей Таласбаев',
  age: 28,
  bloodType: 'A(II)+',
  driverType: 'Опытный',
  experience: '8 лет',
  breakInterval: 90,
  emergencyContact: { name: 'Мария Таласбаева', phone: '+7 (777) 123-45-67' },
};

const defaultSettings: Settings = {
  notifications: true,
  darkTheme: true,
  privacy: true,
  language: 'ru',
  aiSensitivity: 75,
  demoMode: true,
};

const achievementData = [
  { id: '1', icon: '🏆', unlocked: true },
  { id: '2', icon: '🏆', unlocked: true, progress: 73 },
  { id: '3', icon: '🏆', unlocked: false, progress: 85 },
  { id: '4', icon: '🏆', unlocked: false, progress: 60 },
  { id: '5', icon: '🧘', unlocked: true },
  { id: '6', icon: '🚗', unlocked: true },
];

const achievementTitles: Record<string, Record<'ru' | 'en', string>> = {
  '1': { ru: '7 дней безопасного вождения', en: '7 days of safe driving' },
  '2': { ru: '100 часов без риска', en: '100 hours risk-free' },
  '3': { ru: 'Идеальная концентрация', en: 'Perfect concentration' },
  '4': { ru: 'Безопасный водитель месяца', en: 'Safe driver of the month' },
  '5': { ru: 'Мастер дыхания', en: 'Breathing master' },
  '6': { ru: '50 поездок без инцидентов', en: '50 trips without incidents' },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { language, t } = useI18n();
  const [simulation, setSimulation] = useState<SimulationState>(() => {
    const state = createInitialState(language);
    state.aiSummary = getAISummary(language);
    return state;
  });
  const [profile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [driveSession, setDriveSession] = useState<DriveSession>({ active: false, startTime: null, duration: 0 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showSplash, setShowSplash] = useState(true);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [liveObservations, setLiveObservations] = useState<string[]>([t.systemActivated]);
  const [assistantTip, setAssistantTip] = useState(getAssistantTip(language));
  const prevAlert = useRef<AlertLevel>('green');

  useEffect(() => {
    setAchievements(
      achievementData.map((a) => ({
        ...a,
        title: achievementTitles[a.id][language],
      }))
    );
    setSettings((prev) => ({ ...prev, language }));
    setLiveObservations([t.systemActivated]);
    setAssistantTip(getAssistantTip(language));
    setSimulation((prev) => ({
      ...createInitialState(language),
      vitals: prev.vitals,
      neuroScore: prev.neuroScore,
      alertLevel: prev.alertLevel,
      aiSummary: getAISummary(language),
    }));
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulation((prev) => {
        const driveMinutes = driveSession.active && driveSession.startTime
          ? (Date.now() - driveSession.startTime) / 60000
          : 0;
        const next = tickSimulation(prev, driveMinutes, driveSession.active);

        if (next.alertLevel === 'critical' && prevAlert.current !== 'critical') {
          setShowEmergency(true);
        }
        prevAlert.current = next.alertLevel;

        if (next.vitals.stress > 60 && !showBreathing) {
          setAssistantTip(t.doBreathing);
        } else if (next.alertLevel === 'orange' || next.alertLevel === 'red') {
          setAssistantTip(getAssistantTip(language));
        }

        return next;
      });

      if (Math.random() < 0.4) {
        setLiveObservations((prev) => {
          const msg = getLiveObservation(language);
          const next = [msg, ...prev];
          return next.slice(0, 8);
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [driveSession.active, driveSession.startTime, showBreathing, language, t.doBreathing]);

  useEffect(() => {
    if (!driveSession.active) return;
    const timer = setInterval(() => {
      setDriveSession((prev) => ({
        ...prev,
        duration: prev.startTime ? Math.floor((Date.now() - prev.startTime) / 1000) : 0,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [driveSession.active, driveSession.startTime]);

  const startDrive = useCallback(() => {
    setDriveSession({ active: true, startTime: Date.now(), duration: 0 });
    setLiveObservations([t.driveStarted]);
  }, [t.driveStarted]);

  const stopDrive = useCallback(() => {
    setDriveSession({ active: false, startTime: null, duration: 0 });
    setLiveObservations((prev) => [t.driveEnded, ...prev]);
  }, [t.driveEnded]);

  const dismissSplash = useCallback(() => setShowSplash(false), []);
  const dismissEmergency = useCallback(() => {
    setShowEmergency(false);
    prevAlert.current = 'red';
  }, []);
  const openBreathing = useCallback(() => setShowBreathing(true), []);
  const closeBreathing = useCallback(() => setShowBreathing(false), []);
  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        simulation,
        profile,
        settings,
        driveSession,
        achievements,
        showSplash,
        showEmergency,
        showBreathing,
        liveObservations,
        assistantTip,
        startDrive,
        stopDrive,
        dismissSplash,
        dismissEmergency,
        openBreathing,
        closeBreathing,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

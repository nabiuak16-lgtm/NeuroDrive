import { AlertLevel } from '../theme/colors';
import { Trip, Vitals, RiskPrediction, DeviceStatus } from '../types';
import { randomBetween, randomFloat, clamp, computeNeuroScore } from './helpers';
import { getRandomWeather, getTripSummary } from './aiMessages';
import { Language } from '../i18n/types';

function generateVitals(): Vitals {
  return {
    heartRate: randomBetween(62, 88),
    hrv: randomBetween(35, 75),
    stress: randomBetween(15, 55),
    fatigue: randomBetween(10, 45),
    focus: randomBetween(65, 95),
    hydration: randomBetween(55, 90),
    bodyTemp: randomFloat(36.2, 37.1),
    reactionTime: randomFloat(0.18, 0.35, 2),
  };
}

function generateRisks(vitals: Vitals, driveMinutes: number): RiskPrediction {
  const fatigueBase = vitals.fatigue + driveMinutes * 0.3;
  const stressBase = vitals.stress + driveMinutes * 0.15;
  return {
    fatigue: clamp(Math.round(fatigueBase + randomBetween(-5, 10)), 0, 100),
    stress: clamp(Math.round(stressBase + randomBetween(-5, 10)), 0, 100),
    microsleep: clamp(Math.round(fatigueBase * 0.8 + randomBetween(0, 15)), 0, 100),
    dehydration: clamp(Math.round(100 - vitals.hydration + randomBetween(-5, 10)), 0, 100),
    focusLoss: clamp(Math.round(100 - vitals.focus + randomBetween(-5, 10)), 0, 100),
    abnormalHR: clamp(Math.round(Math.abs(vitals.heartRate - 72) * 1.5), 0, 100),
  };
}

function generateDevices(): DeviceStatus {
  const wheelConnected = Math.random() > 0.1;
  const watchConnected = Math.random() > 0.15;
  return {
    smartWheel: {
      connected: wheelConnected,
      battery: randomBetween(45, 100),
      firmware: '2.4.1',
      sensorHealth: randomBetween(85, 100),
      temperature: randomFloat(22, 28),
    },
    smartWatch: {
      connected: watchConnected,
      name: pickWatchName(),
      battery: randomBetween(30, 95),
      lastSync: 'Только что',
      signal: randomBetween(70, 100),
    },
    phone: {
      gps: true,
      accelerometer: true,
      gyroscope: true,
      motion: true,
      active: true,
    },
  };
}

function pickWatchName(): string {
  const watches = ['Apple Watch Series 9', 'Samsung Galaxy Watch 6', 'Garmin Venu 3', 'Huawei Watch GT 4'];
  return watches[randomBetween(0, watches.length - 1)];
}

function generateTrips(lang: Language = 'ru'): Trip[] {
  const trips: Trip[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * randomBetween(1, 3));
    const stress = randomBetween(15, 70);
    const fatigue = randomBetween(10, 65);
    const focus = randomBetween(55, 95);
    const avgHR = randomBetween(68, 95);
    const neuro = computeNeuroScore({ heartRate: avgHR, hrv: randomBetween(40, 70), stress, fatigue, focus });
    const riskLevel: AlertLevel = neuro >= 80 ? 'green' : neuro >= 60 ? 'yellow' : neuro >= 40 ? 'orange' : 'red';
    trips.push({
      id: `trip-${i}`,
      date: date.toISOString(),
      distance: randomFloat(5, 120, 1),
      duration: randomBetween(600, 7200),
      avgHeartRate: avgHR,
      maxHeartRate: avgHR + randomBetween(5, 25),
      stressScore: stress,
      fatigueScore: fatigue,
      focusScore: focus,
      neuroScore: neuro,
      riskLevel,
      weather: getRandomWeather(lang),
      avgSpeed: randomBetween(40, 90),
      reactionTime: randomFloat(0.2, 0.4, 2),
      safetyEvents: randomBetween(0, 4),
      aiSummary: getTripSummary(lang),
    });
  }
  return trips;
}

function generateChartData(points: number, min: number, max: number): number[] {
  const data: number[] = [];
  let current = randomBetween(min, max);
  for (let i = 0; i < points; i++) {
    current = clamp(current + randomBetween(-8, 8), min, max);
    data.push(current);
  }
  return data;
}

export interface SimulationState {
  vitals: Vitals;
  neuroScore: number;
  risks: RiskPrediction;
  devices: DeviceStatus;
  trips: Trip[];
  alertLevel: AlertLevel;
  liveObservation: string;
  aiSummary: string;
  chartData: {
    heartRate: number[];
    hrv: number[];
    stress: number[];
    fatigue: number[];
    neuroScore: number[];
    drivingDuration: number[];
    reactionTime: number[];
  };
  scores: { daily: number; weekly: number; monthly: number };
}

export function createInitialState(lang: Language = 'ru'): SimulationState {
  const vitals = generateVitals();
  const neuroScore = computeNeuroScore(vitals);
  return {
    vitals,
    neuroScore,
    risks: generateRisks(vitals, 0),
    devices: generateDevices(),
    trips: generateTrips(lang),
    alertLevel: neuroScore >= 80 ? 'green' : neuroScore >= 60 ? 'yellow' : neuroScore >= 40 ? 'orange' : 'red',
    liveObservation: 'Инициализация системы...',
    aiSummary: '',
    chartData: {
      heartRate: generateChartData(24, 60, 95),
      hrv: generateChartData(24, 30, 80),
      stress: generateChartData(24, 10, 70),
      fatigue: generateChartData(24, 5, 60),
      neuroScore: generateChartData(24, 50, 95),
      drivingDuration: generateChartData(7, 0, 180),
      reactionTime: generateChartData(24, 15, 40),
    },
    scores: {
      daily: neuroScore + randomBetween(-5, 5),
      weekly: randomBetween(65, 92),
      monthly: randomBetween(60, 88),
    },
  };
}

export function tickSimulation(
  state: SimulationState,
  driveMinutes: number,
  isDriving: boolean
): SimulationState {
  const drift = isDriving ? 1.5 : 0.5;
  const newVitals: Vitals = {
    heartRate: clamp(state.vitals.heartRate + randomBetween(-2, 3), 55, 110),
    hrv: clamp(state.vitals.hrv + randomBetween(-3, 2), 20, 90),
    stress: clamp(state.vitals.stress + randomBetween(-2, isDriving ? 3 : 1), 5, 95),
    fatigue: clamp(state.vitals.fatigue + (isDriving ? randomBetween(0, 2) : randomBetween(-1, 0)), 0, 95),
    focus: clamp(state.vitals.focus + randomBetween(-2, 1), 20, 100),
    hydration: clamp(state.vitals.hydration - (isDriving ? randomFloat(0, 0.3) : 0), 20, 100),
    bodyTemp: clamp(state.vitals.bodyTemp + randomFloat(-0.05, 0.05), 35.5, 38),
    reactionTime: clamp(state.vitals.reactionTime + randomFloat(-0.01, isDriving ? 0.02 : 0), 0.15, 0.5),
  };

  const neuroScore = computeNeuroScore(newVitals);
  const risks = generateRisks(newVitals, driveMinutes);

  let alertLevel: AlertLevel = 'green';
  if (neuroScore < 30 || risks.microsleep > 80) alertLevel = 'critical';
  else if (neuroScore < 45 || risks.fatigue > 70) alertLevel = 'red';
  else if (neuroScore < 60 || risks.fatigue > 50) alertLevel = 'orange';
  else if (neuroScore < 75 || risks.stress > 55) alertLevel = 'yellow';

  const devices = { ...state.devices };
  if (Math.random() < 0.02) {
    devices.smartWheel.connected = !devices.smartWheel.connected;
  }
  if (Math.random() < 0.015) {
    devices.smartWatch.connected = !devices.smartWatch.connected;
  }
  if (devices.smartWheel.connected) {
    devices.smartWheel.battery = clamp(devices.smartWheel.battery - randomFloat(0, 0.1), 5, 100);
  }
  if (devices.smartWatch.connected) {
    devices.smartWatch.battery = clamp(devices.smartWatch.battery - randomFloat(0, 0.15), 5, 100);
  }

  const chartData = { ...state.chartData };
  const pushAndTrim = (arr: number[], val: number) => {
    const next = [...arr, val];
    if (next.length > 24) next.shift();
    return next;
  };
  chartData.heartRate = pushAndTrim(chartData.heartRate, newVitals.heartRate);
  chartData.hrv = pushAndTrim(chartData.hrv, newVitals.hrv);
  chartData.stress = pushAndTrim(chartData.stress, newVitals.stress);
  chartData.fatigue = pushAndTrim(chartData.fatigue, newVitals.fatigue);
  chartData.neuroScore = pushAndTrim(chartData.neuroScore, neuroScore);
  chartData.reactionTime = pushAndTrim(chartData.reactionTime, Math.round(newVitals.reactionTime * 100));

  return {
    ...state,
    vitals: newVitals,
    neuroScore,
    risks,
    devices,
    alertLevel,
    chartData,
  };
}

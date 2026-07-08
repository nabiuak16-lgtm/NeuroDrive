import { Language } from '../i18n/types';

const LIVE_OBSERVATIONS: Record<Language, string[]> = {
  ru: [
    'Состояние стабильно.',
    'Пульс постепенно увеличивается.',
    'Обнаружено повышение уровня стресса.',
    'Концентрация начинает снижаться.',
    'Рекомендуется сделать короткий отдых.',
    'Показатели HRV в норме.',
    'Водитель демонстрирует хорошую концентрацию.',
    'Незначительное повышение усталости.',
    'Дыхание стабильное.',
    'Реакция водителя в пределах нормы.',
    'Обнаружены признаки обезвоживания.',
    'Рекомендуется проветрить салон.',
    'Микросон не обнаружен.',
    'Уровень стресса снижается.',
    'Фокус внимания восстанавливается.',
  ],
  en: [
    'Condition is stable.',
    'Heart rate is gradually increasing.',
    'Elevated stress level detected.',
    'Concentration is starting to decline.',
    'A short break is recommended.',
    'HRV readings are normal.',
    'Driver shows good concentration.',
    'Slight increase in fatigue.',
    'Breathing is stable.',
    'Driver reaction is within normal range.',
    'Signs of dehydration detected.',
    'Ventilate the cabin.',
    'No microsleep detected.',
    'Stress level is decreasing.',
    'Focus is recovering.',
  ],
};

const AI_SUMMARIES: Record<Language, string[]> = {
  ru: [
    'Сегодня водитель находится в хорошем состоянии. Риск ДТП минимален.',
    'Обнаружены умеренные признаки усталости. Рекомендуется перерыв.',
    'Показатели в пределах нормы. Безопасное вождение.',
    'Повышенный уровень стресса. Рекомендуется дыхательное упражнение.',
    'Отличное состояние водителя. Все системы в норме.',
    'Незначительное снижение концентрации. Будьте внимательны.',
  ],
  en: [
    'The driver is in good condition today. Accident risk is minimal.',
    'Moderate signs of fatigue detected. A break is recommended.',
    'All metrics are normal. Safe driving.',
    'Elevated stress level. A breathing exercise is recommended.',
    'Excellent driver condition. All systems normal.',
    'Slight decrease in concentration. Stay alert.',
  ],
};

const COACH_TIPS: Record<Language, string[]> = {
  ru: [
    'Сегодня рекомендуется делать перерыв каждые 90 минут.',
    'Ваш уровень стресса выше обычного.',
    'Качество сна влияет на безопасность вождения.',
    'Лучше избегать длительных поездок вечером.',
    'Пейте достаточно воды перед длительными поездками.',
    'Утренние поездки обычно безопаснее вечерних.',
    'Регулярные перерывы снижают риск микросна на 47%.',
    'Дыхательные упражнения помогают снизить стресс за 3 минуты.',
  ],
  en: [
    'Take a break every 90 minutes today.',
    'Your stress level is higher than usual.',
    'Sleep quality affects driving safety.',
    'Avoid long evening drives when possible.',
    'Drink enough water before long trips.',
    'Morning drives are usually safer than evening ones.',
    'Regular breaks reduce microsleep risk by 47%.',
    'Breathing exercises can reduce stress in 3 minutes.',
  ],
};

const ASSISTANT_TIPS: Record<Language, string[]> = {
  ru: [
    'Сделайте небольшой перерыв.',
    'Откройте окно.',
    'Выпейте воды.',
    'Выполните дыхательное упражнение.',
    'Снизьте скорость.',
    'Включите прохладный воздух.',
    'Сделайте лёгкую разминку шеи.',
    'Переключите музыку на спокойную.',
  ],
  en: [
    'Take a short break.',
    'Open the window.',
    'Drink some water.',
    'Do a breathing exercise.',
    'Reduce your speed.',
    'Turn on cool air.',
    'Do a light neck stretch.',
    'Switch to calm music.',
  ],
};

const ANALYTICS_INSIGHTS: Record<Language, string[]> = {
  ru: [
    'После двух часов непрерывного вождения стресс увеличивается на 31%.',
    'Наиболее безопасное время для поездок — 09:00–14:00.',
    'Средний уровень безопасности вырос на 14%.',
    'Ваш PulseScore выше среднего на 8% за эту неделю.',
    'Поездки в дождливую погоду увеличивают стресс на 22%.',
    'Оптимальный интервал перерывов для вас — 85 минут.',
  ],
  en: [
    'After two hours of continuous driving, stress increases by 31%.',
    'The safest driving time is 09:00–14:00.',
    'Average safety level increased by 14%.',
    'Your PulseScore is 8% above average this week.',
    'Driving in rain increases stress by 22%.',
    'Your optimal break interval is 85 minutes.',
  ],
};

const ALERT_MESSAGES: Record<Language, Record<string, string>> = {
  ru: {
    green: 'Все показатели в норме. Безопасное вождение.',
    yellow: 'Обнаружены первые признаки усталости.',
    orange: 'Рекомендуется сделать остановку в течение 15 минут.',
    red: 'Высокий риск опасного состояния.',
    critical: 'Критическое состояние водителя.',
  },
  en: {
    green: 'All metrics normal. Safe driving.',
    yellow: 'Early signs of fatigue detected.',
    orange: 'A stop is recommended within 15 minutes.',
    red: 'High risk of dangerous condition.',
    critical: 'Critical driver condition.',
  },
};

const TRIP_SUMMARIES: Record<Language, string[]> = {
  ru: [
    'Во время поездки было обнаружено два периода высокого стресса. Рекомендуется сократить продолжительность непрерывного вождения.',
    'Поездка прошла в штатном режиме. Все показатели в пределах нормы.',
    'Зафиксирован один эпизод снижения концентрации. Рекомендуется перерыв через 60 минут.',
    'Отличная поездка! PulseScore оставался выше 80 на протяжении всего маршрута.',
    'Обнаружены признаки усталости в последней трети маршрута.',
  ],
  en: [
    'Two periods of high stress were detected during the trip. Reduce continuous driving duration.',
    'Trip completed normally. All metrics within range.',
    'One episode of reduced concentration recorded. Take a break after 60 minutes.',
    'Great trip! PulseScore stayed above 80 throughout the route.',
    'Signs of fatigue detected in the last third of the route.',
  ],
};

const WEATHER_OPTIONS: Record<Language, string[]> = {
  ru: [
    'Ясно, +22°C',
    'Облачно, +18°C',
    'Лёгкий дождь, +15°C',
    'Солнечно, +25°C',
    'Туман, +12°C',
    'Переменная облачность, +20°C',
  ],
  en: [
    'Clear, +22°C',
    'Cloudy, +18°C',
    'Light rain, +15°C',
    'Sunny, +25°C',
    'Fog, +12°C',
    'Partly cloudy, +20°C',
  ],
};

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getLiveObservation(lang: Language = 'ru'): string {
  return pickRandom(LIVE_OBSERVATIONS[lang]);
}

export function getAISummary(lang: Language = 'ru'): string {
  return pickRandom(AI_SUMMARIES[lang]);
}

export function getCoachTip(lang: Language = 'ru'): string {
  return pickRandom(COACH_TIPS[lang]);
}

export function getAssistantTip(lang: Language = 'ru'): string {
  return pickRandom(ASSISTANT_TIPS[lang]);
}

export function getAnalyticsInsight(lang: Language = 'ru'): string {
  return pickRandom(ANALYTICS_INSIGHTS[lang]);
}

export function getAlertMessage(level: string, lang: Language = 'ru'): string {
  return ALERT_MESSAGES[lang][level] || ALERT_MESSAGES[lang].green;
}

export function getTripSummary(lang: Language = 'ru'): string {
  return pickRandom(TRIP_SUMMARIES[lang]);
}

export function getRandomWeather(lang: Language = 'ru'): string {
  return pickRandom(WEATHER_OPTIONS[lang]);
}

export function getAllCoachTips(lang: Language = 'ru'): string[] {
  return COACH_TIPS[lang];
}

export function getAllAnalyticsInsights(lang: Language = 'ru'): string[] {
  return ANALYTICS_INSIGHTS[lang];
}

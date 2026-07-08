export type Language = 'ru' | 'en';

export type TranslationKey = keyof typeof import('./translations').translations.ru;

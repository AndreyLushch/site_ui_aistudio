/**
 * Theme tokens for «Настолки»
 * Single source of truth for design tokens in both Light and Dark themes.
 */

export interface ThemeColors {
  pageBg: string;
  card: string;
  warmCard: string;
  softBg: string;
  line: string;
  text: string;
  secondaryText: string;
  primaryAction: string;
  primaryActionHover: string;
  primaryActionText: string;
  softAccent: string;
  accentText: string;
  successText: string;
  successBg: string;
  dangerText: string;
  dangerBg: string;
}

export const lightTokens: ThemeColors = {
  pageBg: '#f6f2ec',
  card: '#ffffff',
  warmCard: '#fdf8ef',
  softBg: '#f3ece1',
  line: '#e9dfcf',
  text: '#1f1a14',
  secondaryText: '#6b5f50',
  primaryAction: '#b45309',
  primaryActionHover: '#92400e',
  primaryActionText: '#ffffff',
  softAccent: '#fdf0d5',
  accentText: '#8a3c0b',
  successText: '#15803d',
  successBg: '#e7f6ec',
  dangerText: '#b91c1c',
  dangerBg: '#fdecec',
};

export const darkTokens: ThemeColors = {
  pageBg: '#13110e',
  card: '#1d1915',
  warmCard: '#231d16',
  softBg: '#2a231b',
  line: '#3a3127',
  text: '#f5efe6',
  secondaryText: '#b5a998',
  primaryAction: '#f59e0b',
  primaryActionHover: '#d97706',
  primaryActionText: '#1f1406',
  softAccent: 'rgba(245, 158, 11, 0.14)',
  accentText: '#fcd34d',
  successText: '#4ade80',
  successBg: 'rgba(74, 222, 128, 0.12)',
  dangerText: '#f87171',
  dangerBg: 'rgba(248, 113, 113, 0.12)',
};

export type StylePresetId = 'cozy' | 'neo' | 'night';

export interface StylePreset {
  id: StylePresetId;
  name: string;
  description: string;
  radiusClass: string;
  headingFontClass: string;
  borderWeightClass: string;
  badgeStyle: 'soft' | 'solid' | 'outline';
}

export const stylePresets: Record<StylePresetId, StylePreset> = {
  cozy: {
    id: 'cozy',
    name: 'Уютная гостиная',
    description: 'Тёплая эстетика домашнего вечера, заголовки с засечками (Lora), мягкие скругления',
    radiusClass: 'rounded-2xl',
    headingFontClass: 'font-serif',
    borderWeightClass: 'border',
    badgeStyle: 'soft',
  },
  neo: {
    id: 'neo',
    name: 'Нео-Настолки',
    description: 'Современный чёткий дизайн, плотный гротеск (Manrope), контрастные акценты',
    radiusClass: 'rounded-xl',
    headingFontClass: 'font-sans font-bold',
    borderWeightClass: 'border',
    badgeStyle: 'solid',
  },
  night: {
    id: 'night',
    name: 'Ночная вечеринка',
    description: 'Атмосфера клубного лаунджа, янтарный свет, глубокие текстуры',
    radiusClass: 'rounded-3xl',
    headingFontClass: 'font-serif italic font-semibold',
    borderWeightClass: 'border border-amber-900/30',
    badgeStyle: 'outline',
  },
};

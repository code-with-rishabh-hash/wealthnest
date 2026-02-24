export interface Theme {
  isDark: boolean;
  bg: string;
  bgGrad: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderHover: string;
  text: string;
  textSoft: string;
  textSec: string;
  textMut: string;
  accent: string;
  accentDk: string;
  accentBg: string;
  accentBd: string;
  success: string;
  successBg: string;
  danger: string;
  dangerBg: string;
  dangerTxt: string;
  warning: string;
  warningBg: string;
  warningTxt: string;
  info: string;
  infoBg: string;
  nominee: string;
  inputBg: string;
  inputBd: string;
  inputFocus: string;
  inputTxt: string;
  optBg: string;
  optTxt: string;
  headerBg: string;
  scroll: string;
  shadow: string;
  cardShadow: string;
  chartAxis: string;
  chartLabel: string;
  tipBg: string;
  tipBd: string;
  tipTxt: string;
  calFilter: string;
  ghostBg: string;
  ghostBd: string;
  ghostTxt: string;
  outlineTxt: string;
  outlineBd: string;
  cursor: string;
  barLabel: string;
  tagBg: (color: string) => string;
  gradStart: string;
  gradEnd: string;
  expBg: (color: string) => string;
}

export type ThemeName = 'dark' | 'light';

export const THEMES: Record<ThemeName, Theme> = {
  dark: {
    isDark: true,
    bg: '#0b0d11',
    bgGrad: 'radial-gradient(ellipse at 30% 20%,#0f1f17 0%,#0b0d11 50%,#080a0e 100%)',
    surface: '#141720',
    surfaceAlt: '#1c1f29',
    border: 'rgba(255,255,255,0.06)',
    borderHover: 'rgba(255,255,255,0.12)',
    text: '#e2e8f0',
    textSoft: '#cbd5e1',
    textSec: '#8b95a8',
    textMut: '#525c6f',
    accent: '#34d399',
    accentDk: '#059669',
    accentBg: 'rgba(16,185,129,0.08)',
    accentBd: 'rgba(16,185,129,0.2)',
    success: '#22c55e',
    successBg: 'rgba(34,197,94,0.06)',
    danger: '#ef4444',
    dangerBg: 'rgba(239,68,68,0.08)',
    dangerTxt: '#fca5a5',
    warning: '#f59e0b',
    warningBg: 'rgba(245,158,11,0.06)',
    warningTxt: '#fbbf24',
    info: '#3b82f6',
    infoBg: 'rgba(59,130,246,0.06)',
    nominee: '#93c5fd',
    inputBg: 'rgba(255,255,255,0.04)',
    inputBd: 'rgba(255,255,255,0.1)',
    inputFocus: 'rgba(52,211,153,0.5)',
    inputTxt: '#e8e8e8',
    optBg: '#1a1d23',
    optTxt: '#ddd',
    headerBg: 'rgba(11,13,17,0.92)',
    scroll: 'rgba(255,255,255,0.08)',
    shadow: '0 8px 32px rgba(0,0,0,0.4)',
    cardShadow: 'none',
    chartAxis: '#555',
    chartLabel: '#aaa',
    tipBg: '#1c1f29',
    tipBd: 'rgba(255,255,255,0.1)',
    tipTxt: '#ddd',
    calFilter: 'invert(0.5)',
    ghostBg: 'rgba(255,255,255,0.04)',
    ghostBd: 'rgba(255,255,255,0.1)',
    ghostTxt: '#ccc',
    outlineTxt: '#6ee7b7',
    outlineBd: 'rgba(52,211,153,0.35)',
    cursor: 'rgba(255,255,255,0.05)',
    barLabel: '#fff',
    tagBg: (c: string) => c + '18',
    gradStart: '#1a3a2f',
    gradEnd: '#0d2420',
    expBg: (c: string) => c + '15',
  },
  light: {
    isDark: false,
    bg: '#f4f6fb',
    bgGrad: 'radial-gradient(ellipse at 30% 20%,#e0f5ee 0%,#f4f6fb 50%,#eee8f8 100%)',
    surface: '#ffffff',
    surfaceAlt: '#f8f9fc',
    border: 'rgba(0,0,0,0.07)',
    borderHover: 'rgba(0,0,0,0.14)',
    text: '#111827',
    textSoft: '#1f2937',
    textSec: '#4b5563',
    textMut: '#9ca3af',
    accent: '#059669',
    accentDk: '#047857',
    accentBg: 'rgba(5,150,105,0.05)',
    accentBd: 'rgba(5,150,105,0.2)',
    success: '#16a34a',
    successBg: 'rgba(22,163,74,0.06)',
    danger: '#dc2626',
    dangerBg: 'rgba(220,38,38,0.06)',
    dangerTxt: '#991b1b',
    warning: '#d97706',
    warningBg: 'rgba(217,119,6,0.06)',
    warningTxt: '#92400e',
    info: '#2563eb',
    infoBg: 'rgba(37,99,235,0.06)',
    nominee: '#1d4ed8',
    inputBg: '#f9fafb',
    inputBd: 'rgba(0,0,0,0.12)',
    inputFocus: 'rgba(5,150,105,0.5)',
    inputTxt: '#111827',
    optBg: '#ffffff',
    optTxt: '#333',
    headerBg: 'rgba(244,246,251,0.95)',
    scroll: 'rgba(0,0,0,0.12)',
    shadow: '0 8px 32px rgba(0,0,0,0.08)',
    cardShadow: '0 1px 3px rgba(0,0,0,0.06)',
    chartAxis: '#9ca3af',
    chartLabel: '#4b5563',
    tipBg: '#ffffff',
    tipBd: 'rgba(0,0,0,0.1)',
    tipTxt: '#333',
    calFilter: 'none',
    ghostBg: 'rgba(0,0,0,0.04)',
    ghostBd: 'rgba(0,0,0,0.1)',
    ghostTxt: '#4b5563',
    outlineTxt: '#059669',
    outlineBd: 'rgba(5,150,105,0.3)',
    cursor: 'rgba(0,0,0,0.04)',
    barLabel: '#fff',
    tagBg: (c: string) => c + '14',
    gradStart: '#e0f2f1',
    gradEnd: '#e8f5e9',
    expBg: (c: string) => c + '10',
  },
};

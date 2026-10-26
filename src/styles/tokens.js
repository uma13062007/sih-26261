/**
 * NIYANTRAN — Centralized Design System Tokens
 * Reconciled with DESIGN.md and index.css (Light Neutral Default & Obsidian Dark)
 */

export const themes = {
  experimental: {
    name: 'Light Neutral (Default)',
    id: 'theme-experimental',
    bg: '#F5F7FB',
    surface: '#FFFFFF',
    elevated: '#F8FAFD',
    secondary: '#F1F5F9',
    border: '#DCE4EE',
    textPrimary: '#172B4D',
    textSecondary: '#52637A',
    textMuted: '#75839A',
    accentPrimary: '#2457C5',
    accentSecondary: '#64748B',
    statusSuccess: '#187347',
    statusWarning: '#A16207',
    statusPending: '#946200',
    statusError: '#B42318',
  },
  obsidian: {
    name: 'Obsidian Dark',
    id: 'theme-obsidian',
    bg: '#090D14',
    surface: '#131A26',
    elevated: '#1B2434',
    secondary: '#2E3C54',
    border: '#3E4F69',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    accentPrimary: '#5B8CFF',
    accentSecondary: '#42C6B7',
    statusSuccess: '#22C55E',
    statusWarning: '#F97316',
    statusPending: '#FACC15',
    statusError: '#EF4444',
  }
};

export const typography = {
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  fontMono: 'JetBrains Mono, monospace',
};

export default {
  themes,
  typography,
};

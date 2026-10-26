import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const THEMES = {
  EXPERIMENTAL: 'theme-experimental', // Light Neutral enterprise palette
  OBSIDIAN: 'theme-obsidian',         // Optional dark palette
};

export const THEME_METADATA = [
  {
    id: THEMES.EXPERIMENTAL,
    name: 'Light Neutral (Default)',
    description: 'Readable enterprise palette with soft slate surfaces, clear borders, deep navy text and a restrained blue action colour.',
    swatches: ['#F5F7FB', '#FFFFFF', '#DCE4EE', '#172B4D', '#2457C5'],
  },
  {
    id: THEMES.OBSIDIAN,
    name: 'Obsidian Dark',
    description: 'High-contrast dark preset: #090D14 canvas, #131A26 surfaces, #3E4F69 structural borders, and #5B8CFF neon blue accent.',
    swatches: ['#090D14', '#131A26', '#1B2434', '#3E4F69', '#5B8CFF'],
  },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('niyantran_theme');
    if (saved === THEMES.OBSIDIAN) return THEMES.OBSIDIAN;
    return THEMES.EXPERIMENTAL;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(THEMES.EXPERIMENTAL, THEMES.OBSIDIAN);
    root.classList.add(theme);
    root.classList.toggle('dark', theme === THEMES.OBSIDIAN);
    root.setAttribute('data-theme', theme);
    localStorage.setItem('niyantran_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === THEMES.EXPERIMENTAL ? THEMES.OBSIDIAN : THEMES.EXPERIMENTAL
    );
  };

  const currentTheme = THEME_METADATA.find((t) => t.id === theme) || THEME_METADATA[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, THEMES, themes: THEME_METADATA, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

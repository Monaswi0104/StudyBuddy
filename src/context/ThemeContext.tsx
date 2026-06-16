import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, DARK_COLORS } from '../constants/colors';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof COLORS;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? DARK_COLORS : COLORS;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

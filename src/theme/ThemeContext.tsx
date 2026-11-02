import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  header: string;
  border: string;
  inputBg: string;
  success: string;
  danger: string;
};

const lightColors: ThemeColors = {
  background: '#f0f2f5',
  card: '#ffffff',
  text: '#222222',
  textSecondary: '#666666',
  primary: '#003366',
  header: '#003366',
  border: '#e0e0e0',
  inputBg: '#f5f5f5',
  success: '#2e7d32',
  danger: '#c62828',
};

const darkColors: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f5f5f5',
  textSecondary: '#aaaaaa',
  primary: '#4a90d9',
  header: '#0d1b2a',
  border: '#333333',
  inputBg: '#2a2a2a',
  success: '#66bb6a',
  danger: '#ef5350',
};

type ThemeContextType = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    await AsyncStorage.setItem('themeMode', next);
  };

  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
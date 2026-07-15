'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type TextSize = 'normal' | 'large' | 'xlarge';

interface ThemeContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>('large'); // default to large for elderly friendly UI!

  useEffect(() => {
    // Load preference from localStorage if available
    const saved = localStorage.getItem('ward-text-size') as TextSize;
    if (saved && ['normal', 'large', 'xlarge'].includes(saved)) {
      setTextSizeState(saved);
    }
  }, []);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('ward-text-size', size);
    
    // Apply class to document element (html)
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
      root.classList.add(`text-size-${size}`);
    }
  };

  // Sync class on initial load
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
      root.classList.add(`text-size-${textSize}`);
    }
  }, [textSize]);

  return (
    <ThemeContext.Provider value={{ textSize, setTextSize }}>
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
